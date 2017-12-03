//载入mongodb 操作模型
var Movie = require('../models/movie');
var Comment = require('../models/comment');
var Category = require('../models/category');
var _ = require('underscore');

// detail page
exports.detail = function(req, res){
	var id = req.params.id;
	//回调函数中，第1个参数 异常，第2个参数 查询结果
	Movie.findById(id, function(err, movie){
		if(err){
			console.log(err);
		}
		if(movie){
			Comment
				.find({movie: id})
				//0. populate 关联替换
				//1. populate, 将 comment实例的from属性，变成一个对象。
				//2. from对象中_id：原来from的ObjectId，
				//3. 同时给from对象增加一个name属性 为通过ObjectId 找到对应的User表中的user的name属性值
				.populate('from','name')
				.populate('reply.from reply.to','name')
				//exex(func) 获取前面结果，执行的回调函数
				.exec(function(err, comments){
				if(err){
					console.log(err);
				}
				res.render('detail',{
					title: 'imooc ' + movie.title,
					movie: movie,
					comments: comments
				});
			});
		}
		else{
			res.redirect('/');
		}
	});
};

// admin new page
exports.new = function(req, res){
	Category.find({}, function(err, categories){
		res.render('admin',{
			title: 'imooc 后台录入页',
			categories: categories,
			movie: {}
		});
	});
};
// admin post movie
exports.save = function(req, res){
	console.log(req.body);
	var id = req.body.movie._id;
	var movieObj = req.body.movie;
	var _movie;
	//修改
	if(id){
		Movie.findById(id, function(err, movie){
			if(err){
				console.log(err);
			}
			console.log("1" + movie.category.toString());
			console.log("2" + movieObj.category.toString());
			console.log("3" + (movie.category.toString() !== movieObj.category.toString()));
			//如果分类是否修改过
			if(movie.category.toString() !== movieObj.category.toString()){
				//删除原有分类下，movie的id
				Category.findOne({_id: movie.category}, function(err, category){
					var index = category.movies.indexOf(movie._id);
					if(index !== -1){
						category.movies.splice(index, 1);
						console.log("原分类：" + category.movies);
						category.save(function(err, category){
							if(err){
								console.log(err);
							}
						});
					}
					//在新分类下，增加movie的id
					Category.findOne({_id: movieObj.category}, function(err, category){
						category.movies.push(movie._id);
						console.log("新分类：" + category.movies);
						category.save(function(err, category){
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
						
					});
				});
			}
			else{
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
			}
		});
	}
	//新增
	else{
		//已选择 已有分类
		if(movieObj.category){
			//用Movie模型 实例化
			_movie = new Movie(movieObj);
			_movie.save(function(err, movie){
				if(err){
					console.log(err);
				}
				Category.findOne({_id: movie.category},function(err, category){
					category.movies.push(movie._id);
					category.save(function(err, category){
						if(err){
							console.log(err);
						}
						res.redirect('/movie/' + movie._id);
					});
				});
			});
		}
		//未选择 已有分类，且新建分类内有 名称
		else if(movieObj.categoryName.trim()){
			//新建分类
			var _category = new Category({
				name: movieObj.categoryName.trim(),
				movies: []
			});
			_category.save(function(err, category){
				if(err){
					console.log(err);
				}
				//把新建分类 id，绑定到 要新建的 movie上
				movieObj.category = category._id;
					//用Movie模型 实例化
					_movie = new Movie(movieObj);
					_movie.save(function(err, movie){
						if(err){
							console.log(err);
						}
						Category.findOne({_id: movie.category},function(err, category){
							category.movies.push(movie._id);
							category.save(function(err, category){
								if(err){
									console.log(err);
								}
								res.redirect('/movie/' + movie._id);
							});
						});
					});
			});
		}
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
			Category.find({}, function(err, categories){
				if(err){
					console.log(err);
				}
				res.render('admin', {
					title: 'imooc 后台更新页',
					movie: movie,
					categories: categories
				});
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