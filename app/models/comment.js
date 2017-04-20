var mongoose = require('mongoose');
var CommentSchema = require('../schemas/comment');
//用模式 构建模型
var Comment = mongoose.model('Comment', CommentSchema);
//导出 模型构造函数
module.exports = Comment;