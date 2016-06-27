/*                                                                       *
 * Copyright 2014 Georg Großberger <contact@grossberger-ge.org>          *
 *                                                                       *
 * This is free software; you can redistribute it and/or modify it under *
 * the terms of the MIT- / X11 - License                                 *
 *                                                                       */

module.exports = function(options, files, callback) {

	var merge = require("merge");
	var async = require("async");
	var steps = [];
	var defaultOptions = {
		linksPerPage: 10,
		baseUrl: "/",
		minimize: true,
		paginationSuffix: "/page-{{ PAGE }}",
		tagPagePrefix: "tags/",
		categoryPagePrefix: "categories/",
		layoutsDirectory: "./layouts/**.*",
		defaultLayout: "default",
		listLayout: "list",
		partials: "./partials/*",
		helpers: "./helpers/*",
		buildDirectory: "./_build/",
		generateSitemap: true,
		sitemap: {
			frequency: {
				list: "monthly",
				index: "weekly",
				post: "yearly"
			},
			priority: {
				list: 0.8,
				index: 0.9,
				post: 1
			},
			target: "sitemap.xml"
		},
	};

	var resultingFiles = [];

	options = merge({}, defaultOptions, options);

	// Read post files
	steps.push(function(callback) {
		async.map(
			files,
			require("./modules/filereader.js"),
			function(err, result) {
				callback(err, result);
			}
		);
	});

	// Sort posts by date
	steps.push(function(posts, callback) {
		var sorter = require("./modules/sorter.js");
		sorter(posts, options, function(err, newPosts) {
			callback(err, newPosts);
		});
	});

	// Create the list of actual HTML files that need to be created
	steps.push(function(posts, callback) {
		var htmlFiles = require("./modules/files.js");
		htmlFiles(posts, options, callback);
	});

	// Prep handlebars and render the scheduled HTMLs
	steps.push(function(data, callback) {
		var pages = data.all;
		var loadEngine = require("./render/engine.js");

		delete data.all;

		loadEngine(options, pages, function(err, result) {
			if (err) {
				callback(err);
			} else {
				async.parallel(
					pages.map(function(page) {
						return function(cb) {
							var renderer = require("./render/page.js");
							renderer(page, result, options, result.handlebars, function(err, fileData) {
								if (err) {
									cb(err);
								} else {
									resultingFiles.push(fileData);
									cb(null)
								}
							});
						}
					}),
					function(err) {
						if (options.generateSitemap && !err) {
							var sitemap = require("./render/sitemap.js");
							sitemap(options, pages, function(err, fileData) {
								if (err) {
									callback(err);
								} else {
									resultingFiles.push(fileData);
									callback(null);
								}
							});
						} else {
							callback(err || null);
						}
					}
				)
			}
		});
	});


	async.waterfall(steps, function(err, result) {
		callback(err, resultingFiles);
	});
};
