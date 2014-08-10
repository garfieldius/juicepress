/*                                                                       *
 * Copyright 2014 Georg Großberger <contact@grossberger-ge.org>          *
 *                                                                       *
 * This is free software; you can redistribute it and/or modify it under *
 * the terms of the MIT- / X11 - License                                 *
 *                                                                       */

module.exports = function(file, cb) {

	var yaml = require("js-yaml");

	if (!file.content) {
		require("fs").readFile(file.from, function(err, src) {
			if (err) {
				cb(err);
			} else {
				parseContent(src);
			}
		});
	} else {
		parseContent(file.content);
	}

	function parseContent(src) {

		src = src.toString();

		var yfm = "";
		var yfmClosed = false;
		var yfmStarted = false;
		var content = "";
		var lines = src.replace(/\r/g, '').trim().split("\n");

		while (lines.length) {
			var line = lines.shift();

			if (!yfmStarted && !yfmClosed) {
				yfmStarted = (line.trim() == "---");
			} else if (yfmStarted && !yfmClosed) {
				if (line.trim() == "---")  {
					yfmClosed = true;
				} else {
					yfm += line + "\n";
				}
			} else {
				content += line + "\n";
			}
		}

		try {
			yfm = yaml.load(yfm);
		} catch (e) {
			cb(e);
			return;
		}

		cb(null, {
			from: file.from,
			yfm: yfm,
			post: content
		});
	}
};
