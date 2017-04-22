//载入Controller 函数模块
var Index = require('../app/controllers/index');
var Movie = require('../app/controllers/movie');
var User = require('../app/controllers/user');
var Comment = require('../app/controllers/comment');
var Category = require('../app/controllers/category');
	//underscore extend方法 将 第2参数中值变动的属性，替换第1参数中属性值
var _ = require('underscore');

module.exports = function(app){
	//web 过滤器
	//使用use，则在 get、post等方法前，先经过此过滤器
	app.use(function(req, res, next){
		var _user = req.session.user;
		//如果session.user 存在，赋值给 全局user
		//如果session.user 不存在，置空 全局user
		app.locals.user = _user;
		next();
	});

	//web 路由
	// index 
	app.get('/', Index.index);

	// User
	app.post('/user/signup', User.signup);
	app.post('/user/signin', User.signin);
	app.get('/signin', User.showSignin);
	app.get('/signup', User.showSignup);
	app.get('/logout', User.logout);
	app.get('/admin/userlist', User.signinRequired, User.adminRequired, User.list);

	// Movie 插入中间件，则按顺序依次执行，中间件记得用next 来执行下一流程
	app.get('/movie/:id', Movie.detail);
	app.get('/admin/movie/new', User.signinRequired, User.adminRequired,  Movie.new);
	app.post('/admin/movie', User.signinRequired, User.adminRequired,  Movie.save);
	app.get('/admin/movie/list', User.signinRequired, User.adminRequired,  Movie.list);
	app.get('/admin/movie/update/:id', User.signinRequired, User.adminRequired,  Movie.update);
	app.delete('/admin/movie/list', User.signinRequired, User.adminRequired,  Movie.del);

	// Comment
	app.post('/user/comment', User.signinRequired, Comment.save);

	// Category
	app.get('/admin/category/new', User.signinRequired, User.adminRequired, Category.new);
	app.post('/admin/category', User.signinRequired, User.adminRequired, Category.save);
	app.get('/admin/category/update/:id', User.signinRequired, User.adminRequired, Category.update);
	app.get('/admin/category/list', User.signinRequired, User.adminRequired, Category.list);

}