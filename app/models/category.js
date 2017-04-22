var mongoose = require('mongoose');
var CategorySchema = require('../schemas/category');
//用模式 构建模型
var Category = mongoose.model('Category', CategorySchema);
//导出 模型构造函数
module.exports = Category;