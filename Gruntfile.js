module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        sourceMap: true
      },
      global: {
        src: [
          "lib/src/*.js"
        ],
        dest: 'lib/dist/global.min.js'
      },
    },
    watch: {
      scripts: {
        files: 'lib/src/*.js',
        tasks: ['uglify'],
        options: {
          livereload: true,
        }
      },
    }
  });

  // Load the plugins:
  grunt.loadNpmTasks('grunt-contrib-uglify'); // $ grunt uglify
  grunt.loadNpmTasks('grunt-contrib-watch');  // $ grunt watch

  // Default task:
  grunt.registerTask('default', ['watch']);   // $ grunt

};
