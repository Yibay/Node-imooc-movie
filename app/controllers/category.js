//载入mongodb 操作模型
var Category = require('../models/category');
var Movie = require('../models/movie');
var Comment = require('../models/comment');
var _ = require('underscore');

// admin new page
exports.new = function(req, res){
	res.render('category_admin',{
		title: 'imooc 后台分类录入页',
		category: {
			// name: ''
		}
	});
};
// admin post category
exports.save = function(req, res){
	var _category = req.body.category;
	console.log("post:" + _category);
	var category = new Category(_category);
	category.save(function(err, category){
		if(err){
			console.log(err);
		}
		console.log("save:" + category);
		res.redirect('/admin/category/list');
	});
};

// list page
exports.list = function(req, res){
	Category.fetch(function(err, categories){
		if(err){
			console.log(err);
		}
		res.render('category_list',{
			title: 'imooc 分类列表页',
			categories: categories
		});
	});
};
// admin update category  :id为路径参数
exports.update = function(req, res){
	//req.params请求中的 路径参数
	var id = req.params.id;
	if(id){
		Category.findById(id, function(err, category){
			if(err){
				console.log(err);
			}
			res.render('category_admin', {
				title: 'imooc 后台分类更新页',
				category: category
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