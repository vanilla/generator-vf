'use strict';

var path  = require('path')
  , _     = require('lodash')
  , chalk = require('chalk')
  , yo    = require('yeoman-generator')
  , utils = require('../lib/utils')
  , Base  = yo.Base;

_.mixin(require('lodash-deep'));
_.mixin(require('underscore.string'));

var AppGenerator = Base.extend({
  constructor: function () {
    Base.apply(this, arguments);

    this.option('skip-welcome-message', {
      desc: 'Do not show the Yeoman welcome message'
    });

    this.on('end', function () {
      /* istanbul ignore if */
      if (!this.options['skip-welcome-message']) {
        console.log(chalk.yellow(
          '\nThat was it! Open up this folder in your favorite editor\n' +
          'and start hacking away.\n'
        ));
      }
    });
  },

  init: function () {
    var self = this
      , cb   = this.async()
      , base = this.destinationRoot()
      , type = this.config.get('type');

    utils.getAddon(base, type, function (err, addon) {
      self.addon = addon;
      cb();
    });
  },

  askForAuthor: function () {
    var next = this.async()
      , prompts = [{
        type: 'input'
      , name: 'author'
      , message: 'What is your full name?'
      , store: true
      , default: _.deepGetValue(this, 'addon.author.name')
      }, {
        type: 'input'
      , name: 'email'
      , message: 'I would also like your email'
      , store: true
      , default: _.deepGetValue(this, 'addon.author.email')
      }, {
        type: 'input'
      , name: 'url'
      , message: 'Optionally, enter your website'
      , store: true
      , default: _.deepGetValue(this, 'addon.author.url')
      }];

    this.prompt(prompts, function (props) {
      this.author = {
        name  : props.author
      , email : props.email
      , url   : props.url
      };

      next();
    }.bind(this));
  },

  askForLicense: function () {
    /* istanbul ignore if */
    if (!this.options['skip-welcome-message']) {
      console.log(chalk.yellow(
        '\nNow for a bit of information about your addon...\n'
      ));
    }

    var next = this.async()
      , prompts = [{
        type: 'list'
      , name: 'license'
      , message: 'Which license would you like to use?'
      , default: _.deepGetValue(this, 'addon.license') || 'MIT'
      , choices: [{
          name: 'None'
        , value: false
        }, 'MIT', 'GPLv2', 'GPLv3', 'Apache']
      }];

    this.prompt(prompts, function (props) {
      this.license = props.license;

      next();
    }.bind(this));
  },

  askForAddon: function () {
    var next = this.async()
      , prompts = [{
        type: 'list'
      , name: 'type'
      , message: 'What kind of addon is this?'
      , default: this.config.get('type')
      , choices: ['Plugin', 'Theme']
      }, {
        type: 'input'
      , name: 'name'
      , message: 'Enter the name of your addon'
      , default: _.deepGetValue(this, 'addon.name')
      }, {
        type: 'input'
      , name: 'desc'
      , message: 'Describe your addon in a sentence or two'
      , default: _.deepGetValue(this, 'addon.desc')
      }, {
        type: 'input'
      , name: 'url'
      , message: 'Optionally, enter the addons website'
      , default: _.deepGetValue(this, 'addon.url')
      }, {
        type: 'checkbox'
      , name: 'extras'
      , message: 'Optional files to include in your theme'
      , choices: [
          'class.themehooks.php'
        ]
      , when: /* istanbul ignore next */ function (props) {
          return props.type === 'Theme';
        }
      }];

    this.prompt(prompts, function (props) {
      this.type = props.type;
      this.name = props.name;
      this.classname = _.classify(props.name);
      this.desc = props.desc;
      this.url = props.url;
      this.extras = props.extras || [];

      this.config.set('type', this.type);

      next();
    }.bind(this));
  },

  files: function () {
    var self  = this
      , today = new Date();

    this.year      = today.getFullYear();
    this.directory = path.basename(this.destinationRoot());

    this.copy('editorconfig', '.editorconfig');

    if (this.license) {
      this.template('licenses/' + this.license + '.md', 'LICENSE.md');
    } else {
      this.license = 'Proprietary';
    }

    this.template('README.md');

    /* istanbul ignore next */
    var extra = function (template, dest) {
      if (self.extras.indexOf(template) !== -1) {
        self.template(template, dest);
      }
    };

    switch (this.type) {
    case 'Plugin':
      this.template(
        'class.plugin.php',
        'class.' + this.directory.toLowerCase() + '.plugin.php'
      );
      break;

    case 'Theme':
      this.copy('default.master.tpl', 'views/default.master.tpl');
      this.template('about.php');

      // Optional theme files
      extra('class.themehooks.php');
      break;
    }

    this.config.save();
  }
});

module.exports = AppGenerator;
