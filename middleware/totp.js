const { verifyTOTP, generateTOTP } = require('../service/totp-service')

const verify_TOTP = (req, res, next) => {

    const token = req.body.token;

    const tokenValid = verifyTOTP(token)
    
    if(!tokenValid) {
        res.status(422).send({ message: 'Please enter token sent to SMS' });
        next('route')
    }

    next()    
}

const generate_TOTP = (req, res, next) => {

    try {
        const totp = generateTOTP()
        req.totp = totp

        next()
    } catch(error) {
        res.status(400).send({ message: 'Problem please try later' });
        next('route') 
    }
    
}

module.exports = {
    verify_TOTP,
    generate_TOTP
}