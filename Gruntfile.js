module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    babel: {
      options: {
        sourceMap: false,
        presets: ['env'],
        minified: false,
        retainLines: true
      },
      dist: {
        files: [{
          "expand": true,
          "cwd": "js/src/",
          "src": ["**/*.js"],
          "dest": "js/dist/es5/",
          "ext": ".js"
        // },
        // {
        //   "expand": true,
        //   "cwd": "spec/js/src/",
        //   "src": ["**/*.js"],
        //   "dest": "spec/js/",
        //   "ext": ".js"
        }]
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        sourceMap: false,
        // compress: false,
        // mangle: false,
        // beautify: true
      },
      global: {
        src: [
          "js/dist/es5/vendor/*.js",
          "js/dist/es5/config/*.js",
          "js/dist/es5/helpers/*.js",
          "js/dist/es5/lib/*.js",
          "js/dist/es5/application.js"
        ],
        dest: 'js/dist/application.min.js'
      },
    },
    watch: {
      scripts: {
        files: 'js/src/**/*.js',
        tasks: ['babel','uglify'],
        options: {
          livereload: true,
        }
      },
    }
  });

  // Load the plugins:
  grunt.loadNpmTasks('grunt-babel'); // $ grunt babel
  grunt.loadNpmTasks('grunt-contrib-uglify'); // $ grunt uglify
  grunt.loadNpmTasks('grunt-contrib-watch');  // $ grunt watch

  // Default task:
  grunt.registerTask('default', ['babel','uglify']); // $ grunt

};
