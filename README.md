# WP-Portkey [![Dependency Status](https://david-dm.org/theme6/wp-portkey.png)](https://david-dm.org/theme6/wp-portkey#info=devDependencies&view=list)

> A WordPress Theme Development, Build and Deployment Workflow with [Node.js](http://nodejs.org/), [Bower](http://bower.io/) and [Grunt](http://gruntjs.com/).

## Setup

You need to have [Node.js](http://nodejs.org/), [Bower](http://bower.io/) and [Grunt](http://gruntjs.com/) installed for this setup to work.

### Gems
`bundle`

### Node Modules
`npm install`

### Bower Modules
`bower install`

## Deployment
Copy `servers.config.json.sample` to `servers.config.json` and fill in with you server credentials and installation paths.

Even if you are not going to deploy the theme, just create `servers.config.json` to avoid the error `Error: Unable to read "servers.config.json" file (Error code: ENOENT)`.

## Usage

## Developing
While you are developing the theme run `grunt develop` in your terminal. This will compile your SASS files, watch for any file changes and refreshes the browser through [Livereload](http://feedback.livereload.com/knowledgebase/articles/86242-how-do-i-install-and-use-the-browser-extensions) when any file changes.

## Building
Run `grunt build`, to build your theme. During build the CSS and JS files are concatenated, minified and revision-ed. This is done using [Grunt Usemin task](https://github.com/yeoman/grunt-usemin).

Follow the **exact** tags and attributes shown below to include js and css files. Since we are replacing the `get_template_directory_uri()` with a string search and replace during the build process.

In header.php
```html
<!-- build:css css/main.min.css -->
<link rel="stylesheet" href="<?php printf(get_template_directory_uri()); ?>/bower_components/normalize.css/normalize.css">
<link rel="stylesheet" href="<?php printf(get_template_directory_uri()); ?>/css/main.css">
<!-- endbuild -->
```

In footer.php
```html
<!-- build:js js/main.min.js -->
<script src="<?php printf(get_template_directory_uri()); ?>/js/plugins.js"></script>
<script src="<?php printf(get_template_directory_uri()); ?>/js/main.js"></script>
<!-- endbuild -->
```

## Deployment

After you setup the credentials in `servers.config.json`, you can deploy your theme to your server with the grunt task `grunt deploy --target=dev`. If you don't specify any target by default the server configuration of ‘dev’ will be used.

## Versioning
We have added support for [Semantic Versioning](http://semver.org/). The primary place where theme's version is stored is in `package.json`. It's easier to change the version with [npm-version](https://www.npmjs.org/doc/cli/npm-version.html). Once you update your theme's version in `package.json`, on the next run of `grunt develop` or `grunt build`, `style.css` will have the new version.

## Authors

* [Theme6](http://theme6.com/)
  * [Brajeshwar Oinam](http://brajeshwar.me/)
  * [Saneef Ansari](http://saneef.com/)

### LICENSE

Licensed under GPL v3 or later. A copy of the licence is included.
