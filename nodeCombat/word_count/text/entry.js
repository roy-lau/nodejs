/* 2017-03-14 22:06:27 */
!(function (n, e) {
  function t(n) {
    var t = e.createElement("iframe");
    return (
      (t.style.cssText = "width:0;height:0;display:none"),
      (t.src = n),
      (t.id = s),
      e.body.appendChild(t),
      t
    );
  }
  function o(n) {
    var t = new RegExp("(^| )" + n + "=([^;]*)(;|$)"),
      o = e.cookie.match(t);
    return o ? o[2] || "" : "";
  }
  function a() {
    return (
      navigator.userAgent.indexOf("Windows NT 5.1") >= 0 &&
      (navigator.userAgent.indexOf("MSIE 6") >= 0 ||
        navigator.userAgent.indexOf("MSIE 7") >= 0 ||
        navigator.userAgent.indexOf("MSIE 8") >= 0) &&
      "https:" === location.protocol
    );
  }
  function i() {
    var n = navigator.userAgent.toLowerCase();
    return (
      n.indexOf("android") >= 0 ||
      n.indexOf("iphone") >= 0 ||
      n.indexOf("ipad") >= 0 ||
      n.indexOf("ipod") >= 0 ||
      n.indexOf("mobile") >= 0
    );
  }
  function c(n, e, t) {
    var o = !!n.attachEvent,
      a = "attachEvent",
      i = "addEventListener",
      c = o ? a : i;
    n[c]((o ? "on" : "") + e, t);
  }
  function r(n, e, t) {
    var o = !!n.detachEvent,
      a = "detachEvent",
      i = "removeEventListener",
      c = o ? a : i;
    n[c]((o ? "on" : "") + e, t);
  }
  function d() {
    function a(e) {
      if (!(g++ > 6))
        try {
          n[s] &&
            n[s].contentWindow &&
            n[s].contentWindow.postMessage("opl_ms", "*");
        } catch (e) {}
    }
    function i(t) {
      try {
        t.data &&
          ("opl_attach" == t.data
            ? c(e, "mousemove", a)
            : "opl_detach" == t.data
            ? r(e, "mousemove", a)
            : t.data.match(/^opl_quit/) && r(n, "message", i));
      } catch (t) {}
    }
    function m() {
      return null != n.location.host.match(/(ditu.amap.com|sycm.taobao.com)/i);
    }
    var f = new Date().getTime();
    if (8e3 > f - u) {
      var v = o("cna"),
        l = o("nickname");
      if (v || l) {
        var g = 0;
        m() && c(n, "message", i);
        t(
          "//g.alicdn.com/alilog/oneplus/blk.html#coid=" +
            encodeURIComponent(v) +
            "&noid=" +
            encodeURIComponent(l) +
            "&grd=" +
            (m() ? "y" : "n")
        );
      } else
        n.setTimeout(function () {
          d();
        }, 300);
    }
  }
  try {
    var s = "_oid_ifr_",
      u = new Date().getTime();
    a() || i() || d();
  } catch (m) {}
})(window, document);
