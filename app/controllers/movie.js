//载入mongodb 操作模型
var Movie = require('../models/movie');
var _ = require('underscore');

// detail page
exports.detail = function(req, res){
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
};

// admin new page
exports.new = function(req, res){
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
};
// admin post movie
exports.save = function(req, res){
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
};

// list page
exports.list = function(req, res){
	Movie.fetch(function(err, movies){
		if(err){
			console.log(err);
		}
		res.render('list',{
			title: 'imooc 列表页',
			movies: movies
		});
	});
};
// admin update movie  :id为路径参数
exports.update = function(req, res){
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
};
// admin remove movie
exports.del = function(req, res){
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
};