//载入mongodb 操作模型
var Movie = require('../models/movie');
var Catetory = require('../models/category');

// index page
exports.index = function(req, res){

	//回调函数中，第1个参数 异常，第2个参数 查询结果
	Catetory
		.find({})
		//将属性 movies 关联扩展 成对象
		//select 选择扩展 进对象 的属性
		//options 配置参数 limit 为限制 数组返回个数
		.populate({path: 'movies', options: {limit: 5}})
		.exec(function(err, catetories){
			if(err){
				console.log(err);
			}
			//第1个参数 模版文件名称，第2个参数 注入模版中的数据
			res.render('index',{
				title: 'imooc 首页', 
				catetories: catetories
			});
		});

};

// search page
exports.search = function(req, res){

	var catId = req.query.cat;
	var page = req.query.p;
	var count = 2;
	var index = page * count;

	//回调函数中，第1个参数 异常，第2个参数 查询结果
	Catetory
		.find({_id: catId})
		//path 选属性 movies 关联扩展 成对象
		//select 选择扩展 进对象 的属性
		//options 配置参数 limit 为限制 数组返回个数
		.populate({
			path: 'movies', 
			select: 'title poster'
		})
		.exec(function(err, catetories){
			if(err){
				console.log(err);
			}
			console.log(catetories);
			var catetory = catetories[0] || [];
			var movies = catetory.movies || [];
			var total_pages = Math.ceil(movies.length / count);
			var cerrent_page = Number(page) + 1;
			var results = movies.slice(index, index +count);
			console.log(results);
			//第1个参数 模版文件名称，第2个参数 注入模版中的数据
			res.render('results',{
				title: 'imooc 结果列表页', 
				keyword: catetory.name,
				movies: results,
				total_pages: total_pages,
				cerrent_page: cerrent_page,
				catId: catId
			});
		});

};