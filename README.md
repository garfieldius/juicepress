# Static Blog Generator

Juicepress is a node package that generates a blog of HTML files from markdown sources. Currently, it must be invoked via [grunt](http://gruntjs.com/). Direct calls and other build tools are not yet supported.

## Installation and Usage

Go to [grunt-contrib-juicepress](https://github.com/trenker/grunt-contrib-juicepress#Installation) to see how to install and run juicepress with grunt.

## Rendering

The creation of a blog consists of the following steps:

1. Read all markdown files, which are considered posts
2. Create category and tags information based on the YFM in the posts
3. Create a schedule of actual HTML pages to render, including splitted lists with pagination over several HTML files

### Pages

There are two types of pages: posts and lists

* *posts* are blog posts which use markdown and are rendered using the *defaultTemplate* or the one configured in the YFM
* *lists* are lists of blog posts. They always use the *listTemplate*

There are three types of lists:

* *index* is the index page(s) of the blog, containing all posts
* *category* are the lists of posts that belong to a certain category
* *tag* the same as category lists, but this time the relation is created by the tags a post has.

All posts are sorted in chronological order with the newest first and the oldest last, aka descending. The relation, which categories and tags a post has, is defined in the YFM.

### Templates

There must be at least two templates: *default* for posts and *list* for lists. All templates are rendered using handlebars, so you can use all the handlebars options and possibilities.

Additionally all options and YFM settings are available

### Helpers

The following helpers are registered for

## Options

### Yaml Front Matter

<table>
	<thead>
		<tr>
			<th>Name</th>
			<th>Type</th>
			<th>Description</th>
			<th>Required</th>
			<th>Default</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>*title*</td>
			<td>string</td>
			<td>Page title of the post</td>
			<td>Yes</td>
			<td>-</td>
		</tr>
		<tr>
			<td>*date*</td>
			<td>DateTime</td>
			<td>When the post was published</td>
			<td>Yes</td>
			<td>-</td>
		</tr>
		<tr>
			<td>*excerpt*</td>
			<td>string</td>
			<td>A short summery of the blog post</td>
			<td>No (but recomended)</td>
			<td>-</td>
		</tr>
		<tr>
			<td>*categories*</td>
			<td>array&gt;string&lt;</td>
			<td>List of tags</td>
			<td>No (but recomended)</td>
			<td>*[]*</td>
		</tr>
		<tr>
			<td>*tags*</td>
			<td>array&gt;string&lt;</td>
			<td>List of tags</td>
			<td>No (but recomended)</td>
			<td>*[]*</td>
		</tr>
	</tbody>
</table>


### Build Time Options

<table>
	<thead>
		<tr>
			<th>Name</th>
			<th>Type</th>
			<th>Description</th>
			<th>Required</th>
			<th>Default</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>linksPerPage</td>
			<td>integer</td>
			<td>How many items / links to show on a single list page</td>
			<td>Yes</td>
			<td>*10*</td>
		</tr>
		<tr>
			<td>baseUrl</td>
			<td>string</td>
			<td>The (absolute) URL to the root of your blog. Should be set to a full URI like http://example.tld/blog/. MUST have a trailing slash!</td>
			<td>Yes</td>
			<td>*"/"*</td>
		</tr>
		<tr>
			<td>minimize</td>
			<td>boolean</td>
			<td>If the generated HTML should be compressed using [minimize](https://github.com/Moveo/minimize)</td>
			<td>No</td>
			<td>*true*</td>
		</tr>
		<tr>
			<td>minimizeOptions</td>
			<td>object</td>
			<td>Options passed to minimize. See [minimize](https://github.com/Moveo/minimize) for a list of available options. If omitted, its default settings are used.</td>
			<td>No</td>
			<td>*null*</td>
		</tr>
		<tr>
			<td>paginationSuffix</td>
			<td>string</td>
			<td>The suffix for list pages, higher than one. The placeholder *{{ page }}* will be replaced with the page number. If it starts with a slash (like the default), all pages will be in a subfolder.</td>
			<td>No</td>
			<td>*"/page-{{ page }}"*</td>
		</tr>
		<tr>
			<td>categoryPagePrefix</td>
			<td>string</td>
			<td>The prefix / folder for list pages of categories.</td>
			<td>No</td>
			<td>*"/categories"*</td>
		</tr>
		<tr>
			<td>tagPagePrefix</td>
			<td>string</td>
			<td>Same as *categoryPagePrefix*, but for tags.</td>
			<td>No</td>
			<td>*"/tags"*</td>
		</tr>
		<tr>
			<td>layoutsDirectory</td>
			<td>string</td>
			<td>Globbing pattern for handlebars templates. The files found can be used as layouts.</td>
			<td>No</td>
			<td>*"./layouts/**.*"*</td>
		</tr>
		<tr>
			<td>defaultLayout</td>
			<td>string</td>
			<td>The default layout used for posts. The name is the templates file name without path or ending.</td>
			<td>No</td>
			<td>*"default"*</td>
		</tr>
		<tr>
			<td>listLayout</td>
			<td>string</td>
			<td>The same as *defaultLayout*, but for list pages.</td>
			<td>No</td>
			<td>*"list"*</td>
		</tr>
		<tr>
			<td>partials</td>
			<td>string</td>
			<td>Globbing pattern for handlebars templates, that will be injected as partials.</td>
			<td>No</td>
			<td>*"list"*</td>
		</tr>
		<tr>
			<td>helpers</td>
			<td>string</td>
			<td>Globbing pattern for javascript files that are included prior the page rendering. They are expected to export a single function, that receives three arguments (in that order): *Handlebars*: Reference to the handlebars instanced used, *options*: This options, with their settings, *posts*: An array of post page objects. Useful, eg., for adding additional helpers.</td>
			<td>No</td>
			<td>*"./helpers/**/*.js"*</td>
		</tr>
		<tr>
			<td>buildDirectory</td>
			<td>string</td>
			<td>Name of the directory to write the files into. Relative to the process.cwd().</td>
			<td>No</td>
			<td>*"./_build/"*</td>
		</tr>
		<tr>
			<td>generateSitemap</td>
			<td>boolean</td>
			<td>If a XML sitemap file should be generated. The last modified date is determined by the posts dates.</td>
			<td>No</td>
			<td>*true*</td>
		</tr>
		<tr>
			<td>sitemap.frequency.(index|list|post)</td>
			<td>string</td>
			<td>The change frequency for the different page types</td>
			<td>Yes (if generateSitemap is true)</td>
			<td>*yearly* for posts, *monthly* for tag- and category - lists, *weekly* for index - lists</td>
		</tr>
		<tr>
			<td>sitemap.priority.(index|list|post)</td>
			<td>float as string</td>
			<td>The priority settings for the page types</td>
			<td>Yes (if generateSitemap is true)</td>
			<td>*1.0* for posts, *0.8* for tag- and category - lists, *0.9* for index - lists</td>
		</tr>
		<tr>
			<td>sitemap.target</td>
			<td>string</td>
			<td>The target filename of the sitemap file. Relative to *buildDirectory*</td>
			<td>Yes (if generateSitemap is true)</td>
			<td>*sitemap.xml*</td>
		</tr>
	</tbody>
</table>

## Todo

* Drafts
* Extended docs
* Multi Language Support
* Direct invocation
* A gulp plugin
* Unit tests (Yes, I know it should already have those)

## License

Copyright (c) 2014 Georg Großberger

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
