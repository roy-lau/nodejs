!(function e(t, a, r) {
  function s(o, i) {
    if (!a[o]) {
      if (!t[o]) {
        var u = "function" == typeof require && require;
        if (!i && u) return u(o, !0);
        if (n) return n(o, !0);
        throw new Error("Cannot find module '" + o + "'");
      }
      var l = (a[o] = { exports: {} });
      t[o][0].call(
        l.exports,
        function (e) {
          var a = t[o][1][e];
          return s(a ? a : e);
        },
        l,
        l.exports,
        e,
        t,
        a,
        r
      );
    }
    return a[o].exports;
  }
  for (
    var n = "function" == typeof require && require, o = 0;
    o < r.length;
    o++
  )
    s(r[o]);
  return s;
})(
  {
    1: [
      function (e, t, a) {
        "use strict";
        function r(e, t) {
          return e && e.getAttribute ? e.getAttribute(t) || "" : "";
        }
        function s(e) {
          return (
            (o = o || document.getElementsByTagName("head")[0]),
            i && !e ? i : o ? (i = o.getElementsByTagName("meta")) : []
          );
        }
        function n(e) {
          var t,
            a,
            n,
            o = s(),
            i = o.length;
          for (t = 0; i > t; t++)
            (a = o[t]), r(a, "name") === e && (n = r(a, "content"));
          return n || "";
        }
        var o, i;
        (a.tryToGetAttribute = r),
          (a.getMetaTags = s),
          (a.getMetaCnt = n),
          (a.indexof = function (e, t) {
            for (var a = 0; a < e.length; a++) if (e[a] === t) return a;
            return -1;
          });
        var u = function (e, t) {
          return (e += ""), e.length < t && (e = "0" + e), e;
        };
        a.getDateMin = function () {
          var e = new Date(),
            t = "";
          return (
            (t += e.getFullYear()),
            (t += u(e.getMonth() + 1, 2)),
            (t += u(e.getDate(), 2)),
            (t += u(e.getHours(), 2)),
            (t += u(e.getMinutes(), 2))
          );
        };
      },
      {},
    ],
    2: [
      function (e, t, a) {
        t.exports = e("./src/grey");
      },
      { "./src/grey": 3 },
    ],
    3: [
      function (e, t, a) {
        function r(e) {
          if (e)
            try {
              var t = f.createElement("script");
              t.appendChild(f.createTextNode(e)),
                g.parentNode.insertBefore(t, g);
            } catch (a) {
              (
                h.execScript ||
                function (e) {
                  h.eval.call(h, e);
                }
              )(e);
            }
        }
        function s(e, t, a) {
          if (/blitz/i.test(p)) return void a();
          var r,
            s = "GET",
            n = function () {
              r.responseText ? t(r.responseText) : a();
            };
          y
            ? ((r = new XMLHttpRequest()), r.open(s, e, !0))
            : ((r = new XDomainRequest()), r.open(s, e)),
            (r.timeout = m.timeout),
            (r.onload = n),
            (r.onerror = a),
            (r.ontimeout = a),
            r.send();
        }
        function n(e, t) {
          var a = f.createElement("script");
          (a.type = "text/javascript"),
            (a.async = !0),
            o(a, t),
            (a.src = e),
            g.parentNode.insertBefore(a, g);
        }
        function o(e, t) {
          function a() {
            (e.onreadystatechange = e.onload = null),
              (e = null),
              w(t) && t({ from: "script" });
          }
          if ("onload" in e) e.onload = a;
          else {
            var r = function () {
              /loaded|complete/.test(e.readyState) && a();
            };
            (e.onreadystatechange = r), r();
          }
        }
        function i(e, t) {
          return e + Math.floor(Math.random() * (t - e + 1));
        }
        function u(e, t) {
          return i(1, t) <= e;
        }
        function l(e, t) {
          var a;
          for (a in t) t.hasOwnProperty(a) && (e[a] = t[a]);
          return e;
        }
        function c(e, t) {
          return function (a) {
            return e.call(null, l(t, a || {}));
          };
        }
        function v(e) {
          return function (t) {
            return {}.toString.call(t) == "[object " + e + "]";
          };
        }
        var h = window,
          f = document,
          p = navigator.userAgent,
          g = f.getElementsByTagName("script")[0],
          d = h.XDomainRequest,
          y = h.XMLHttpRequest && "withCredentials" in new XMLHttpRequest(),
          _ = function () {},
          b = {
            set: function (e, t) {
              try {
                return localStorage.setItem(e, t), !0;
              } catch (a) {
                return !1;
              }
            },
            get: function (e) {
              return localStorage.getItem(e);
            },
            test: function () {
              var e = "grey_test_key";
              try {
                return (
                  localStorage.setItem(e, 1), localStorage.removeItem(e), !0
                );
              } catch (t) {
                return !1;
              }
            },
          },
          m = { base: 1e4, timeout: 1e4 },
          j = { _config: m };
        (j.load = function (e) {
          e = l(
            {
              isStorage: !0,
              isLoadDevVersion: function () {},
              dev: "",
              devKey: "",
              devHash: "",
              stable: "",
              stableKey: "",
              stableHash: "",
              grey: "",
              greyKey: "",
              greyHash: "",
              base: m.base,
            },
            e
          );
          var t,
            a,
            o,
            i,
            v = e.hash,
            h = {};
          if (
            (e.ratio >= e.base || u(e.ratio, e.base)
              ? ((t = e.greyKey),
                (a = e.grey),
                (i = e.greyHash),
                (h.type = "grey"))
              : ((t = e.stableKey),
                (a = e.stable),
                (i = e.stableHash),
                (h.type = "stable")),
            w(e.isLoadDevVersion) &&
              e.isLoadDevVersion() &&
              ((t = e.devKey), (a = e.dev), (i = e.devHash), (h.type = "dev")),
            (h.url = a),
            (h.key = t),
            (h.hash = i),
            w(e.before) && e.before(h),
            (e.after = w(e.after) ? c(e.after, h) : _),
            e.isStorage && b.test() && t && (y || d) && w(v))
          )
            if (((o = b.get(t)), o && i === v(o, h)))
              try {
                r(o), e.after({ from: "local" });
              } catch (f) {
                n(a, e.after);
              }
            else
              s(
                a,
                function (a) {
                  b.set(t, a), r(a), e.after({ from: "cors" });
                },
                function () {
                  n(a, e.after);
                }
              );
          else n(a, e.after);
          return this;
        }),
          (j.config = function (e) {
            return l(m, e || {}), this;
          });
        var w = (Array.isArray || v("Array"), v("Function"));
        t.exports = j;
      },
      {},
    ],
    4: [
      function (e, t, a) {
        "use strict";
        !(function () {
          var t = e("../grey/util"),
            a = e("./for_aplus_fns"),
            r = {
              "aplus_v2.js": {
                stable_version: {
                  value: "7.1.14",
                  hash: "aplus_v2.js7.1.14@451a7dc9",
                },
                grey_version: {
                  value: "7.2.4",
                  hash: "aplus_v2.js7.2.4@3b20e593",
                },
                dev_version: {
                  value: "7.2.4",
                  hash: "aplus_v2.js7.2.4@3b20e593",
                },
              },
              "aplus_o.js": {
                stable_version: {
                  value: "7.1.14",
                  hash: "aplus_o.js7.1.14@120b4bfd",
                },
                grey_version: {
                  value: "7.2.4",
                  hash: "aplus_o.js7.2.4@55cec9c4",
                },
                dev_version: {
                  value: "7.2.4",
                  hash: "aplus_o.js7.2.4@55cec9c4",
                },
              },
              "aplus_std.js": {
                stable_version: {
                  value: "7.1.14",
                  hash: "aplus_std.js7.1.14@2fdcddeb",
                },
                grey_version: {
                  value: "7.2.4",
                  hash: "aplus_std.js7.2.4@7febcdf1",
                },
                dev_version: {
                  value: "7.2.4",
                  hash: "aplus_std.js7.2.4@7febcdf1",
                },
              },
              "aplus_int.js": {
                stable_version: {
                  value: "7.1.14",
                  hash: "aplus_int.js7.1.14@6c748fdd",
                },
                grey_version: {
                  value: "7.2.4",
                  hash: "aplus_int.js7.2.4@829747",
                },
                dev_version: {
                  value: "7.2.4",
                  hash: "aplus_int.js7.2.4@829747",
                },
              },
              "aplus_wap.js": {
                stable_version: {
                  value: "7.1.14",
                  hash: "aplus_wap.js7.1.14@7d45669e",
                },
                grey_version: {
                  value: "7.2.4",
                  hash: "aplus_wap.js7.2.4@3ace4f45",
                },
                dev_version: {
                  value: "7.2.4",
                  hash: "aplus_wap.js7.2.4@3ace4f45",
                },
              },
            },
            s = window,
            n = "g_aplus_grey_launched";
          if (!s[n]) {
            s[n] = 1;
            var o = e("@ali/grey-publish"),
              i = location.protocol;
            0 != i.indexOf("http") && (i = "http:");
            var u = i + "//g.alicdn.com/alilog/s",
              l = a.getAplusVersion("aplus_std.js"),
              c = "",
              v = [
                { key: "201703210700", value: 0.1 },
                { key: "201703211200", value: 0.5 },
                { key: "201703220200", value: 1 },
              ],
              h = {
                "aplus_v2.js": [
                  /^https?:\/\/(.*\.)?uland\.taobao\.com/i,
                  /^https?:\/\/(.*\.)?alibaba-inc\.com/i,
                ],
                "aplus_std.js": [
                  /^https?:\/\/(.*\.)?uland\.taobao\.com/i,
                  /^https?:\/\/(.*\.)?alibaba-inc\.com/i,
                ],
              },
              f = function () {
                var e,
                  t = r[l] || {},
                  a = t.dev_version || {},
                  s = a.hash;
                if (l && s) {
                  var n,
                    o = h[l] || [];
                  for (n = 0; n < o.length; n++)
                    if (location.href.match(o[n])) {
                      e = !0;
                      break;
                    }
                }
                return e;
              },
              p = function () {
                var e = "";
                if (v && v.length > 0)
                  for (var a = t.getDateMin(), r = 0; r < v.length; r++) {
                    var s = v[r].key + "";
                    a >= s && (e = Math.floor(1e4 * v[r].value));
                  }
                return e;
              },
              g = function () {
                var e,
                  t = "aplus_grey_ratio";
                "number" == typeof s[t] && (e = Math.floor(1e4 * s[t]));
                var a = location.search.match(
                  new RegExp("\\b" + t + "=([\\d\\.]+)")
                );
                return (
                  a &&
                    ((a = parseFloat(a[1])),
                    isNaN(a) || (e = Math.floor(1e4 * a))),
                  e
                );
              },
              d = p(),
              y = g();
            d && (c = d),
              y && (c = y),
              (s.goldlog = s.goldlog || {}),
              goldlog.record ||
                (goldlog.record = function (e, t, a, r) {
                  (s.goldlog_queue || (s.goldlog_queue = [])).push({
                    action: "goldlog.record",
                    arguments: [e, t, a, r],
                  });
                });
            var _ = r[l],
              b = l.split(".")[0];
            o.load({
              isLoadDevVersion: f,
              dev: [u, _.dev_version.value, l].join("/"),
              devKey: "APLUSGREYd_" + b,
              devHash: _.dev_version.hash,
              stable: [u, _.stable_version.value, l].join("/"),
              stableKey: "APLUSGREYs_" + b,
              stableHash: _.stable_version.hash,
              grey: [u, _.grey_version.value, l].join("/"),
              greyKey: "APLUSGREYg_" + b,
              greyHash: _.grey_version.hash,
              ratio: c,
              hash: function (t, a) {
                var r = e("./hash").hash(t);
                switch (a.type) {
                  case "stable":
                    r = l + _.stable_version.value + "@" + r;
                    break;
                  case "grey":
                    r = l + _.grey_version.value + "@" + r;
                    break;
                  case "dev":
                    r = l + _.dev_version.value + "@" + r;
                }
                return r;
              },
              before: function (e) {
                switch (e.type) {
                  case "grey":
                    goldlog.lver = _.grey_version.value;
                    break;
                  case "stable":
                    goldlog.lver = _.stable_version.value;
                    break;
                  case "dev":
                    goldlog.lver = _.dev_version.value;
                }
              },
            });
          }
        })();
      },
      {
        "../grey/util": 1,
        "./for_aplus_fns": 5,
        "./hash": 6,
        "@ali/grey-publish": 2,
      },
    ],
    5: [
      function (e, t, a) {
        "use strict";
        var r = e("./util"),
          s = function () {
            return [
              "aplus_v2.js",
              "aplus_o.js",
              "aplus_std.js",
              "aplus_int.js",
              "aplus_wap.js",
            ];
          };
        a.getAplusFns = s;
        var n = function () {
            for (
              var e,
                t = [
                  {
                    version: "aplus_o.js",
                    domains: [
                      /^https?:\/\/(.*\.)?youku\.com/i,
                      /^https?:\/\/(.*\.)?tudou\.com/i,
                      /^https?:\/\/(.*\.)?soku\.com/i,
                      /^https?:\/\/(.*\.)?laifeng\.com/i,
                    ],
                  },
                  {
                    version: "aplus_int.js",
                    domains: [
                      /^https?:\/\/(.*\.)?scmp\.com/i,
                      /^https?:\/\/(.*\.)?luxehomes\.com\.hk/i,
                      /^https?:\/\/(.*\.)?ays\.com\.hk/i,
                      /^https?:\/\/(.*\.)?cpjobs\.com/i,
                      /^https?:\/\/(.*\.)?educationpost\.com\.hk/i,
                      /^https?:\/\/(.*\.)?elle\.com\.hk/i,
                      /^https?:\/\/(.*\.)?harpersbazaar\.com\.hk/i,
                      /^https?:\/\/(.*\.)?esquirehk\.com/i,
                    ],
                  },
                ],
                a = 0;
              a < t.length;
              a++
            )
              for (
                var r = t[a].domains, s = t[a].version, n = 0;
                n < r.length;
                n++
              )
                if (location.href.match(r[n])) {
                  e = s;
                  break;
                }
            return e;
          },
          o = function () {
            var e = r.getMetaCnt("aplus-version");
            e && (e += ".js");
            var t = s();
            return r.indexof(t, e) > -1 ? e : null;
          },
          i = function () {
            try {
              for (
                var e = document, t = e.getElementsByTagName("script"), a = 0;
                a < t.length;
                a++
              ) {
                var r = t[a].getAttribute("src");
                if (
                  /alilog\/mlog\/aplus_\w+\.js/.test(r) ||
                  /alicdn\.com\/js\/aplus_\w+\.js/.test(r)
                )
                  return r;
              }
              return "";
            } catch (s) {
              return "";
            }
          },
          u = function () {
            var e = "";
            try {
              var t = document,
                a =
                  t.getElementById("tb-beacon-aplus") ||
                  t.getElementById("beacon-aplus");
              if ((a && (e = a.getAttribute("src")), e || (e = i()), e)) {
                var r = e.match(/aplus_\w+\.js/);
                "object" == typeof r && r.length > 0 && (e = r[0]);
              }
            } catch (s) {
              e = "";
            } finally {
              return e;
            }
          };
        a.getAplusVersion = function (e) {
          var t;
          try {
            t = e;
            var a = u();
            a && (t = a);
            var r = n();
            r && (t = r);
            var s = o();
            s && (t = s), "aplus_v2.js" === t && (t = "aplus_std.js");
          } catch (i) {
            t = "aplus_std.js";
          } finally {
            return t;
          }
        };
      },
      { "./util": 7 },
    ],
    6: [
      function (e, t, a) {
        "use strict";
        a.hash = function (e) {
          var t,
            a,
            r = 1315423911;
          for (t = e.length - 1; t >= 0; t--)
            (a = e.charCodeAt(t)), (r ^= (r << 5) + a + (r >> 2));
          return (2147483647 & r).toString(16);
        };
      },
      {},
    ],
    7: [
      function (e, t, a) {
        t.exports = e(1);
      },
      {},
    ],
  },
  {},
  [4]
);
