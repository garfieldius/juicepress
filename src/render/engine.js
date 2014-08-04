/*                                                                       *
 * Copyright 2014 Georg Großberger <contact@grossberger-ge.org>          *
 *                                                                       *
 * This is free software; you can redistribute it and/or modify it under *
 * the terms of the MIT- / X11 - License                                 *
 *                                                                       */

module.exports = function(options, posts, callback) {

	var Handlebars = require("handlebars");
	var glob = require("glob");
	var fs = require("fs");
	var async = require("async");

	var result = {
		handlebars: Handlebars,
		layouts: {}
	};

	function nameFromFile(file) {
		var name = file.split("/").pop();
		return name.replace(/\.([a-z]+)$/, '');
	}

	glob(options.helpers, function(err, files) {

		if (err) {
			callback(err);
			return;
		}

		var resolve = require("path").resolve;
		var builtInHelpers = require("./helpers.js");

		builtInHelpers(Handlebars, options, posts);

		async.parallel(files.map(function(file) {
			return function(cb) {
				try {
					var helper = require(resolve(process.cwd(), file));
					helper(Handlebars, options, posts);
					cb();
				} catch (err) {
					cb(err);
				}
			}
		}), function(err) {
			if (err) {
				callback(err);
				return;
			}

			glob(options.partials, function(err, files) {

				if (err) {
					callback(err);
					return;
				}

				async.parallel(files.map(function(file) {
					return function(cb) {
						fs.readFile(file, function(err, contents) {
							if (err) {
								cb(err);
								return;
							}
							Handlebars.registerPartial(nameFromFile(file), contents.toString());
							cb();
						});
					};
				}), function(err) {
					if (err) {
						callback(err)
						return;
					}
					glob(options.layouts, function(err, files) {
						if (err) {
							callback(err);
						}

						async.parallel(files.map(function(file) {
							return function(cb) {
								fs.readFile(file, function(err, contents) {
									if (err) {
										cb(err);
									} else {
										result.layouts[nameFromFile(file)] = Handlebars.compile(contents.toString());
										cb();
									}
								});
							}
						}), function(err) {
							if (err) {
								callback(err)
							} else {
								callback(null, result);
							}
						});
					});
				});
			})
		});
	});
};
