var mongoose = require('mongoose');
var UserSchema = require('../schemas/user');
//用模式 构建模型
var User = mongoose.model('User', UserSchema);
//导出 模型构造函数
module.exports = User;