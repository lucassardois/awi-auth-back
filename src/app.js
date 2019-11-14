const express = require('express')
const app = express()
const morgan = require('morgan')

const { inProd, inTest } = require('./util')
const auth = require('./routeAuth')

// Setup correct logger
if (inProd()) {
  app.use(morgan('combined'))
} else if (!inTest()) {
  app.use(morgan('dev'))
}

// Setup routes
app.get('/', (req, res) => {
  res.status(200).send('Homepage of the AWI auth api.')
})

app.get('/oauth/authorize', auth.authorize)
app.post('/oauth/auth', auth.auth)
app.post('/oauth/token', auth.token)
app.post('/oauth/refresh', auth.refresh)

app.use((req, res, next) => {
  res.status(404).send('Route not found.')
})

module.exports = app
