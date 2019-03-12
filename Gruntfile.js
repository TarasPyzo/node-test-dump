module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    exec: {
      test: { command: '<%= pkg.scripts.test %>' },
      link_checker: '<%= pkg.scripts.link_checker %>',
      lint: { command: '<%= pkg.scripts.lint %>' }
    },
    jshint: {
      files: ['server.js']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-exec');

  grunt.registerTask('default', ['exec']);
  grunt.registerTask('lint', ['jshint']);
};

