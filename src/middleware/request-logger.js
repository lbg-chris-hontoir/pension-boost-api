const requestLogger = async (ctx, next) => {
  const start = new Date()
  await next()
  const end = new Date()

  const log = {
    code: '00001',
    name: 'Request',
    message: 'Incoming request',
    metadata: {
      timestamp: new Date()
    },
    data: {
      method: ctx.method,
      path: ctx.path,
      status: ctx.status,
      elapsed: end - start
    },
    privateData: {
      query: ctx.request.query,
      body: ctx.request.body
    }
  }

  console.log(JSON.stringify(log))
}

module.exports = {
  requestLogger
}
