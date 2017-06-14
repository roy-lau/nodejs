	// 控制显示、隐藏子菜单
	//- 产品
	$('#product_item').hover(function() {
	    $('#product_menu').stop(true, true);
	    $('#product_menu').slideDown();
	}, function() {
	    // $('#product_menu').stop(true, true);
	    $('#product_menu').slideUp();
	});
