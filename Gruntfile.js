module.exports = function(grunt){

	grunt.initConfig({
		//在添加、更改或删除监视的文件模式时运行 预定义任务
		watch: {
			jade: {
				files: ['views/**'],
				options: {
					livereload: true
				}
			},
			js: {
				files: ['public/js/**','models/**/*.js','schemas/**/*.js'],
				// task: ['jshint'],
				options: {
					livereload: true
				}
			}
		},
		//配置、启动 入口文件（用 grunt 启动 node app.js）
		nodemon: {
			dev: {
				options:{
					file: 'app.js',
					args: [],
					ignoredFiles: ['README.md','node_modules/**','.DS_Store'],
					watchedExtensions: ['js'],
					watchedFolders: ['app','config'],
					debug: true,
					delayTime: 1,
					env: {
						PORT: 3000
					},
					cwd: __dirname
				}
			}
		},
		//并发任务
		concurrent: {
			target: {
				tasks: ['nodemon', 'watch'],
				options: {
					logConcurrentOutput: true
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-concurrent');

	grunt.option('force',true);
	grunt.registerTask('default' , ['concurrent:target']);
   
}