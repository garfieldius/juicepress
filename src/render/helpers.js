/*                                                                       *
 * Copyright 2014 Georg Großberger <contact@grossberger-ge.org>          *
 *                                                                       *
 * This is free software; you can redistribute it and/or modify it under *
 * the terms of the MIT- / X11 - License                                 *
 *                                                                       */

module.exports = function(Handlebars, options, posts) {

	function linkToPage(page, base) {
		var url = page;
		var base = trim(base || options.baseUrl);

		if (page.target) {
			url = page.target;
		}

		url = trim(url);

		if (url !== "index") {
			url = base + url + ".html";
		} else {
			url = base;
		}
		return url;
	}

	function trim(val) {
		return val.toString().trim();
	}

	Handlebars.registerHelper("obfuscate", function(str) {
		if (!str || !str.length) {
			return str;
		}

		var len = str.length;
		var parts = [];

		while(len--) {
			parts.push(str.charCodeAt(len));
		}
		return parts.join(";");
	});

	Handlebars.registerHelper("link_page", function(page) {
		return linkToPage(page, this.baseUrl);
	});
	Handlebars.registerHelper("link_post", function(name) {

		if (typeof name !== "string" || name.length < 1) {
			throw new Error("Cannot link to an empty post");
		}

		var len = posts.length;
		var titleTest = new RegExp(name, 'i');
		var targetTest = new RegExp(name + '$');

		while (len--) {
			var title = posts[len].data.title;
			var target = posts[len].target;

			if (titleTest.test(title) || targetTest.test(target)) {
				return linkToPage(target);
			}
		}
	});

	Handlebars.registerHelper("link_tag", function(tag) {
		var toUrl = require("../util/translit.js").urlSafe;
		return linkToPage(options.tagPagePrefix + toUrl(tag));
	});

	Handlebars.registerHelper("link_category", function(tag) {
		var toUrl = require("../util/translit.js").urlSafe;
		return linkToPage(options.categoryPagePrefix + toUrl(tag));
	});

	Handlebars.registerHelper("paging", function() {

		var html = "";
		var paging = this.paging;
		var base = this.baseUrl;

		function link(index) {
			return linkToPage(paging.urls[index], base);
		}

		if (paging && paging.count > 1 && paging.current) {

			html = '<ul class="pagination">';

			var current = paging.current - 1;
			var prev = current - 1;
			var next = current + 1;

			if (paging.urls[prev]) {
				html += '<li><a href="' + link(prev) + '">&laquo;</a></li>';
			} else {
				html += '<li class="disabled"><span>&laquo;</span></li>';
			}

			for (var p = 0; p < paging.count; p++) {
				if (current == p) {
					html += '<li class="active"><a href="#">' + (p + 1) + '</a></li>'
				} else {
					html += '<li><a href="' + link(p) + '">' + (p + 1) + '</a></li>'
				}
			}

			if (paging.urls[next]) {
				html += '<li><a href="' + link(next) + '">&raquo;</a></li>';
			} else {
				html += '<li class="disabled"><span>&raquo;</span></li>';
			}

			html += "</ul>";
		}

		return html;
	});
};
