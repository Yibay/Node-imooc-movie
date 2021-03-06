$(function(){
	$(".del").click(function(e){
		var target = $(e.target);
		var id = target.data("id");
		var tr = $(".item-id-" + id);
		$.ajax({
			type: "DELETE",
			url: "/admin/movie/list?id=" + id
		}).done(function(results){
			if(results.success === 1){
				if(tr){
					tr.remove();
				}
			}
		});
	});

	//自动 填写表单
	$("#douban").blur(function(){
		var douban = $(this);
		var id = douban.val();

		if(id){
			//jsonp 跨域获取json
			$.ajax({
				url: "https://api.douban.com/v2/movie/subject/" + id,
				cache: true,
				type: 'get',
				dataType: 'jsonp',
				crossDomain: true,
				jsonp: 'callback',
				success: function(data){
					$('#inputTitle').val(data.title);
					$('#inputDoctor').val(data.directors[0].name);
					$('#inputCountry').val(data.countries[0]);
					$('#inputLanguage').val();
					$('#inputPoster').val(data.images.large);
					$('#inputFlash').val();
					$('#inputYear').val(data.year);
					$('#inputSummary').val(data.summary);

				}
			});
		}

	});

})