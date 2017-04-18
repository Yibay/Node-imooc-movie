//载入Controller 函数模块
var Index = require('../app/controllers/index');
var Movie = require('../app/controllers/movie');
var User = require('../app/controllers/user');
	//underscore extend方法 将 第2参数中值变动的属性，替换第1参数中属性值
var _ = require('underscore');

module.exports = function(app){
	//web 过滤器
	// pre handle user
	app.use(function(req, res, next){
		var _user = req.session.user;
		if(_user){
			app.locals.user = _user;
		}
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

	// Movie
	app.get('/movie/:id', Movie.detail);
	app.get('/admin/movie', User.signinRequired, User.adminRequired,  Movie.new);
	app.post('/admin/movie/new', User.signinRequired, User.adminRequired,  Movie.save);
	app.get('/admin/list', User.signinRequired, User.adminRequired,  Movie.list);
	app.get('/admin/update/:id', User.signinRequired, User.adminRequired,  Movie.update);
	app.delete('/admin/list', User.signinRequired, User.adminRequired,  Movie.del);

}