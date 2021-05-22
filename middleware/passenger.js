const Joi = require('joi');
const validatePhoneJoi = Joi.extend(require('joi-phone-number'));
const { passengerExists } = require('../controllers/passenger')

const passengerSchema = Joi.object().keys({
    passportNumber: Joi.string().regex(/^[A-Za-z]+[0-9]$/).required()
  });

const verifyPhoneNumber = (phoneNumber) => {
  return validatePhoneJoi.string().phoneNumber().validate(phoneNumber);
} 

const checkSentDetails = (req, res, next) => {

  Joi.validate(req.body.passportNumber, passengerSchema, (err, value) => {
    
    const validPhone = verifyPhoneNumber(req.body.phoneNumber)

    if (!err && !validPhone) {
      
      res.status(400).send({message: 'Invalid Phone number or Passport Number'});
      next('route')      
    }

    req.passportNumber=passportNumber
    req.phoneNumber=phoneNumber
    
    next()

  });
  
}

const checkPassengerExists = async (req, res, next) => {

  const passportNumber = req.passportNumber
  
  try {
    const { exists, error } = await passengerExists(passportNumber)

    if(!exists && error) {
      res.status(400).send({ message: 'Passenger does not exist' });
      next('route') 
    }

    next()
  } catch(error) {
      res.status(400).send({ message: 'Problem please try later' });
  } 
}

module.exports = {
  checkSentDetails,
  checkPassengerExists
}