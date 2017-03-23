module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    babel: {
      options: {
        sourceMap: true,
        presets: ['es2015'],
        minified: false
      },
      dist: {
        files: [{
          "expand": true,
          "cwd": "js/src/",
          "src": ["**/*.js"],
          "dest": "js/dist/es5/",
          "ext": ".js"
        },
        {
          "expand": true,
          "cwd": "spec/js/src/",
          "src": ["**/*.js"],
          "dest": "spec/js/dist/",
          "ext": ".js"
        }]
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        sourceMap: true
      },
      global: {
        src: [
          "js/dist/es5/*.js"
        ],
        dest: 'js/dist/global.min.js'
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
