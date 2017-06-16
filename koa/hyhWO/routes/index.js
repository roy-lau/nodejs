var router = require('koa-router')();

router.get('/', function *(next) {
  yield this.render('index', {
    title: '号外号-首页'
  });
});

router.get('/product/Corporate-nickname', function *(next) {
  yield this.render('/pages/product/voiceClass/Corporate-nickname', {
    title: '号外号-产品'
  });
});

module.exports = router;
