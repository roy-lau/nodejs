const Router = require('koa-router'),
  router = new Router(),
  { index, upload } = require('../controllers/home.js')

router.get('/', index)
  .post('/upload', upload)

module.exports = router;