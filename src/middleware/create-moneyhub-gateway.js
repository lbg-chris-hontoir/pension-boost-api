const { Moneyhub } = require('@mft/moneyhub-api-client')
const config = require('../config.json')

const createMoneyhubGateway = async (ctx, next) => {
  ctx.moneyHub = await Moneyhub(config)
  await next()
}

module.exports = {
  createMoneyhubGateway
}
