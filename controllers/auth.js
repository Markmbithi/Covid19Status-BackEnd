var express = require ('express');
var router = express.Router();
var validator = require('validator');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var config = require('../config/config');
var passenger = require('./passenger');
var smsService = require('../service/sms-service');
var otpService = require('../service/generate-otp');

router.use(bodyParser.urlencoded({extended:false}))
router.use(bodyParser.json)

const validatePassengerForm = (payload) => {
    const errors = {};
    let isFormValid = true;
    let message = '';
  
    if(!payload || payload.phoneNumber == '' || typeof payload.phoneNumber !== 'string' || !validator.isMobilePhone(payload.phoneNumber)) {
      isFormValid = false;
      errors.phoneNumber = 'Please provide a correct phone number.';
    }
  
    if (!payload || payload.passportNumber == '' || !validator.isPassportNumber(payload.passportNumber) ) {
      isFormValid = false;
      errors.password = 'Please provide a valid passport number.';
    }
  
    if (!isFormValid) {
      message = 'Check form for errors.';
    }
  
    return {
      success: isFormValid,
      message,
      errors
    };
  }

  // This will validate Phone number, Passport Number and OTP so that user can log in
  const validateOTP = (payload) => {
    const errors = {};
    let isFormValid = true;
    let message = '';

    if (!payload || payload.otpNumber == '' || typeof payload.otpNumber !== 'string' ) {
      isFormValid = false;
      errors.otp = 'Please enter the OTP.';
    }
  
    if (!isFormValid) {
      message = 'Check form for errors.';
    }
  
    return {
      success: isFormValid,
      message,
      errors
    };
  }

// Access token method

const verifyToken = (req, res, next) => {
  const authHeader = req.header.authorization;
    
    if(authHeader) {
        const token = authHeader.split(' ')[1];
        
        jwt.verify(token, config.secret, (err, decoded) => {
            if(err) {
                res.status(500).send({auth:false, message:'Failed to authenticagte token'});
            }

            res.status(200).send(decoded);

            next()
        });

    }
    else {
        res.status(401).send({auth:false, message: 'No token provided'})
    }
};

// Get details from the passenger and authenticate
router.get('/getresults', verifyToken, (req, res) => {
    res.send({message:'You can now access your results'})
})

// Check if passenger typed in the correct OTP sent to their phone
router.post('/validateOTP', async (req, res) => {

    // Validate the OTP sent
    const validationOTP =  validateOTP(req.body);
  
    if (!validationOTP.success) {
        return res.status(400).json({
        success: false,
        message: validationOTP.message,
        errors: validationOTP.errors
        });
    }

     // Validate the Passenger details
     const validationPassenger =  validatePassengerForm(req.body);
  
     if (!validationPassenger.success) {
         return res.status(400).json({
         success: false,
         message: validationPassenger.message,
         errors: validationPassenger.errors
         });
     }

    else {

        var otpNumber = req.body.otpNumber
        var phoneNumber = req.body.phoneNumber
        var passportNumber = req.body.passportNumber

        var tokenValid = otpService.verify(otpNumber, config.secret)

        // If token is valid we can send back a signed token
        if(tokenValid) {

          // Get full user details from DB and create a fully signed token
          var result = passenger.getPassenger(passportNumber)
          
          // Create a signed JWT token and send back to client for future access
          var token = jwt.sign({ id: result[0].id, firstName: result[0].firstName, secondName: result[0].secondName, phoneNumber: result[0].phoneNumber }, config.secret, {});
          
          res.send({"validToken":true, "token": token});
        }
        // Token is invalid. Probably expired and user may need to generate a new token
        else {
          res.send({"validToken":false, "token": null});
        }
    }
        
})

// login the passenger through passport and phone_number 
router.post('/login', (req, res) => {

    // Validate inputs
    const validationResult =  validatePassengerForm(req.body);
  
    if (!validationResult.success) {
        return res.status(400).json({
        success: false,
        message: validationResult.message,
        errors: validationResult.errors
        });
    }
    else {

      var phoneNumber = req.body.phoneNumber
      var passportNumber = req.body.passportNumber
      
      // Proceed with auth to check if the details are correct
      var exists = await passenger.passengerExists(phoneNumber, passportNumber)

      // After login we will send a signed token
      if(exists) {

        // Generate TOTP for 2 factor authentication
        var token = otpService.generateToken(config.secret)
        
        // Send the token through an SMS service
        smsService.sendToken(phoneNumber, token)
        
        res.send({tokenSent:true, message:"Please enter token sent to your phone"})
      }
      else {
        res.send({tokenSent:false, message:"Please login again"})
      }

    }
    
})

// Regenerate token 
router.post('/regenerateToken', (req, res) => {

  // Validate inputs
  const validationResult =  validatePassengerForm(req.body);

  if (!validationResult.success) {
      return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
      });
  }
  else {

    var phoneNumber = req.body.phoneNumber
    var passportNumber = req.body.passportNumber
    
    // Proceed with auth to check if the details are correct
    var exists = await passenger.passengerExists(phoneNumber, passportNumber)

    // After login we will send a signed token
    if(exists) {

      // Generate TOTP for 2 factor authentication
      var token = otpService.generateToken(config.secret)
      
      // Send the token through an SMS service
      await smsService.sendToken(phoneNumber, token)

      res.send({tokenSent:true, message:"Please enter token sent to your phone"})
    }
    else {
      res.send({tokenSent:false, message:"Please login again"})
    }
  }  
})

module.exports=router;

