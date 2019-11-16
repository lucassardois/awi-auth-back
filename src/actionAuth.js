const uuid = require('uuid')
const jwt = require('jsonwebtoken')

const { ldap, createLDAPClient } = require('./ldap')
const db = require('./db')

exports.clientIdExists = async (clientId) => {
  // Return true if the clientId exists in the database,
  // else return false.
  const sql = `
    SELECT *
    FROM client
    WHERE "client_id"=$1
  `
  const { rows } =
    await db.query(sql, [clientId])
  return rows.length === 1
}

exports.findAuthorizedRow = async (authorizationCode) => {
  // Return the line in the database matching this
  // authorizationCode, if noone was found return false.
  const sql = `
    SELECT *
    FROM authorization_code
    WHERE "code"=$1
  `

  const { rows } = await
    db.query(sql, [authorizationCode])
  
  if (rows.length === 1) {
    let row = rows[0]

    // Format data
    return {
      code: row.code,
      firstname: row.first_name,
      lastname: row.last_name,
      section: row.section,
      role: row.role
    }
  }

  return null
}

exports.deleteAuthorizedRow = async (authorizationCode) => {
  // Delete the authorized row corresponding to the given
  // authorizationCode
  const sql = `
    DELETE
    FROM authorization_code
    WHERE "code"=$1
  `

  return await db.query(sql, [authorizationCode])
}

exports.auth = async (username, password) => {
  // Verify user authentication in the LDAP and
  // if valid, create an authorization_code to
  // register in the database along with user's infos.
  // If the user is authentified return the authorization code,
  // else return false.

  return new Promise( (resolve, reject) => {
    if (!username || !password || 
      username === '' || password === '') {
        return resolve(false)
      }

    const client = createLDAPClient()

    client.on('error', (err) => {
      return reject(err)
    })

    client.on('connectTimeout', (err) => {
      return reject(err)
    })

    client.bind(username + '@isim.intra', password, async (err) => {
      if (err) {
        if (err instanceof ldap.InvalidCredentialsError) {
          return resolve(false)
        }

        return reject(err)
      }

      // TODO: Get additionnals infos about the authentified user
      // such as is firstname, lastname, role and section

      const authorizationCode = uuid.v4()
      const sql = `
        INSERT INTO authorization_code (code, first_name)
        VALUES ($1, $2)
      `

      await db.query(sql, [authorizationCode, username])
        .catch(ex => reject(ex))

      return resolve(authorizationCode)
    })
  })
}

exports.generateToken = async (clientId, authorizedRow) => {
  // Create a JWT access_token containing user infos.

  const {
    code, firstname, lastname, section, role
  } = authorizedRow

  var accessSignOptions = {
    issuer: clientId,
    audience: `${firstname} ${lastname}`,
    algorithm: 'RS256',
    expiresIN: 10 * 60
  }

  // const accessToken = jwt.sign()

  return {
    accessToken: '',
    refreshToken: ''
  }
}

exports.refreshToken = async (clientId, refreshToken) => {
  return {
    accessToken: '',
    refreshToken: ''
  }
}
