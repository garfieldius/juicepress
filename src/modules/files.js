/*                                                                       *
 * Copyright 2014 Georg Großberger <contact@grossberger-ge.org>          *
 *                                                                       *
 * This is free software; you can redistribute it and/or modify it under *
 * the terms of the MIT- / X11 - License                                 *
 *                                                                       */


module.exports = function(posts, options, callback) {

	function makePageSuffix(page) {
		return options.paginationSuffix.replace(/\{\{\s*PAGE\s*\}\}/, page);
	}

	var urlEncode = require("../util/translit.js").urlSafe;
	var util = require("util");

	function slice(arr, from, count) {
		var to   = from + count;
		var piece = arr.slice(from, to);
		return piece;
	}

	function createUrlFromElements(elements) {
		if (util.isArray(elements)) {
			elements = elements.map(urlEncode).join('/').replace(/\/+/, '/');
		} else {
			elements = urlEncode(elements);
		}
		return elements;
	}

	function getItemInStack(stack, property, value) {
		var result = null;
		var i = stack.length;

		while(i--) {
			if (stack[i][property] == value) {
				result = stack[i];
			}
		}
		return result;
	}

	var pages = posts.map(function(post) {
		var urlParts = [];
		urlParts.push.apply(urlParts, post.yfm.categories);
		urlParts.push(post.yfm.title);
		var page = {
			data: post.yfm,
			content: post.post,
			target: createUrlFromElements(urlParts)
		};

		if (!util.isArray(page.data.categories)) {
			page.data.categories = [];
		}

		if (!util.isArray(page.data.tags)) {
			page.data.tags = [];
		}
		return page;
	});

	pages.forEach(function(page, index) {
		if (pages[index + 1]) {
			page.previous = pages[index + 1];
		}

		if (pages[index - 1]) {
			page.next = pages[index - 1];
		}
	});

	var index = [];

	if (pages.length > options.linksPerPage) {
		var count = Math.ceil(pages.length / options.linksPerPage);
		for (var i = 0; i < count; i++) {
			var target = ["index"];
			if (i) {
				target.push(makePageSuffix(i + 1));
			}
			var pagePosts = slice(pages, i * options.linksPerPage, options.linksPerPage);

			index.push({
				target: createUrlFromElements(target),
				elements: pagePosts
			});
		}
	} else {
		index.push({
			target: "index",
			elements: pages
		});
	}

	var categories = [];

	pages.forEach(function(page) {
		page.data.categories.forEach(function(name) {
			var target = createUrlFromElements([options.categoryPagePrefix, name]);
			var category = getItemInStack(categories, "target", target);

			if (!category) {
				category = {
					name: name,
					target: target,
					posts: [],
					count: 0
				};
				categories.push(category);
			}

			category.posts.push(page);
			category.count++;
		});
	});

	categories.sort(function(a, b) {
		return b.count - a.count;
	});

	var categoryPages = [];
	categories.forEach(function(category) {
		if (category.posts.length > options.linksPerPage) {
			var count = category.posts.length,
				pagesCount = Math.ceil(count / options.linksPerPage);

			for (var i = 0; i < pagesCount; i++) {
				var target = category.target;
				if (i) {
					target += makePageSuffix(i + 1);
				}

				categoryPages.push({
					title: category.name,
					posts: category.posts.length,
					paging: {
						current: i + 1,
						count: pagesCount
					},
					elements: slice(category.posts, i * options.linksPerPage, options.linksPerPage),
					target: target
				});
			}
		} else {
			categoryPages.push({
				title: category.name,
				paging: {
					count: 1,
					current: 1
				},
				elements: category.posts,
				target: category.target
			});
		}
	});

	categoryPages.forEach(function(categoryPage) {
		categoryPage.paging.urls = categoryPages.filter(function(cPage) {
			return categoryPage.title == cPage.title;
		}).map(function(cPage) {
			return cPage.target;
		});
	});

	var tags = [];
	var tagPages = [];

	pages.forEach(function(page) {
		page.data.tags.forEach(function(name) {
			var target = options.tagPagePrefix + urlEncode(name);
			var tag = getItemInStack(tags, "target", target);

			if (!tag) {
				tag = {
					name: name,
					target: target,
					posts: [],
					count: 0
				};
				tags.push(tag);
			}
			tag.posts.push(page);
			tag.count++;
		});
	});


	tags.forEach(function(tag) {
		if (tag.posts.length > options.linksPerPage) {
			var count = tag.posts.length,
				pagesCount = Math.ceil(count / options.linksPerPage);

			for (var i = 0; i < pagesCount; i++) {
				var target = tag.target;
				if (i) {
					target += makePageSuffix(i + 1);
				}
				tagPages.push({
					title: tag.name,
					posts: tag.posts.length,
					paging: {
						current: i + 1,
						count: pagesCount
					},
					urls: [],
					elements: slice(tag.posts, i * options.linksPerPage, options.linksPerPage),
					target: target
				});
			}

		} else {
			tagPages.push({
				title: tag.name,
				paging: {
					count: 1,
					current: 1
				},
				elements: tag.posts,
				target: tag.target
			});
		}
	});

	tagPages.forEach(function(tagPage) {
		tagPage.paging.urls = tagPages.filter(function(tPage) {
			return tagPage.title == tPage.title;
		}).map(function(tPage) {
			return tPage.target;
		});
	});


	var actualPages = [];
	var push = [].push;

	push.apply(actualPages, pages);
	push.apply(actualPages, index);
	push.apply(actualPages, categoryPages);
	push.apply(actualPages, tagPages);

	callback(null, {
		all: actualPages,
		posts: pages,
		categories: categories,
		tags: tags
	});
};
