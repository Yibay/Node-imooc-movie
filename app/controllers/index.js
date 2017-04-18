//载入mongodb 操作模型
var Movie = require('../models/movie');

// index page
exports.index = function(req, res){
	console.log('user in session: ');
	console.log(req.session.user);

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
};