var router = require('koa-router')();

router.get('/', function *(next) {
  yield this.render('index', {
    title: '号外号-首页'
  });
});

router.get('/product/Corporate-nickname', function *(next) {
  yield this.render('/pages/product/voiceClass/Corporate-nickname', {
    title: '号外号-产品-企业外号'
  });
});
router.get('/product/Security-privacy-number', function *(next) {
  yield this.render('/pages/product/voiceClass/Security-privacy-number', {
    title: '号外号-产品-安全隐私号'
  });
});
router.get('/product/One-button-double-call', function *(next) {
  yield this.render('/pages/product/voiceClass/One-button-double-call', {
    title: '号外号-产品-一键双呼'
  });
});
router.get('/product/Business-card', function *(next) {
  yield this.render('/pages/product/voiceClass/Business-card', {
    title: '号外号-产品-企业名片'
  });
});





短信通知

闪信通知
router.get('/product/Corporate-nickname', function *(next) {
  yield this.render('/pages/product/voiceClass/Corporate-nickname', {
    title: '号外号-产品-短信验证码'
  });
});
router.get('/product/Corporate-nickname', function *(next) {
  yield this.render('/pages/product/voiceClass/Corporate-nickname', {
    title: '号外号-产品-短信发送平台'
  });
});
router.get('/product/Corporate-nickname', function *(next) {
  yield this.render('/pages/product/voiceClass/Corporate-nickname', {
    title: '号外号-产品-企业外号'
  });
});
router.get('/product/Corporate-nickname', function *(next) {
  yield this.render('/pages/product/voiceClass/Corporate-nickname', {
    title: '号外号-产品-企业外号'
  });
});

module.exports = router;
