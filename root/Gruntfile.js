'use strict';
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        'dist'
                    ]
                }]
            },
            server: '.tmp'
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                //src: ['scripts/**/*.js'],
                src: [
                    'scripts/config.js',
                    'scripts/gebo/formatPopupOptions.js',
                    'scripts/gebo/objectToQueryString.js',
                    'scripts/gebo/getTokenByPopup.js',
                    'scripts/gebo/verifyToken.js',
                    'scripts/gebo/logout.js',
                    'scripts/gebo/sendFormDataMessage.js',
                    'scripts/gebo/Authenticate.js',
                    'scripts/gebo/AuthenticateMenu.js',
//                    'scripts/*.js',
                ],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                //hostname: 'localhost'
                hostname: '0.0.0.0'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, '.')
                        ];
                    }
                }
            },
        },
        copy: {
            main: {
                src: ['index.html', 'action.html', 'oauth2callback.html',
                      'scripts/gebo/Oauth2Callback.js', 'robots.txt', 
                      'scripts/HelloWorld.js', 'scripts/Interface.js', 'assets/**/*'],
                dest: 'dist/'
            },
        },
        open: {
            server: {
                url: 'http://localhost:<%= connect.options.port %>'
            }
        },
        react: {
            files: {
                expand: true,
                src: '<%= concat.dist.dest %>',
                ext: '.js',
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },
        usemin: {
            html: ['dist/index.html', 'dist/action.html'],
            css: ['dist/assets/css/*.css'],
            options: {
                basedir: 'dist/',  
            }
        },
        useminPrepare: {
            html: 'index.html',
            options: {
                dest: 'dist/',
            }
        },
        watch: {
            livereload: {
                files: [
                    'index.html',
                    '{.tmp,assets}/styles/{,*/}*.css',
                    '{.tmp,scripts}/{,*/}*.js',
                    'assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ],
                tasks: ['livereload']
            }
        },
    });

    grunt.renameTask('regarde', 'watch');

    grunt.registerTask('server', [
        'clean:server',
        'livereload-start',
        'connect:livereload',
        'open',
        'watch'
    ]);

    grunt.registerTask('default', [
        'clean:dist',
        'copy',
        'concat',
        'react',
        'uglify',
        'usemin'
    ]);

};
