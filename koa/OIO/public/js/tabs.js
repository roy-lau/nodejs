// tab切换

$(function () {
  $(".tab-list li").hover(
    function () {
      $("div.tab-img")
        .eq($(".tab-list li").index(this))
        .addClass("on-imgs")
        .siblings()
        .removeClass("on-imgs");
      $(".tab-list li")
        .eq($(".tab-list li").index(this))
        .addClass("on-list")
        .siblings()
        .removeClass("on-list");
    },
    function () {
      $("div.tab-img")
        .eq($(".tab-list li").index(this))
        .siblings()
        .removeClass("on-imgs");
      $(".tab-list li")
        .eq($(".tab-list li").index(this))
        .siblings()
        .removeClass("on-list");
    }
  );
});
