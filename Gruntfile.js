/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    bower: {
        install: {
            options: {
                targetDir: './static/js/lib',
                layout: 'byComponent',
                install: true,
                verbose: false,
                cleanTargetDir: false,
                cleanBowerDir: false,
                bowerOptions: {}
            }
        }
    },
    // Task configuration.
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: [
            'static/js/lib/jquery/jquery.js',
            'static/js/lib/angular/angular.js',
            'static/js/lib/angular-ui-router/angular-ui-router.js',
            'static/js/lib/angular-translate/angular-translate.js',
            'static/js/lib/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
            'static/js/lib/angular-sanitize/angular-sanitize.js',
            'static/js/lib/angular-animate/angular-animate.js',
            'static/js/lib/ionic/ionic.js',
            'static/js/lib/ionic/ionic-angular.js',
            'static/js/lib/angular-deckgrid/angular-deckgrid.js',
            'static/js/lib/clipboard/clipboard.js',
            'static/js/fastorz.js'
        ],
        dest: 'dist/static/js/app.js'
      },
      css: {
        src: [
            'static/css/style.css',
            'static/css/ionic/ionic.css'
        ],
        dest: 'dist/static/css/app.css'
      }
    },
    cssmin: {
        css: {
            src: 'dist/static/css/app.css',
            dest: 'dist/static/css/app.min.css'
        }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: 'dist/static/js/app.js',
        dest: 'dist/static/js/app.min.js'
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib_test: {
        src: ['lib/**/*.js', 'test/**/*.js']
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib_test: {
        files: '<%= jshint.lib_test.src %>',
        tasks: ['jshint:lib_test', 'qunit']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-css');
  grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify', 'cssmin']);
};
