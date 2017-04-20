//载入mongodb 操作模型
var Comment = require('../models/comment');

exports.save = function(req, res){
	var _comment = req.body.comment;
	var movieId = _comment.movie;

	//若存在cid说明是 回复，则查找被回复的comment，向其reply数组中，push
	if(_comment.cid){
		Comment.findById(_comment.cid, function(err, comment){
			if(err){
				console.log(err);
			}
			var reply = {
				from: _comment.from,
				to: _comment.tid,
				content: _comment.content
			};
			comment.reply.push(reply);

			comment.save(function(err, comment){
				if (err) {
					console.log(err);
				};
				res.redirect('/movie/' + movieId);
			});
		});
	}
	//若为普通评论，则直接新增评论
	else{
		var comment = new Comment(_comment);
		comment.save(function(err, comment){
			if(err){
				console.log(err);
			}
			res.redirect('/movie/' + movieId);
		});
	}

}
