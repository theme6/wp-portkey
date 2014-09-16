'use strict';

var path = require('path');

// Usemin's createConcatConfig handler.
// Here we strip out WP's template directory function call
// and provide the relative path for Uglify, Minify etc.
function createConcatConfig(context, block) {
  var cfg = {files: []};
  var staticPattern = /<\?php printf\(get_template_directory_uri\(\)\)\; \?>/;

  block.dest = block.dest.replace(staticPattern, '');
  var outfile = path.join(context.outDir, block.dest);

  // Depending whether or not we're the last of the step we're not going to output the same thing
  var files = {
    dest: outfile,
    src: []
  };
  context.inFiles.forEach(function(f) {
    files.src.push(path.join(context.inDir, f.replace(staticPattern, '')));
  });
  cfg.files.push(files);
  context.outFiles = [block.dest];
  return cfg;
}

module.exports = function (grunt) {
  // Show elapsed time after tasks run
  require('time-grunt')(grunt);
  // Load all Grunt tasks
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    paths: {
      base: '.',
      dist: 'dist',
      sass: 'scss',
      scripts: 'js',
      styles: 'css'
    },

    pkg: grunt.file.readJSON('package.json'),

    deploymentConfig: grunt.file.readJSON('server.config.json'),

    watch: {
      options: {},
      sass: {
        files: [
          '<%= paths.sass %>/**/*.{scss,sass}'
        ],
        tasks: ['sass:dev', 'autoprefixer']
      },
      livereload: {
        files: [
        '*.{html,php}',
        '<%= paths.styles %>/*.css',
        'scripts/*.js',
        ],
        options: {
          livereload: true,
          spawn: false
        }
      }
    },

    sass: {
      options: {
        bundleExec: true,
        loadPath: ['bower_components'],
        precision: 14
      },
      dev: {
        options: {
          debugInfo: true,
          lineNumbers: true,
          quiet: false
        },
        files: [{
          expand: true,
          cwd: '<%= paths.sass %>/',
          src: [ 'main.scss'],
          dest: '<%= paths.styles %>',
          ext: '.css'
        }]
      },
      dist: {
        options: {
          style: 'expanded',
          quiet: true,
          noCache: true
        },
        files: [{
          expand: true,
          cwd: '<%= paths.sass %>/',
          src: [ 'main.scss'],
          dest: '<%= paths.styles %>',
          ext: '.css'
        }]
      }
    },

    autoprefixer: {
      options: {
        browsers: ['last 2 versions']
      },
      mainStyles: {
        src: '<%= paths.styles %>/**/*.css'
      }
    },

    clean: {
      dist: ['<%= paths.dist %>'],
      release: [
        '<%= paths.dist %>/<%= pkg.name %>/bower_components',
        '<%= paths.dist %>/<%= pkg.name %>/<%= paths.styles %>/*.css',
        '!<%= paths.dist %>/<%= pkg.name %>/<%= paths.styles %>/*.min.*.css',
        '<%= paths.dist %>/<%= pkg.name %>/<%= paths.scripts %>/*.js',
        '!<%= paths.dist %>/<%= pkg.name %>/<%= paths.scripts %>/*.min.*.js'
      ]
    },

    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= paths.base %>',
          dest: '<%= paths.dist %>/<%= pkg.name %>',
          src: [
            'bower_components/**/*',
            '<%= paths.scripts %>/**/*',
            '<%= paths.styles %>/**/*.css',
            '*.{html,css,php,ico,png}'
          ]
        }]
      }
    },

    zip: {
      archive: {
        dot: true,
        cwd: '<%= paths.dist %>/',
        src: [
          '<%= paths.dist %>/<%= pkg.name %>/**/*'
          ],
        dest: '<%= paths.dist %>/<%= pkg.name %>-<%= pkg.version %>.zip'
      }
    },

    concurrent: {
      dev: [
      'sass:dev',
      'coffee:dev'
      ],
      dist: [
      'sass:dist',
      'coffee:dev'
      ]
    },

    concat: {
      options: {
        separator: '\n;'
      }
    },

    cssmin: {},

    uglify: {},

    filerev: {
      files: {
        src: [
          '<%= paths.dist %>/<%= pkg.name %>/<%= paths.scripts %>/*.min.js',
          '<%= paths.dist %>/<%= pkg.name %>/<%= paths.styles %>/*.min.css'
        ]
      }
    },

    useminPrepare: {
      src: [
        '<%= paths.dist %>/<%= pkg.name %>/header.php',
        '<%= paths.dist %>/<%= pkg.name %>/footer.php'
        ],
      options: {
        dest: '<%= paths.dist %>/<%= pkg.name %>',
        root: '<%= paths.dist %>/<%= pkg.name %>',
        flow: {
          steps: {
            'js': [
              {
                name: 'concat',
                createConfig: createConcatConfig
              },
              'uglifyjs'
            ],
            'css': [
              {
                name: 'concat',
                createConfig: createConcatConfig
              },
              'cssmin']
          },
          post: {}
        }
      }
    },

    usemin: {
      html: [
        '<%= paths.dist %>/<%= pkg.name %>/header.php',
        '<%= paths.dist %>/<%= pkg.name %>/footer.php'
      ]
    },
    // Putting back Wordpress asses path to optimized files.
    replace: {
      scripts: {
        src: [
          '<%= paths.dist %>/<%= pkg.name %>/footer.php',
          '<%= paths.dist %>/<%= pkg.name %>/header.php'
        ],
        overwrite: true,
        replacements: [
          {
            from: '<script src="',
            to: '<script src="<?php printf(get_template_directory_uri()); ?>/'
          },
          {
            from: '<link rel="stylesheet" href="',
            to: '<link rel="stylesheet" href="<?php printf(get_template_directory_uri()); ?>/'
          },
        ]
      },
      version: {
        src: [
          '<%= paths.base %>/style.css'
        ],
        overwrite: true,
        replacements: [
          {
            from: /Version:(\s+)(.*)/g,
            to: 'Version:$1<%= pkg.version %>'
          }
        ]
      }
    },

    rsync:  {
      options: {
        args: ["-vv", "--size-only", "-c"],
        recursive: true
      },
      server: {
        options: {
          src: '<%= paths.dist %>/<%= pkg.name %>/',
          dest: '<%= deploymentConfig.username %>@<%= deploymentConfig.host %>:<%= deploymentConfig.path %>',
          syncDest: true,
          ssh: true,
          port: '<%= deploymentConfig.port %>'
        }
      }
    }
  });

grunt.registerTask('build', [
  'replace:version',
  'clean:dist',
  'sass:dist',
  'autoprefixer',
  'copy',
  'useminPrepare',
  'concat',
  'uglify',
  'cssmin',
  'filerev',
  'usemin',
  'replace:scripts',
  'clean:release',
  'zip'
  ]);

grunt.registerTask('develop', [
  'replace:version',
  'sass:dev',
  'autoprefixer',
  'watch'
  ]);

grunt.registerTask('deploy', [
  'build',
  'rsync:server'
  ]);

grunt.registerTask('default', [
  'build'
  ]);
};
