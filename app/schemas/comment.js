var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//获取 ObjectId 类型
var ObjectId = Schema.Types.ObjectId;

//构建模式
var CommentSchema = new Schema({
	movie: {
		type: ObjectId,
		ref: 'Movie'
	},
	//0. populate 关联替换
	//1. 通过ObjectId, 定位到对应collection表，再通过populate方法 做替换填充
			//2. populate, 将 comment实例的from属性，变成一个对象。
			//3. from对象中_id：原来from的ObjectId，
			//4. 同时给from对象增加一个(如: name)属性 为通过ObjectId 找到对应的User表中的user的(如: name)属性值
	from: {
		type: ObjectId,
		ref: 'User'
	},
	reply: [
		{
			from: {
				type: ObjectId,
				ref: 'User'
			},
			to: {
				type: ObjectId,
				ref: 'User'
			},
			content: String
		}
	],
	content: String,
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
CommentSchema.pre('save', function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}
	else{
		this.meta.updateAt = Date.now();
	}
	next();
});

//静态方法
CommentSchema.statics = {
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
module.exports = CommentSchema;