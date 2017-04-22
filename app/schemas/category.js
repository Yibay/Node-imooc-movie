var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//获取到mongoodb collection 中 唯一标示 ObjectId类型
var ObjectId = Schema.Types.ObjectId;

//构建模式
var CategorySchema = new mongoose.Schema({
	name: String,
	movies: [
		{
			type: ObjectId,
			ref: 'Movie'
		}
	],
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
CategorySchema.pre('save', function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}
	else{
		this.meta.updateAt = Date.now();
	}
	next();
});

//静态方法
CategorySchema.statics = {
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
module.exports = CategorySchema;