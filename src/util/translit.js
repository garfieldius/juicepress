/*                                                                       *
 * Copyright 2014 Georg Großberger <contact@grossberger-ge.org>          *
 *                                                                       *
 * This is free software; you can redistribute it and/or modify it under *
 * the terms of the MIT- / X11 - License                                 *
 *                                                                       */

var stringex = require("stringex");

function translit(str) {
	return stringex.toASCII(str);
}

function urlSafe(str) {
	str = module.exports.translit(str);
	str = str.toLowerCase();
	str = str.replace(/\s+/g, "-");
	str = str.replace(/[^a-z0-9\-]+/g, "");
	str = str.replace(/[\-]+/g, "-");
	str = str.replace(/^[\-]+|[\-]+$/, "");
	return str;
}

module.exports.translit = translit;
module.exports.urlSafe = urlSafe;
