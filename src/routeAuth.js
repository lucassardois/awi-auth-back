const auth = require('./actionAuth')

exports.authorize = async (req, res) => {
  const clientIdExists =
    await auth.clientIdExists(clientId)

  if (!clientIdExists) {
    // Error
    return
  }

  // Simply redirect the request to the front.
}

exports.auth = async (req, res) => {
  const valid = await auth.auth(username, password)
  if (!valid) {
    // Failed to auth, error
    return
  }

  // Notify the front that the authentication
  // succeeded and return the authorizationCode,
  // see with Alia
  const authorizationCode = valid
}

exports.token = async (req, res) => {
  const clientIdExists =
    await auth.clientIdExists(clientId)

  if (!clientIdExists) {
    // Error
    return
  }

  return await auth.generateToken(clientId, authorizationCode)
}

exports.refresh = async (req, res) => {
  const clientIdExists =
    await auth.clientIdExists(clientId)

  if (!clientIdExists) {
    // Error
    return
  }

  return await auth.refreshToken(clientId, refreshToken)
}