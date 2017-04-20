//载入mongodb 操作模型
var User = require('../models/user');

// signup Page
exports.showSignup = function(req, res){
	res.render('signup',{
		title: '注册页面'
	});
};
// signin Page
exports.showSignin = function(req, res){
	res.render('signin',{
		title: '登录页面'
	});
};
// signup
exports.signup = function(req, res){
	var _user = req.body.user;
	User.find({name: _user.name},function(err, user){
		if(err){
			console.log(err);
		}
		//find没有匹配对象时，返回的是空数组[]，则length===0
		if(user.length > 0){
			res.redirect('/signin');
		}
		else{
			var user = new User(_user);
			user.save(function(err, user){
				if(err){
					console.log(err);
				}
				console.log(user); 
				res.redirect('/');
			});
		}
	});
};
// signin
exports.signin = function(req, res){
	var _user = req.body.user;
	var name = _user.name;
	var password = _user.password;
	User.findOne({name: name},function(err, user){
		if(err){
			console.log(err);
		}
		if(!user){
			return res.redirect('/signup');
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
					return res.redirect('/signin');
				}
			});
		}
	});
};
// logout
exports.logout = function(req, res){
	delete req.session.user;
	// delete app.locals.user;
	res.redirect('/');
};

// userlist Page
exports.list = function(req, res){
	User.fetch(function(err, users){
		if(err){
			console.log(err);
		}
		res.render('userlist',{
			title: 'imooc 用户列表页',
			users: users
		});
	});
};

// midware check signin
exports.signinRequired = function(req, res, next){
	var user = req.session.user;
	if(!user){
		res.redirect('/signin');
	}
	next();
}
// mideware check admin
exports.adminRequired = function(req, res, next){
	var user = req.session.user;
	if(!user.role || user.role <= 10){
		res.redirect('/signin');
	}
	next();
}