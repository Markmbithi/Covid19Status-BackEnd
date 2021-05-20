const { authenticator } = require('otplib');

// Responsible for generating tokens
module.exports.generateToken = (secret) => authenticator.generate(secret)

// Responsible for verifying tokens
module.exports.verify = (token, secret) => authenticator.verify({token, secret})
