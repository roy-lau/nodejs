
/**
 * 公用代码——头部
 */
$(function() {
    /**
     * 点击导航菜单 （点击其他菜单时未能关闭上一个菜单bug，有待处理）
     * @param
     * @return {[type]}   [description]
     */
    $(".dlm_menu_icon").click(function(event) {
        $(this).children("#dlm_menu_list").toggle();
        event.stopPropagation();
    })
    // .mouseleave(function(){
    //     $(this).children("#dlm_menu_list").hide();
    // })
    $(document).click(function() {
        $(".dlm_menu_icon #dlm_menu_list").hide()
    });
})