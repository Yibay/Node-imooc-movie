var express = require('express');
var app = express();

//连接数据库
var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:12345/imooc');

// 设置模版路径
app.set('views','./views/pages');
// 设置模版引擎
app.set('view engine','jade');

// 将表单数据格式化 为obj
var bodyParser = require('body-parser');
app.use(bodyParser());

// 设置静态资源文件路径
var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

//设置全局参数
app.locals.moment = require('moment');

// 监听端口号
var port = process.env.PORT || 3000;
app.listen(port);
//后台日志：确认已正常启动
console.log('imooc started on port ' + port);

//载入Movie模型
var Movie = require('./models/movie');

//web 路由
// index page
app.get('/',function(req, res){
	//回调函数中，第1个参数 异常，第2个参数 查询结果
	Movie.fetch(function(err, movies){
		if(err){
			console.log(err);
		}
		//第1个参数 模版文件名称，第2个参数 注入模版中的数据
		res.render('index',{
			title: 'imooc 首页',
			movies: movies
		});
	});
});

// detail page
app.get('/movie/:id',function(req, res){
	var id = req.params.id;
	//回调函数中，第1个参数 异常，第2个参数 查询结果
	Movie.findById(id, function(err, movie){
		if(err){
			console.log(err);
		}
		res.render('detail',{
			title: 'imooc ' + movie.title,
			movie: movie
		});
	});
});

// admin page
app.get('/admin/movie',function(req, res){
	res.render('admin',{
		title: 'imooc 后台录入页',
		movie: {
			title: '',
			doctor: '',
			country: '',
			year: '',
			poster: '',
			flash: '',
			summary: '',
			language: ''
		}
	});
});
// admin post movie
var _ = require('underscore');
app.post('/admin/movie/new',function(req, res){
	console.log(req.body);
	var id = req.body.movie._id;
	var movieObj = req.body.movie;
	var _movie;
	if(id !== 'undefined'){
		Movie.findById(id, function(err, movie){
			if(err){
				console.log(err);
			}
			//underscore extend方法 将 第2参数中值变动的属性，替换第1参数中属性值
			_movie = _.extend(movie, movieObj);
			//此时_movie 已为Movie模型实例，使用save方法，可保存数据到mongo数据库
			_movie.save(function(err, movie){
				if(err){
					console.log(err);
				}
				//修改成功后，重定向到 对应详情页
				res.redirect('/movie/' + movie._id);
			});
		});
	}
	else{
		//用Movie模型 实例化
		_movie = new Movie({
			doctor: movieObj.doctor,
			title: movieObj.title,
			language: movieObj.language,
			country: movieObj.country,
			summary: movieObj.summary,
			flash: movieObj.flash,
			poster: movieObj.poster,
			year: movieObj.year
		});
		_movie.save(function(err, movie){
			if(err){
				console.log(err);
			}
			res.redirect('/movie/' + movie._id);
		});
	}
});

// list page
app.get('/admin/list',function(req, res){
	Movie.fetch(function(err, movies){
		if(err){
			console.log(err);
		}
		res.render('list',{
			title: 'imooc 列表页',
			movies: movies
		});
	});
});
// admin update movie  :id为路径参数
app.get('/admin/update/:id', function(req, res){
	//req.params请求中的 路径参数
	var id = req.params.id;
	if(id){
		Movie.findById(id, function(err, movie){
			if(err){
				console.log(err);
			}
			res.render('admin', {
				title: 'imooc 后台更新页',
				movie: movie
			});
		});
	}
});
// admin remove movie
app.delete('/admin/list',function(req, res){
	//req.query请求中的查询参数
	var id = req.query.id;
	if(id){
		Movie.remove({_id: id},function(err, movie){
			if(err){
				console.log(err);
			}
			else{
				res.json({success: 1});
			}
		});
	}
});