/*                                                                       *
 * This is free software; you can redistribute it and/or modify it under *
 * the terms of the MIT- / X11 - License                                 *
 *                                                                       */

module.exports = function(options, pages, callback) {

	/* from https://gist.github.com/tristanlins/6585391 */
	function toW3CString(date) {
		var year = date.getFullYear();
		var month = date.getMonth();
		month ++;
		if (month < 10) {
			month = '0' + month;
		}
		var day = date.getDate();
		if (day < 10) {
			day = '0' + day;
		}
		var hours = date.getHours();
		if (hours < 10) {
			hours = '0' + hours;
		}
		var minutes = date.getMinutes();
		if (minutes < 10) {
			minutes = '0' + minutes;
		}
		var seconds = date.getSeconds();
		if (seconds < 10) {
			seconds = '0' + seconds;
		}
		var offset = -date.getTimezoneOffset();
		var offsetHours = Math.abs(Math.floor(offset / 60));
		var offsetMinutes = Math.abs(offset) - offsetHours * 60;
		if (offsetHours < 10) {
			offsetHours = '0' + offsetHours;
		}
		if (offsetMinutes < 10) {
			offsetMinutes = '0' + offsetMinutes;
		}
		var offsetSign = '+';
		if (offset < 0) {
			offsetSign = '-';
		}
		return year + '-' + month + '-' + day +
			'T' + hours + ':' + minutes + ':' + seconds +
			offsetSign + offsetHours + ':' + offsetMinutes;
	}

	var xml =
'<?xml version="1.0" encoding="UTF-8"?>\n\
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n\
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n\
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">';

	var latestDate;
	var latestCategoryDate = {};
	var latestTagDate = {};

	pages.forEach(function(page) {
		if (page.data && page.data.date) {
			var date = page.data.date;
			if (!latestDate) {
				latestDate = date;
			} else if (latestDate.getTime() < date.getTime()) {
				latestDate = date;
			}

			if (page.data.categories && page.data.categories.length) {
				page.data.categories.forEach(function(c) {
					if (!latestCategoryDate[c]) {
						latestCategoryDate[c] = date;
					} else if (latestCategoryDate[c].getTime() < date.getTime()) {
						latestCategoryDate[c] = date;
					}
				});
			}

			if (page.data.tags && page.data.tags.length) {
				page.data.tags.forEach(function(t) {
					if (!latestTagDate[t]) {
						latestTagDate[t] = date;
					} else if (latestTagDate[t].getTime() < date.getTime()) {
						latestTagDate[t] = date;
					}
				});
			}
		}
	});

	pages.forEach(function(page) {
		var url = options.baseUrl + page.target + '.html';
		var priority = 1, freq = "weekly", lastModified = latestDate;

		if (page.data) {
			lastModified = page.data.date;
			priority = options.sitemap.priority.post;
			freq = options.sitemap.frequency.post;
		} else if (page.target.substr(0, 3) == "tag") {
			lastModified = latestTagDate[page.title];
			priority = options.sitemap.priority.list;
			freq = options.sitemap.frequency.list;
		} else if (page.target.substr(0, 7) == "categor") {
			lastModified = latestCategoryDate[page.title];
			priority = options.sitemap.priority.list;
			freq = options.sitemap.frequency.list;
		} else if (page.target.substr(0, 5) == "index") {
			lastModified = latestDate
			priority = options.sitemap.priority.index;
			freq = options.sitemap.frequency.index;
		}

		xml += "\n\
  <url>\n\
    <loc>" + url + "</loc>\n\
    <lastmod>" + toW3CString(lastModified) + "</lastmod>\n\
    <changefreq>" + freq + "</changefreq>\n\
    <priority>" + priority + "</priority>\n\
  </url>";
	});

	xml += "\n\
</urlset>";

	var writeFile = require("../util/writeFile.js");
	writeFile(options.buildDirectory + options.sitemap.target, xml, callback);

};
