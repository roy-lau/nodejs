!(function a(b, c, d) {
  function e(g, h) {
    if (!c[g]) {
      if (!b[g]) {
        var i = "function" == typeof require && require;
        if (!h && i) return i(g, !0);
        if (f) return f(g, !0);
        throw new Error("Cannot find module '" + g + "'");
      }
      var j = (c[g] = { exports: {} });
      b[g][0].call(
        j.exports,
        function (a) {
          var c = b[g][1][a];
          return e(c ? c : a);
        },
        j,
        j.exports,
        a,
        b,
        c,
        d
      );
    }
    return c[g].exports;
  }
  for (
    var f = "function" == typeof require && require, g = 0;
    g < d.length;
    g++
  )
    e(d[g]);
  return e;
})(
  {
    1: [
      function (a, b, c) {
        b.exports = function (a, b) {
          for (
            var c,
              d = [],
              e = ["custom", "error", "performance", "retCode", "speed", "log"],
              f = 0,
              g = function (a) {
                return function () {
                  d.push({
                    type: a,
                    params: Array.prototype.slice.call(arguments),
                  });
                };
              };
            (c = e[f++]);

          )
            a[c] = g(c);
          (a.reloaded = function () {
            a.ready();
            for (var b = 0, c = d.length; c > b; b++)
              a[d[b].type].apply(a, d[b].params);
          }),
            (a.reloadFailed = function () {
              "function" == typeof b && b();
            });
        };
      },
      {},
    ],
    2: [
      function (a, b, c) {
        b.exports = function (a, b) {
          var c, d;
          if (a.startTime) c = a.startTime;
          else
            try {
              (c = window.performance.timing.responseStart), (d = new Date());
            } catch (e) {
              d = c = new Date() - 0;
            }
          var f = function (b, c) {
            (c = c || a.config.sample),
              a.sampling(c) == (a.config.modVal || 1) &&
                ((b.sampling = c), a.send(b));
          };
          (a.custom = function (c, d, e) {
            var g = { type: "custom", usernick: a.getNick() },
              h = ["time", "count"];
            (c = h[c] || c),
              ("time" == c || "count" == c) && (g.category = c),
              g.type && ((g.key = d), (g.value = "time" == c ? e : b), f(g));
          }),
            (a.error = function (b, c, d, e) {
              var g = {
                type: "jserror",
                usernick: encodeURIComponent(a.getNick()),
              };
              1 == arguments.length && ((c = b), (b = void 0)),
                c &&
                  ((g.category = b || "sys"),
                  (g.msg = encodeURIComponent(c)),
                  d && (g.file = d),
                  e && (g.line = e),
                  f(g, 1));
            }),
            (a.performance = function (b) {
              var c = { type: "per" };
              f(a.extend(c, b));
            }),
            (a.retCode = function (b, d, e, g) {
              var h = {
                type: "retcode",
                api: encodeURIComponent(b),
                issucess: d,
                usernick: a.getNick(),
                delay: "number" == typeof e ? parseInt(e, 10) : new Date() - c,
                msg: encodeURIComponent(g),
                sampling: this.config.retCode[b],
              };
              "undefined" != typeof h.delay && f(h, d ? h.sampling : 1);
            });
          var g = function () {
            for (
              var b, c = { type: "speed" }, d = 0, e = a.speed.points.length;
              e > d;
              d++
            )
              (b = a.speed.points[d]),
                b && ((c["s" + d] = b), (a.speed.points[d] = null));
            f(c);
          };
          (a.speed = function (b, e, f) {
            var h;
            "string" == typeof b && (b = parseInt(b.slice(1), 10)),
              "number" == typeof b &&
                ((h = a.speed.points || new Array(11)),
                (h[b] = "number" == typeof e ? e : new Date() - c),
                h[b] < 0 && (h[b] = new Date() - d),
                (a.speed.points = h)),
              clearTimeout(a.speed.timer),
              f ? g() : (a.speed.timer = setTimeout(g, 3e3));
          }),
            (a.log = function (b, c) {
              var d = {
                type: "log",
                msg: encodeURIComponent(b),
                usernick: encodeURIComponent(a.getNick()),
              };
              f(d, c);
            });
        };
      },
      {},
    ],
    3: [
      function (a, b, c) {
        b.exports = function (a, b, c) {
          var d = function () {
              var a = {
                  rrt: ["responseStart", "requestStart"],
                  dns: ["domainLookupEnd", "domainLookupStart"],
                  cnt: ["connectEnd", "connectStart"],
                  ntw: ["responseStart", "fetchStart"],
                  dct: ["domContentLoadedEventStart", "responseStart"],
                  flt: ["loadEventStart", "responseStart"],
                },
                b = {};
              try {
                var c = performance.timing;
                for (var d in a) b[d] = c[a[d][0]] - c[a[d][1]];
              } catch (e) {}
              return b;
            },
            e = function () {
              a.performance(d());
            };
          c
            ? e()
            : a.on(
                b,
                "load",
                function () {
                  e();
                },
                !0
              ),
            a.on(
              b,
              "beforeunload",
              function () {
                a.clear(), a.speed.points && a.speed(null, null, !0);
              },
              !0
            );
          var f = b.onerror;
          (b.onerror = function (b, c, d) {
            f && f(b, c, d), c ? a.error("sys", b, c, d) : a.error(b);
          }),
            /wpodebug\=1/.test(location.search) &&
              ((a.config.sample = 1), (a.config.modVal = 1), (a.debug = !0));
        };
      },
      {},
    ],
    4: [
      function (a, b, c) {
        var d = function () {
            return +new Date() + Math.floor(1e3 * Math.random());
          },
          e = "",
          f = function () {
            var a = document.getElementsByTagName("meta"),
              b = [];
            if (e) return e;
            for (var c = 0; c < a.length; c++) {
              var d = a[c];
              d &&
                d.name &&
                ("data-spm" == d.name || "spm-id" == d.name) &&
                b.push(d.content);
            }
            return (
              document.body &&
                document.body.getAttribute("data-spm") &&
                b.push(document.body.getAttribute("data-spm")),
              (b = b.length ? b.join(".") : 0),
              b && -1 == b.indexOf(".") && (b += ".0"),
              (e = b)
            );
          };
        f.bind ||
          (f.bind = function () {
            return f;
          }),
          (b.exports = {
            sendRequest: function (a) {
              var b = window,
                c = "jsFeImage_" + d(),
                e = (b[c] = new Image());
              (e.onload = e.onerror = function () {
                b[c] = null;
              }),
                (e.src = a),
                (e = null);
            },
            getCookie: function () {
              return document.cookie;
            },
            getSpmId: f,
          });
      },
      {},
    ],
    5: [
      function (a, b, c) {
        b.exports = function (a, b, c) {
          var d,
            e,
            f = {},
            g = {
              imgUrl: "//retcode.taobao.com/r.png?",
              sample: 100,
              modVal: 1,
              dynamic: !1,
              retCode: {},
            },
            h = 0,
            i = c.sendRequest,
            j = function () {
              for (
                var b, c;
                (b = l.dequeue()) &&
                ((c = l.extend(
                  {
                    uid: d,
                    spm: g.spmId || l.getSpmId(),
                    times: b.times ? b.times : 1,
                    _t: ~new Date() + (h++).toString(),
                  },
                  b
                )),
                c.spm);

              )
                a.debug && window.console && console.log(c),
                  i(g.imgUrl + l.query.stringify(c));
              e = null;
            },
            k = function (a) {
              a && e && (clearTimeout(e), j()), e || (e = setTimeout(j, 1e3));
            },
            l = {
              ver: "0.1.2",
              _key: "wpokey",
              getCookie: function (a) {
                var b, d, e;
                if (!f[a]) {
                  b = new RegExp(a + "=([^;]+)");
                  try {
                    e = c.getCookie(this);
                  } catch (g) {}
                  (d = b.exec(e)), d && (f[a] = d[1]);
                }
                return f[a];
              },
              setCookie: function (a, b, c, d, e) {
                var f = a + "=" + b;
                d && (f += "; domain=" + d),
                  e && (f += "; path=" + e),
                  c && (f += "; expires=" + c),
                  (document.cookie = f);
              },
              extend: function (a) {
                for (
                  var b,
                    c = Array.prototype.slice.call(arguments, 1),
                    d = 0,
                    e = c.length;
                  e > d;
                  d++
                ) {
                  b = c[d];
                  for (var f in b) b.hasOwnProperty(f) && (a[f] = b[f]);
                }
                return a;
              },
              guid: function () {
                return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
                  /[xy]/g,
                  function (a) {
                    var b = (16 * Math.random()) | 0,
                      c = "x" == a ? b : (3 & b) | 8;
                    return c.toString(16);
                  }
                );
              },
              send: function (a) {
                this.queue(a);
              },
              query: {
                stringify: function (a) {
                  var b = [];
                  for (var c in a)
                    a.hasOwnProperty(c) &&
                      void 0 !== a[c] &&
                      b.push(c + "=" + a[c]);
                  return b.join("&");
                },
                parse: function (a) {
                  for (
                    var b, c = a.split("&"), d = {}, e = 0, f = c.length;
                    f > e;
                    e++
                  )
                    (b = c[e].split("=")), (d[b[0]] = b[1]);
                  return d;
                },
              },
              getSpmId: function () {
                return g.spmId
                  ? g.spmId
                  : "function" == typeof c.getSpmId
                  ? c.getSpmId.call(this)
                  : 0;
              },
              on: function (a, b, c, d) {
                a.addEventListener
                  ? a.addEventListener(
                      b,
                      d
                        ? function () {
                            a.removeEventListener(b, c, !1), c();
                          }
                        : c,
                      !1
                    )
                  : a.attachEvent &&
                    a.attachEvent("on" + b, function () {
                      d && a.detachEvent("on" + b, arguments.callee), c();
                    });
              },
              getNick: function () {
                var a;
                try {
                  return TB.Global.util.getNick();
                } catch (b) {
                  return (
                    (a =
                      this.getCookie("_nk_") ||
                      this.getCookie("_w_tb_nick") ||
                      this.getCookie("lgc")),
                    decodeURIComponent(a)
                  );
                }
              },
              setConfig: function (a) {
                return l.extend(g, a);
              },
              dynamicConfig: function (a) {
                var b = this.stringifyData(a);
                try {
                  localStorage.setItem(this._key, b);
                } catch (c) {
                  this.setCookie(this._key, b, new Date(a.expTime));
                }
                this.ready();
              },
              parseData: function (a) {
                for (
                  var b, c = a.split("&"), d = {}, e = 0, f = c.length;
                  f > e;
                  e++
                )
                  (b = c[e].split("=")), (d[b[0]] = b[1]);
                return d;
              },
              stringifyData: function (a) {
                var b = [];
                for (var c in a) a.hasOwnProperty(c) && b.push(c + "=" + a[c]);
                return b.length ? b.join("&") : "";
              },
              ready: function (a) {
                (this._ready = !0), (this._immediately = a), k();
              },
              queue: function (a) {
                var b,
                  c = this.requestQueue;
                if ("jserror" === a.type) {
                  if (c.length && ((b = c[c.length - 1]), a.msg === b.msg))
                    return void b.times++;
                  a.times || (a.times = 1);
                }
                c.push(a), this._ready && (this._immediately ? j() : k());
              },
              dequeue: function () {
                return this.requestQueue.shift();
              },
              clear: function () {
                k(!0);
              },
              requestQueue: a.requestQueue || [],
            };
          return (
            (d = l.guid()),
            (a.uid = d),
            (l.config = l.setConfig(a.config)),
            l.extend(a, l),
            (b.__WPO = a),
            a
          );
        };
      },
      {},
    ],
    6: [
      function (a, b, c) {
        !(function () {
          var b = this.__WPO || {},
            c = 2,
            d = this,
            e = !1;
          a("./core")(b, d, a("./conf-browser"));
          var f = function () {
            a("./sampling")(b),
              a("./apis")(b),
              a("./browser-performance")(b, d, e);
          };
          return b.config.dynamic && !(c = a("./server-config")(b))
            ? void a("./api-await")(b, function () {
                f(), b.reloaded && b.reloaded();
              })
            : (2 == c
                ? b.on(
                    d,
                    "load",
                    function () {
                      b.ready();
                    },
                    !0
                  )
                : b.on(d, "load", function () {
                    e = !0;
                  }),
              void f());
        })();
      },
      {
        "./api-await": 1,
        "./apis": 2,
        "./browser-performance": 3,
        "./conf-browser": 4,
        "./core": 5,
        "./sampling": 7,
        "./server-config": 8,
      },
    ],
    7: [
      function (a, b, c) {
        b.exports = function (a) {
          var b = {};
          a.sampling = function (c) {
            a.uid;
            return 1 == c
              ? 1
              : "number" == typeof b[c]
              ? b[c]
              : ((b[c] = Math.floor(Math.random() * c)), b[c]);
          };
        };
      },
      {},
    ],
    8: [
      function (a, b, c) {
        b.exports = function (a) {
          var b,
            c,
            d,
            e,
            f = a._key,
            g = function (a) {
              var b = document.createElement("script");
              return (
                (b.src = a),
                document
                  .getElementsByTagName("script")[0]
                  .parentNode.appendChild(b),
                b
              );
            },
            h = function () {
              var b =
                  "//retcode.alicdn.com/retcode/pro/config/" +
                  a.getSpmId() +
                  ".js",
                c = g(b);
              c.onerror = function () {
                (c.onerror = null),
                  a.error("sys", "dynamic config error", b, 0),
                  a.ready();
              };
            };
          if (!f) return 2;
          try {
            b = localStorage.getItem(f);
          } catch (i) {
            b = a.getCookie(f);
          }
          return b
            ? ((c = a.parseData(b)),
              (selfUpdate = function () {
                var b = a.ver && a.ver.split("."),
                  d = c.ver && c.ver.split(".");
                if (!b || !d) return !1;
                for (var e = 0, f = b.length; f > e; e++)
                  if (d[e] && parseInt(b[e], 10) < parseInt(d[e], 10))
                    return !0;
                return !1;
              }),
              selfUpdate()
                ? ((e = "//g.alicdn.com/cm/retlog/" + c.ver + "/log.js"),
                  (d = g(e)),
                  (d.onload = function () {
                    (d.onload = null), a.reloaded();
                  }),
                  (d.onerror = function () {
                    (d.onerror = null),
                      a.error("sys", "self update error", e, 0),
                      a.reloadFailed();
                  }),
                  0)
                : parseInt(c.exp, 10) < new Date().getTime()
                ? (h(), 1)
                : (a.setConfig({ sample: parseInt(c.sample, 10) }), 2))
            : (h(), 1);
        };
      },
      {},
    ],
  },
  {},
  [6]
);
