const express = require ('express');
const router = express.Router();
const { smsTOTP } = require('../service/sms-service');
const { verifyJwtToken, generateJwtToken } = require('../middleware/jwt')
const { verify_TOTP, generate_TOTP } = require('../middleware/totp')
const { checkSentDetails, checkPassengerExists } = require('../middleware/passenger')

router.get('/viewresults', verifyJwtToken, (req, res) => {
    res.status(200).send({ message:'You can now access your results' });
})

router.post('/verifyOTP', checkSentDetails, checkPassengerExists, verify_TOTP, generateJwtToken, (req, res) => {
    
    const token = req.token
    res.status(200).send({ token: token });
        
})

router.post('/login', checkSentDetails, checkPassengerExists, generate_TOTP, async (req, res) => {

    const totp = req.totp
    const phoneNumber = req.phoneNumber

    try {
      await smsTOTP(phoneNumber, totp)
      res.status(200).send({ message:"Please enter token sent to your phone" })
    }
    catch(error) {
      res.status(400).send({ error: error})
    }
        
})

module.exports = router;