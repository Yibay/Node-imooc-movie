var express = require('express');
var app = express();

var dbUrl = 'mongodb://127.0.0.1:12345/imooc';

//连接数据库
var mongoose = require('mongoose');
// Use native promises insteadof mpromise
mongoose.Promise = global.Promise;
mongoose.connect(dbUrl);

// 设置模版路径
app.set('views','./views/pages');
// 设置模版引擎
app.set('view engine','jade');

// 将表单数据格式化 为obj
var bodyParser = require('body-parser');
app.use(bodyParser());
//cookie格式化
var cookieParser = require('cookie-parser');
app.use(cookieParser());
//session
var session = require('express-session');
//session持久化——存储在mongodb数据库中
//因为session中间件不再绑定在express上，所以传入session，而非传入express
var mongoStore = require('connect-mongo')(session);
app.use(session({
	secret: 'imooc',
	store: new mongoStore({
		url: dbUrl,
		collection: 'session'
	})
}))

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

//载入mongodb 操作模型
var Movie = require('./models/movie');
var User = require('./models/user');

//web 过滤器
// pre handle user
app.use(function(req, res, next){
	var _user = req.session.user;
	if(_user){
		app.locals.user = _user;
	}
	return next();
});
//web 路由
// index page
app.get('/',function(req, res){
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
});

// signup
app.post('/user/signup',function(req, res){
	var _user = req.body.user;
	User.find({name: _user.name},function(err, user){
		if(err){
			console.log(err);
		}
		//find没有匹配对象时，返回的是空数组[]，则length===0
		if(user.length > 0){
			res.redirect('/');
		}
		else{
			var user = new User(_user);
			user.save(function(err, user){
				if(err){
					console.log(err);
				}
				console.log(user);
				res.redirect('/admin/userlist');
			});
		}
	});
});
// signin
app.post('/user/signin',function(req, res){
	var _user = req.body.user;
	var name = _user.name;
	var password = _user.password;
	User.findOne({name: name},function(err, user){
		if(err){
			console.log(err);
		}
		if(!user){
			return res.redirect('/');
		}
		else{
			user.comparePassword(password, function(err, isMatch){
				if(err){
					console.log(err);
				}
				if(isMatch){
					req.session.user = user;
					return res.redirect('/');
				}
				else{
					console.log('Password is not matched');
				}
			});
		}
	});
});
// logout
app.get('/logout', function(req, res){
	delete req.session.user;
	delete app.locals.user;
	res.redirect('/');
});

// userlist page
app.get('/admin/userlist',function(req, res){
	User.fetch(function(err, users){
		if(err){
			console.log(err);
		}
		res.render('userlist',{
			title: 'imooc 用户列表页',
			users: users
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