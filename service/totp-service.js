const { totp } = require('otplib');

totp.options = { digits: 6, step:300, window:0 }

const generateTOTP = (secret) => {
    totp.options = { epoch: Date.now() }
    return totp.generate(secret)
}

const verifyTOTP = (token, secret) => {
    totp.options = { epoch : Date.now() }
    return totp.verify({ token, secret })
}

module.exports = {
    generateTOTP,
    verifyTOTP
}