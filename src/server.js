const Koa = require('koa')

const { router }  = require('./router')
const { createMoneyhubGateway } = require('./middleware/create-moneyhub-gateway')
const { requestLogger } = require('./middleware/request-logger.js')

const app = new Koa()

app.use(requestLogger)
app.use(createMoneyhubGateway)

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(6000, () => {
  console.log('Server started on port 6000')
})
