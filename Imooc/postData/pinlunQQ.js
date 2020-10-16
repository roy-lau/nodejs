/**
 * 评论功能(QQ)
 */
var http = require("http");
var querystring = require("querystring");

var postData = querystring.stringify({
  content: "技术灌水的-------------",
  // 'cid': 50 || 897379293 //提交的ID  在表单数据：查看topicId
});
var options = {
  hostname: "h5.qzone.qq.com",
  port: 80,
  path:
    "/proxy/domain/taotao.qzone.qq.com/cgi-bin/emotion_cgi_re_feeds?g_tk=1019123916&qzonetoken=95fb25ee2ab82cah602aa7a78b54330788f10904af44d5409108bc20cd19d39f29cf026f32fb12ab102a8612aee5e7b22d942c11ce7455e3709b18bf674d0481a19a8", //路径 查看消息头： 请求网址的后半部分
  method: "POST",
  headers: {
    Host: "h5.qzone.qq.com",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 6.1; rv:51.0) Gecko/20100101 Firefox/51.0",
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3",
    "Accept-Encoding": "gzip, deflate",
    Cookie:
      "pt2gguin=o0897379911; ptcz=192ecbb0881cfb9e318df6b2483ce4f46e698b3b5d3bc5031c9f50a9e643f999; ptui_loginuin=qiangliu@cncaas.cn; pgv_pvid=8537430836; QZ_FE_WEBP_SUPPORT=0; o_cookie=897379293; pgv_gdtid=juk2ywalbiamimxdy6la; pgv_pvi=824552448; RK=lMVnbCbqUQ; uin=o0897379911; skey=@zbBi8yyAY; Loading=Yes; p_skey=owte2g4eovcz78yhyhDWsdP-t7pt-6eOdtXJkIFqmXE_; p_uin=o0897379911; pt4_token=ClV2MtfRppReFOU9aqlPnrnd35MEPHmiXw54-q-khL8_; pgv_info=ssid=s7973702664; cpu_performance_v8=27; pgv_si=s7619046400; rv2=80D1B3ED2FC86054119E972E69CFD148D416A86CC8373F685D; property20=073DCF73F2F0C0D8653BB3A115E59FA0684D2D7385FB22033BD118F2161F8A6A902CB4C2F5C7750D; __Q_w_s_hat_seed=1; __Q_w_s__QZN_TodoMsgCnt=1",
    Connection: "keep-alive",
    "Upgrade-Insecure-Requests": "1",

    "Content-Length": postData.length,
  },
};

var req = http.request(options, function (res) {
  console.log("Status:" + res.statusCode);
  console.log("headers:" + JSON.stringify(res.headers));

  res.on("data", function (chunk) {
    console.log(Buffer.isBuffer(chunk));
    console.log(typeof chunk);
  });

  res.on("end", function () {
    console.log("评论完毕！");
  });
});

req.on("error", function (e) {
  console.log("Error:" + e.message);
});

req.write(postData);
req.end();
