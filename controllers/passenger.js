const { poolCovidPromise, sql } = require('../db');
const logger = require('../logger');
const crypto = require('crypto');

const getPassengers = () => {

    return new Promise(async (resolve,reject) => {
        try {
          const pool = await poolCovidPromise;
          const { recordset } = await pool.request().query(`select * from passengers`);          
          resolve(recordset);
        } catch(err) {
          logger.error(`db.getPassengerDetails() Error: ${err}`);
          reject(err);
        }
      });

}

const getPassengerDetails = (passportNumber) => {

    return new Promise(async (resolve, reject) => {
        try {
            const pool = await poolCovidPromise;
            const { recordset } = await pool.request().input('passportNumber', sql.NVarChar, passportNumber).query(`select * from passengers where passportNumber = @passportNumber`)
            resolve({ id: recordset[0].Id, firstName: recordset[0].firstName, secondName: recordset[0].secondName, phoneNumber: recordset[0].phoneNumber });
        } catch(err) {
            logger.error(`db.getPassengerDetails() Error: ${err}`);
            reject(err);
        }
    });

}

const passengerExists = async (passportNumber) => {

    return new Promise(async (resolve,reject) => {
        
        try {
            const pool = await poolCovidPromise;
            const { recordset } = await pool.request().input('passportNumber', sql.NVarChar, passportNumber)
            .query('select * from passengers where passportNumber = @passportNumber')
            
            if(!recordset.length) reject({ err:'Passenger does not exist' })
          
            resolve({ exists:true });
        } catch(err) {
            logger.error(`db.passengerExists() Error: ${err}`);
            reject(err);
        }

    });

}

const getPassengerSecret = (passenger) => {
    return new Promise(async (resolve,reject) => {
      try {
        const pool = await poolCovidPromise;
        const { recordset } = await pool.request()
          .input('phoneNumber',sql.NVarChar, passenger.phoneNumber)
          .query('select * from logininfo where phoneNumber = @phoneNumber')
            
            if(!recordset.length) reject({ err:'Please login again' })
            logger.info(`db.logininfo.getPassengerSecret(): success `);
            resolve({secret: recordset[0].secret});

      } catch(err) {
        logger.error(`db.logininfo.insertSecret(): Error: ${err}`);
        reject(err);
      }
    });
  };

const insertSecret = (passenger) => {
    return new Promise(async (resolve,reject) => {
      try {
        const pool = await poolCovidPromise;
        const result = await pool.request()
          .input('phoneNumber',sql.NVarChar, passenger.phoneNumber)
          .input('secret',sql.NVarChar, passenger.secret)
          .query(
            `if not exists (select * from logininfo where phoneNumber = @phoneNumber)
                insert into logininfo (
                phoneNumber, 
                secret
              ) values (
                @phoneNumber, 
                @secret
              ) 
            else
            update logininfo
            set 
              phoneNumber = @phoneNumber,
              secret = @secret
            where phoneNumber = @phoneNumber
            `
          );
        logger.info(`db.logininfo.insertSecret(): success `);
        resolve(result);
      } catch(err) {
        logger.error(`db.logininfo.insertSecret(): Error: ${err}`);
        reject(err);
      }
    });
  };

module.exports = {
    passengerExists,
    getPassengers,
    getPassengerDetails,
    insertSecret,
    getPassengerSecret  
}