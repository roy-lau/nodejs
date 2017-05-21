$(function(){
	$('.del').click(function(e){
		var target = $(e.target),
		id = target.data('id'),
		tr = $('.item-id-' + id);

		$.ajax({
			type:'DELETE',
			url: '/admin/list',
			data:{id: id}, // 向服务器发送要删除的id
			dataType: "json"
		})
		.done(function(res){
			if(res.success === 1){
				if(tr.length > 0){
					tr.remove()
				}
			}
		})
	})
})