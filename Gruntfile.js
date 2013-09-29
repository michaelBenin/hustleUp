module.exports = function (grunt) {

  "use strict";

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      files: [
        './*.js'
      ],
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        node: true,
        globals: {
          alert: true,
          $: true,
          jQuery: true,
          Modernizr: true
        }
      }
    },

    jsbeautifier: {
      'default': {
        src: ['<%= jshint.files %>']
      },
      verify: {
        src: ['<%= jshint.files %>'],
        options: {
          mode: 'VERIFY_ONLY'
        }
      },
      options: {
        'indent_size': 2,
        'indent_char': ' ',
        'indent_level': 0,
        'indent_with_tabs': false,
        'preserve_newlines': true,
        'max_preserve_newlines': 10,
        'brace_style': 'collapse',
        'keep_array_indentation': false,
        'keep_function_indentation': true,
        'space_before_conditional': true,
        'eval_code': false,
        'indent_case': true,
        'unescape_strings': false,
        'space_after_anon_function': true
      }
    },

    jsvalidate: {
      files: '<%=jshint.files%>'
    },

    qunit: { // url to your site, or qunit tests
      all: ['test/qunit-1.12.0/index.html']
    },

    watch: {
      files: [
        'jquery.hustleUp.js',
        'test/qunit-1.12.0/tests.js'
      ],

      tasks: ['dev']
    }
  });

  grunt.registerTask('dev', [
    'jsbeautifier',
    'jsvalidate',
    'jshint',
    'test'
  ]);

  grunt.registerTask('test', 'qunit');

  grunt.registerTask('default', [
    'dev',
    'test'
  ]);

  [
    'grunt-contrib-qunit',
    'grunt-contrib-jshint',
    'grunt-contrib-watch',
    'grunt-jsbeautifier',
    'grunt-jsvalidate'
  ].forEach(function (task) {
    grunt.loadNpmTasks(task);
  });

};
