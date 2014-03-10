wp-portkey
==========

A Wordpress Theme Development, Build and Deployment Workflow.

## Setting Up

### Gems
`bundle`

### Node Modules
`npm install`

### Bower Modules
`bower install`

## Deployment
Copy `server.config.json.sample` to `server.config.json` and fill in with you server credentials and installation paths.

Even if your are not going to deploy your theme, just create `server.config.json` to avoid the error `Error: Unable to read "server.config.json" file (Error code: ENOENT)`.

## Usage

## Developing
While you are developing the theme run `grunt develop` in your terminal. This will compile your SASS files, watch for any file changes and refreshes the browser through (Livereload)[http://feedback.livereload.com/knowledgebase/articles/86242-how-do-i-install-and-use-the-browser-extensions] when any file changes.

## Building
Run `grunt build`, to build your theme. During build the CSS and JS files are concatenated, minified and revision-ed. This is done using (Grunt Usemin task)[https://github.com/yeoman/grunt-usemin].

Follow the *exact* tags and attributes shown to include js and css files. Since we are replacing the `get_template_directory_uri()` with a string search and replace during the build process.

In header.php
```php
<!-- build:css css/main.min.css -->
<link rel="stylesheet" href="<?php printf(get_template_directory_uri()); ?>/bower_components/normalize.css/normalize.css">
<link rel="stylesheet" href="<?php printf(get_template_directory_uri()); ?>/css/main.css">
<!-- endbuild -->
```

In footer.php
```php
<!-- build:js js/main.min.js -->
<script src="<?php printf(get_template_directory_uri()); ?>/js/plugins.js"></script>
<script src="<?php printf(get_template_directory_uri()); ?>/js/main.js"></script>
<!-- endbuild -->
```