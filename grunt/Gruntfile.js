/**
 * Created by Roy-lau on 2016/5/14.
 */
module.exports=function(grunt){
    grunt.initConfig({
        /**
         * css精灵
         * 安装 npm install grunt --save-dev
         * 安装 npm install grunt-spritesmith --save-dev
         * 运行 grunt sprite
         */
        sprite:{
            devMode:{
                src:['public/images/*.png','!public/images/banner.png','!public/images/bannerPhone.jpg'],
                dest:'public/images/spriteRes.png',
                destCss:'public/css/spriteRes.css'
            }
        },
        /**
         * imagemin 压缩图片
         * 安装 npm install grunt-contrib-imagemin --save-dev
         * 运行 grunt imagemin
         */
        imagemin:{
            release:{
                files:[{
                    expand:true,
                    src:['public/images/spriteRes.png','public/images/banner.png','public/images/bannerPhone.jpg']
                }],
                options:{
                    optimizationLevel:3
                }
            }
        },
        /**
         * cssmin 压缩css
         * 安装 npm install grunt-contrib-cssmin --save-dev
         * 运行 grunt cssmin
         */
        cssmin:{
            target:{
                files:[{
                    expand:true,
                    cwd:'public/css',
                    src:['*.css','!*.min.css'],
                    dest:'public/css',
                    ext:'.min.css'
                }]
            }
        },
        /**
         * jshint 校验js文件
         * 安装 npm install grunt-contrib-jshint --save-dev
         * 运行 grunt jshint
         */
        jshint:['Gruntfile.js'],
        /**
         * concat 合并JS,CSS
         * 安装 npm install grunt-contrib-concat --save-dev
         * 运行 grunt concat
         */
        concat:{
            js:{
                files:{
                    'build/js/bundle.js':['public/js/jquery-1.11.3.js','public/js/bootstrap.js']
                }
            },
            css:{
                files:{
                    'build/css/final.css':['public/css/*.css','!public/css/*.min.css']
                }
            }
        },
        /**
         * uglify 精简JS
         * 安装 npm install grunt-contrib-uglify --save-dev
         * 运行 grunt uglify
         */
        uglify:{
            min:{
                files:{
                    'build/js/uglify.min.js':'build/js/bundle.js'
                }
            }
        },
        /**
         * less 编译less文件
         * 安装 npm install grunt-contrib-less --save-dev
         * 运行 grunt less
         */
        less:{
            compile:{
                files:{
                    'public/css/index.css':'public/css/*.less'
                }
            }
        },
        /**
         * 安装 npm install grunt-contrib-watch --save-dev
         * watch文件监听
         * 运行 grunt watch
         */
        watch:{
            less:{
                tasks:['less:compile'],
                files:['public/css/*.less']
            },
            concat:{
                tasks:['concat:js'],
                files:['public/js/*.js']
            },
            uglify:{
                tasks:['uglify:min'],
                files:['build/js/bundle.js']
            }
        }

    });
    grunt.loadNpmTasks('grunt-spritesmith');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default',['jshint']);
    grunt.registerTask('js','concat and uglify js assets',['concat:js','uglify:min']);
    grunt.registerTask('build','build a whole project',['sprite','less','cssmin','uglify','concat','imagemin']);
};