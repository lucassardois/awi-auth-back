
// This must be the first thing to be done
if (!process.env.APP_ENV) {
  process.env.APP_ENV = 'dev'
}

const {
  inProduction,
  inIntegration
} = require('./util')

const logger = require('./logger')
const port = 3000

// Link to the login of the react app
if (!process.env.LOGIN_URL) {
  if (inProduction() || inIntegration()) {
    logger.error('No LOGIN_URL set')
    process.exit(-1)
  }

  process.env.LOGIN_URL = 'http://localhost:5000/login'
}

logger.info(`Auth server started in ${process.env.APP_ENV}`)

// Check that the DB connection works
require('./db').connect()
  .then(() => {
    logger.info('Connected to the database')
  })
  .catch((err) => {
    logger.error(`Error when connecting to database: ${err}`)

    if (inProduction() || inIntegration()) {
      process.exit(-1)
    }
  })

// Check that the LDAP works
const client = require('./ldap').createLDAPClient()

client.on('error', (err) => {
  logger.error(err)
})

client.on('connectTimeout', () => {
  logger.warn('Connection timed out, LDAP server cannot be reached.' +
    ' This may happen when you are not on the same' +
    ' network as the Polytech LDAP, you can use a VPN to fix this')
})

client.bind('test@isim.intra', 'test', () => {
  logger.info('Connected to LDAP')
})

// Load routes and listen for connections
const app = require('./app')

app.listen(port, () => {
  logger.info(`Listening on port ${port}`)
})
