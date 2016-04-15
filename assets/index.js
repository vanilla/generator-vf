'use strict';

var fs     = require('fs')
  , path   = require('path')
  , yo     = require('yeoman-generator')
  , _      = require('lodash')
  , utils  = require('../lib/utils')
  , reader = require('html-wiring')
  , Base   = yo.Base;

_.mixin(require('underscore.string'));

var AssetsGenerator = Base.extend({
  constructor: function () {
    Base.apply(this, arguments);

    this.option('skip-install', {
      desc: 'Do not install eventual dependecies'
    });

    this.on('end', function () {
      /* istanbul ignore if */
      if (!this.options['skip-install']) {
        this.npmInstall();
      }
    });
  },

  init: function () {
    var self = this
      , cb   = this.async()
      , base = this.destinationRoot()
      , type = this.config.get('type');

    var today = new Date();
    this.year = today.getFullYear();

    utils.getAddon(base, type, function (err, addon) {
      self.addon = addon;
      if (addon) {
        self.addon.slug = addon.name ? _.slugify(addon.name) : 'assets';
      }
      cb();
    });
  },

  files: function () {
    var next = this.async();

    this.template('_package.json', 'package.json');
    this.template('_bower.json', 'bower.json');
    this.template('csslintrc', 'design/.csslintrc');
    this.template('jshintrc', 'js/.jshintrc');
    this.template('main.js', 'js/src/main.js');
    this.template('custom.scss', 'scss/custom.scss');
    this.template('scss-lint.yml', 'scss/.scss-lint.yml');
    this.template('Gruntfile.js');

    fs.exists(path.resolve(this.destinationRoot(), 'README.md'), function (exists) {
      if (exists) {
        var instructions = _.template(this.read('README.md'));
        // Append the pipeline instructions to the project README
        this.write('README.md', reader.readFileAsString('README.md').replace(
          '---\nCopyright'
        , instructions + '\n---\nCopyright'
        ));
      } else {
        this.template('README.md');
      }

      next();
    }.bind(this));
  }
});

module.exports = AssetsGenerator;
