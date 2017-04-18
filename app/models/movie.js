var mongoose = require('mongoose');
var MovieSchema = require('../schemas/movie');
//用模式 构建模型
var Movie = mongoose.model('Movie', MovieSchema);
//导出 模型构造函数
module.exports = Movie;