/*                                                                       *
 * Copyright 2014 Georg Großberger <contact@grossberger-ge.org>          *
 *                                                                       *
 * This is free software; you can redistribute it and/or modify it under *
 * the terms of the MIT- / X11 - License                                 *
 *                                                                       */

module.exports = function(posts, options, callback) {

	posts = posts.sort(function(a, b) {
		return b.yfm.date.getTime() - a.yfm.date.getTime();
	});

	callback(null, posts);
};
