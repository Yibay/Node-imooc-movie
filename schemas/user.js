var mongoose = require('mongoose');
//bcrypt 加密加盐 模块
var bcrypt = require('bcryptjs');
//定义 盐的复杂度,默认也为 10
var SALT_WORK_FACTOR = 10;

//构建模式
var UserSchema = new mongoose.Schema({
	//unique 是否唯一
	name: {
		unique: true,
		type: String
	},
	password: String,
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
});

//每次存储数据前，调用的方法
UserSchema.pre('save', function(next){
	//获取 user实例
	var user = this;

	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}
	else{
		this.meta.updateAt = Date.now();
	}

	//随机生成盐
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
		if(err){
			return next(err);
		}
		//用 用户密码，盐，生成 加密hash
		bcrypt.hash(user.password, salt, function(err, hash){
			if(err){
				return next(err);
			}
			user.password = hash;
			next();
		});
	});

});

//实例方法
UserSchema.methods = {
	//验证密码
	comparePassword: function(_password, cb){
		//实例方法中，this指向实例本身
		//compare 第一参数为 加密前的值，第2个参数为 加密后的值，
		//        通过回调函数中的 isMatch boolean值判定是否相等
		bcrypt.compare(_password, this.password, function(err, isMatch){
			if(err){
				return cb(err);
			}
			cb(null, isMatch);
		});
	}
}

//静态方法
UserSchema.statics = {
	fetch: function(cb){
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(cb)
	},
	findById: function(id, cb){
		return this.findOne({_id: id})
			.exec(cb)
	}
}

//导出整个模块
module.exports = UserSchema;