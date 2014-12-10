/*
 * grunt-init-gebo-react-hai
 * https://github.com/RaphaelDeLaGhetto/grunt-init-gebo-react-hai
 * Daniel Bidulock
 *
 * Adapted from:
 *
 * grunt-init-commonjs
 * https://gruntjs.com/
 *
 * Copyright (c) 2013 "Cowboy" Ben Alman, contributors
 * Licensed under the MIT license.
 */

'use strict';

// Basic template description.
exports.description = 'Create a React gebo human-agent interface'

// Template-specific notes to be displayed before question prompts.
exports.notes = '';

// Template-specific notes to be displayed after question prompts.
exports.after = 'You should now install project dependencies with _npm ' +
  'install_. After that, you may execute project tasks with _grunt_. For ' +
  'more information about installing and configuring Grunt, please see ' +
  'the Getting Started guide:' +
  '\n\n' +
  'http://gruntjs.com/getting-started';

// Any existing file or directory matching this wildcard will cause a warning.
exports.warnOn = '*';

// The actual init template.
exports.template = function(grunt, init, done) {

  init.process({}, [
    // Prompt for these values.
    init.prompt('name'),
    init.prompt('description'),
    init.prompt('version', '0.0.0'),
    init.prompt('repository'),
    init.prompt('homepage'),
    init.prompt('bugs'),
    init.prompt('licenses'),
    init.prompt('author_name'),
    init.prompt('author_email'),
    init.prompt('author_url'),
    init.prompt('main', 'index.html')
  ], function(err, props) {
    props.scripts: {
        "test": "jest"
    };
    props.keywords = [];
    props.dependencies = {};
    props.devDependencies = {
        "grunt": "~0.4.x",
        "grunt-contrib-clean": "~0.6.x",
        "grunt-contrib-concat": "~0.5.x",
        "grunt-contrib-connect": "~0.8.x",
        "grunt-contrib-copy": "~0.6.x",
        "grunt-contrib-livereload": "~0.1.x",
        "grunt-contrib-uglify": "~0.6.x",
        "grunt-contrib-watch": "^0.6.x",
        "grunt-open": "^0.2.x",
        "grunt-react": "^0.9.x",
        "grunt-regarde": "~0.1.x",
        "grunt-usemin": "^2.4.x",
        "jest-cli": "^0.1.x",
        "jquery": "^2.1.x",
        "matchdep": "~0.3.x",
        "react": "^0.11.x",
        "react-tools": "^0.11.x"
    };
    props.jest = {
        "scriptPreprocessor": "<rootDir>/__tests__/preprocessor.js",
        "unmockedModulePathPatterns": [
          "<rootDir>/node_modules/react"
        ]
    };

    // Files to copy (and process).
    var files = init.filesToCopy(props);

    // Add properly-named license files.
    init.addLicenseFiles(files, props.licenses);

    // Actually copy (and process) files.
    init.copyAndProcess(files, props, { noProcess: 'assets/images/**' });

    // Generate package.json file.
    init.writePackageJSON('package.json', props);

    // All done!
    done();
  });
};
