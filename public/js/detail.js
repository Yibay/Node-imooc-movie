$(function(){
	//事件绑定在类上，所以同时绑定了主评论中的头像，和子评论中的头像
	$('.comment').click(function(){
		var target = $(this);
		var toId = target.data('tid');
		var commentId = target.data('cid');

		//判断是否已经 插入过隐藏input
		if($('#toId').length > 0){
			$('#toId').val(toId);
		}
		else{
			$('<input>').attr({
				'type': 'hidden',
				'id': 'toId',
				'name': 'comment[tid]',
				'value': toId
			}).appendTo('#commentForm');
		}

		if($('#commentId').length > 0){
			$('#commentId').val(commentId);
		}
		else{
			//comment[cid] 用于辨识如果是 回复别人，用commentId来查找对应的comment，然后向reply数组里 push回复
			$('<input>').attr({
				'type': 'hidden',
				'id': 'commentId',
				'name': 'comment[cid]',
				'value': commentId
			}).appendTo('#commentForm');

		}
	});
});