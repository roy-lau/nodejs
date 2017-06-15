var router = require('koa-router')();

router.get('/', function *(next) {
  yield this.render('index', {
    title: '号外号-首页'
  });
});

router.get('/foo', function *(next) {
  yield this.render('index', {
    title: 'Hello World foo!'
  });
});

module.exports = router;
