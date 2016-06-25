/*                                                                       *
 * Copyright 2014 Georg Großberger <contact@grossberger-ge.org>          *
 *                                                                       *
 * This is free software; you can redistribute it and/or modify it under *
 * the terms of the MIT- / X11 - License                                 *
 *                                                                       */

var marked    = require("marked");
var merge     = require("merge");
var highlight = require('highlight.js');
var minimizer;

marked.setOptions({
	highlight: function(code) {
		return highlight.highlightAuto(code).value;
	}
});

module.exports = function(page, data, options, handlebars, cb) {

	var layout;
	var context = merge({}, options, data, page.data, page);

	delete context["layouts"];
	delete context["data"];
	delete context["handlebars"];

	if (page.content) {
		var contents = handlebars.compile(page.content.toString());
		context.content = marked(contents(context).toString()).toString();
		layout = page.data.layout || options.defaultLayout || "default";
	} else {
		layout = options.listLayout || "list";
	}

	var template = data.layouts[layout] || data.layouts[options.defaultLayout] || data.layouts["default"];
	var targetFile = page.target + ".html";

	context.filename  = targetFile;
	context.canonical = options.baseUrl + targetFile;

	var content = template(context).toString();

	if (options.minimize) {
		if (!minimizer) {
			var Minimize = require("minimize");
			minimizer = new Minimize(options.minimizeOptions);
		}
		minimizer.parse(content, function(err, data) {
			if (err) {
				cb(err);
			} else {
				cb(null, {file: targetFile, content: data});
			}
		});
	} else {
		cb(null, {file: targetFile, content: content});
	}
};
