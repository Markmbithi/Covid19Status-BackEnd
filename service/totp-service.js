const { totp } = require('otplib');
const { secret } = require('../config/config')

totp.options = { digits: 5, algorithm: "sha512", epoch: 0, step:300 }

const generateTOTP = () => totp.generate(secret)

const verifyTOTP = (token) => totp.verify({ token, secret })

module.exports = {
    generateTOTP,
    verifyTOTP
}