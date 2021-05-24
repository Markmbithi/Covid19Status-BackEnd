const jwt = require('jsonwebtoken');
const { secret } = require('../config');
const { getPassengerDetails } = require('../controllers/passenger')

const verifyJwtToken = (req, res, next) => {

    console.log("headers:"+req.headers)
    
    const authHeader = req.headers.authorization;
    
    if(!authHeader) {
        res.status(400).send({message: 'No token provided'})
    }

    const token = authHeader.split(' ')[1];
        
    jwt.verify(token, secret, (err, decoded) => {
        if(err) {
            res.status(400).send(err);
        }
        next()
    });
}

const generateJwtToken = async (req, res, next) => {

    const passportNumber = req.body.passportNumber
    
    try {
        const passportDetails = await getPassengerDetails(passportNumber) 
        const token = jwt.sign({ id: passportDetails.Id, firstName: passportDetails.firstName, secondName: passportDetails.secondName, phoneNumber: passportDetails.phoneNumber }, secret, {});
        req.token = token
        next()
    } catch(error) {
        res.status(400).send({ error:error, message:'Problem please try later' });        
    }
    
}

module.exports = {
    verifyJwtToken,
    generateJwtToken
}