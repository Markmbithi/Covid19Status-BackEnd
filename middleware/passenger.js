const Joi = require('joi');
const validatePhoneJoi = Joi.extend(require('joi-phone-number'));
const { passengerExists, insertSecret } = require('../controllers/passenger')

const passengerSchema = Joi.object({
    passportNumber: Joi.string().regex(/^[A-Z]{2}[0-9]{7}$/).required(),
    phoneNumber: validatePhoneJoi.string().phoneNumber().required()   
  });

const checkSentDetails = async (req, res, next) => {

  const passengerDetails = {
    passportNumber: req.body.passportNumber,
    phoneNumber: req.body.phoneNumber
  }

  try {
    const value = await passengerSchema.validateAsync(passengerDetails);
    if(value) next()
  }
  catch (err) { 
    res.status(400).send({error: err.details[0].message});
    return
  }  
}

const checkPassengerExists = async (req, res, next) => {
  /** Every successful passenger login we have we should create a new secret and store it in db alongside phone number of passenger who 
   *  exists secret. We store secret and phone number of the person loging in. If phone number exists we just update the new secret
   *  When authenticating code we find secret by phone number and authenticate code. If phone number exists
   */ 
  const passportNumber = req.body.passportNumber
    
  try {
   
    await passengerExists(passportNumber)
    next()
    
  } catch(error) {
      res.status(400).send(error);
      return
  } 
}

const createLoginSecret = async (req, res, next) => {

  const phoneNumber = req.body.phoneNumber
  try {
   
    await insertSecret({phoneNumber: phoneNumber})
    next()
  } catch(error) {
      res.status(400).send(error);
      return
  }
}
module.exports = {
  checkSentDetails,
  checkPassengerExists,
  createLoginSecret
}