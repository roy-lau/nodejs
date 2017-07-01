module.export = function(grunt) {
    grunt.initConfig({
        watch: {
            jade: {
                files: ['views/**'],
                options: {
                    livereload: true // 当文件出现改动的时候会重新启动服务
                }
            },
            js: {
                files: ['public/js/**', 'models/**/*.js', 'schemas/**/*.js'],
                // tasks: ['jshint'],
                options: {
                    livereload: true // 当文件出现改动的时候会重新启动服务
                }
            }
        },
        nodemon: {
            dev: {
                options: {
                    files: 'app.js',
                    args: [],
                    ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'], // 非监听项
                    watchedExtensions: ['js'],
                    watchedFolders: ['./'],
                    debug: true,
                    delayTime: 1,
                    env: {
                        PORT: 3000 // 端口
                    },
                    cwd: __dirname
                }
            }
        },
        // 执行其他两个任务
        concurrent: {
            tasks: ['nodemon', 'watch'],
            options: {
                logConcurrentOutput: true // 是否输出log
            }
        }
    })
        // 加载插件
    grunt.loadNpmTasks("grunt-contrib-watch")
    grunt.loadNpmTasks("grunt-nodemon")
    grunt.loadNpmTasks("grunt-concurrent")

    // 开发时不会因为语法问题中断服务器
    grunt.option('force', true)
    // 默认执行的任务
    grunt.registerTask('default', ['concurrent'])
}
