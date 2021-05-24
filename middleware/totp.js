const crypto = require('crypto');
const { verifyTOTP, generateTOTP } = require('../service/totp-service')
const { getPassengerSecret, insertSecret } = require('../controllers/passenger')

const verify_TOTP = async (req, res, next) => {
    
    try {

        const { phoneNumber, totp } = req.body
        
        const passenger = await getPassengerSecret({ phoneNumber: phoneNumber })
            const secret = passenger.secret
                
            const codeValid = verifyTOTP(totp, secret)

            if(!codeValid) {
                res.status(422).send({ message: 'Please enter valid code sent to your phone' });
                return
            }
            next()

    } catch(error) {
        res.status(400).send(error);
        return 
    }

}

const generate_TOTP = async (req, res, next) => {

    try {

        const secret = crypto.randomBytes(64).toString('hex');
        const { phoneNumber } = req.body;
        
        await insertSecret({phoneNumber, secret});
       
        const totp = generateTOTP(secret)
        req.totp = totp
        next()            

    } catch(error) {
        res.status(400).send({ message: 'Problem please try later' });
        return 
    }
    
}

module.exports = {
    verify_TOTP,
    generate_TOTP
}