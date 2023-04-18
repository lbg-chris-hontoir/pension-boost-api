const Router = require('koa-router')

const { getV1PensionRoundupAnalysis } = require('./handlers/get-v1-pension-roundup-analysis')

const router = new Router()

router.get('/v1/pension-roundup-analysis', getV1PensionRoundupAnalysis)

module.exports = {
  router
}
