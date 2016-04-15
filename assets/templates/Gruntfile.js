'use strict';

module.exports = function (grunt) {
  // Load all Grunt tasks matching the `grunt-*` pattern
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  grunt.file.mkdir('bower_components');

  // Load Bower dependencies
  var dependencies = require('wiredep')();

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    watch: {
      bower: {
        files: ['bower.json']
      , tasks: ['wiredep']
      }
    , js: {
        files: ['js/src/**/*.js']
      , tasks: ['jshint', 'concat']
      }
    , gruntfile: {
        files: ['Gruntfile.js']
      }
    , sass: {
        files: ['scss/**/*.scss']
      , tasks: ['scsslint', 'sass', 'autoprefixer', 'csslint']
      }
    , livereload: {
        options: {
          livereload: true
        }
      , files: [
          'design/**/*.css'
        , 'design/images/**/*'
        , 'js/**/*.js'
        , 'views/**/*.tpl'
        ]
      }
    },

    sass: {
      options: {
        sourceMap: true,
        outputStyle: "expanded"
      },
      dist: {
        files: [{
          expand: true
        , cwd: 'scss/'
        , src: [
            '*.scss'
          , '!_*.scss'
          ]
        , dest: 'design/'
        , ext: '.css'
        }]
      }
    },

    scsslint: {
      options: {
        force: true
      , config: 'scss/.scss-lint.yml'
      }
    , all: ['scss/**/*.scss']
    },

    autoprefixer: {
      dist: {
        src: ['design/**/*.css']
      }
    },

    jshint: {
      options: {
        force: true
      , jshintrc: 'js/.jshintrc'
      }
    , all: ['js/src/**/*.js']
    },

    csslint: {
      options: {
        quiet: true
      , csslintrc: 'design/.csslintrc'
      }
    , all: ['design/custom.css']
    },

    concat: {
      dist: {
        src: (dependencies.js || []).concat([
          'js/src/main.js'
        ])
      , dest: 'js/custom.js'
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'design/images',
          src: '**/*.{gif,jpeg,jpg,png,svg}',
          dest: 'design/images'
        }]
      }
    },

    wiredep: {
      dist: {
        src: ['scss/**/*.scss']
      }
    }

  });

  grunt.registerTask('default', [
    'wiredep'
  , 'scsslint'
  , 'sass'
  , 'autoprefixer'
  , 'concat'
  , 'jshint'
  , 'csslint'
  , 'imagemin'
  ]);
};
