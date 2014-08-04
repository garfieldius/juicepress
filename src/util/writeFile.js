/*                                                                       *
 * This is free software; you can redistribute it and/or modify it under *
 * the terms of the MIT- / X11 - License                                 *
 *                                                                       */

var fs = require("fs"),
	mkdir = require("mkdirp"),
	path = require("path");

module.exports = function(file, content, callback) {

	file = path.resolve(process.cwd(), file);
	var parts = file.split(path.sep);
	parts.pop();

	var dir = parts.join(path.sep);

	mkdir(dir, function(err) {
		if (err) {
			callback(err);
		} else {
			fs.writeFile(file, content, function(err) {
				if (err) {
					callback(err);
				} else {
					callback(null, file);
				}
			});
		}
	});
};
