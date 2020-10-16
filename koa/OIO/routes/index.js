var router = require("koa-router")();

router.get("/", function* (next) {
  yield this.render("index", {
    title: "号外号-首页",
  });
});

router.get("/price", function* (next) {
  yield this.render("/pages/price", {
    title: "号外号-价格",
  });
});
router.get("/experience", function* (next) {
  yield this.render("/pages/experience", {
    title: "号外号-体验",
  });
});
router.get("/api-doc", function* (next) {
  yield this.render("/pages/APIdoc", {
    title: "号外号-开发文档",
  });
});

router.get("/product/Corporate-nickname", function* (next) {
  yield this.render("/pages/product/voiceClass/Corporate-nickname", {
    title: "号外号-产品-企业外号",
  });
});
router.get("/product/Security-privacy-number", function* (next) {
  yield this.render("/pages/product/voiceClass/Security-privacy-number", {
    title: "号外号-产品-安全隐私号",
  });
});
router.get("/product/One-button-double-call", function* (next) {
  yield this.render("/pages/product/voiceClass/One-button-double-call", {
    title: "号外号-产品-一键双呼",
  });
});
router.get("/product/Business-card", function* (next) {
  yield this.render("/pages/product/voiceClass/Business-card", {
    title: "号外号-产品-企业名片",
  });
});

router.get("/product/SMS-authentication-code", function* (next) {
  yield this.render("/pages/product/smsClass/SMS-authentication-code", {
    title: "号外号-产品-短信验证码",
  });
});
router.get("/product/SMS-platform", function* (next) {
  yield this.render("/pages/product/smsClass/SMS-platform", {
    title: "号外号-产品-短信发送平台",
  });
});
router.get("/product/SMS-notification", function* (next) {
  yield this.render("/pages/product/smsClass/SMS-notification", {
    title: "号外号-产品-短信通知",
  });
});
router.get("/product/Notice-of-flashing-letters", function* (next) {
  yield this.render("/pages/product/smsClass/Notice-of-flashing-letters", {
    title: "号外号-产品-闪信通知",
  });
});

module.exports = router;
