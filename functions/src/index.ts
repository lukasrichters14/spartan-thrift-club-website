// This code adapted from: https://techtrench.org/firebase-functions-send-email/

import {Change, EventContext} from 'firebase-functions';
import { DataSnapshot } from 'firebase-functions/lib/providers/database';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

// Retrieve email credentials from firebase config
const gmailEmail = functions.config().gmail.login;
const gmailPassword = functions.config().gmail.pass;

// The alias will be used as the sending address.
//const gmailAlias = 'noreply@spartanthrift.com';

admin.initializeApp();

function sendWelcomeEmail(name: string, email: string) {

    console.log('initializing welcome email.')
    // Initialize connection with email server
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: gmailEmail,
            pass: gmailPassword
        }
    });

    // Email content.
    const subject = 'Welcome to Spartan Thrift Club!'

    const mailOptions = {
        from: gmailEmail,
        to: email,
        subject: subject, // Subject line
        text: 'Hello World!' // plain text body
        //html: '!' // html body
    };

    // Callback function to return status to firebase console.
    const getDeliveryStatus = function (error: any, info: { messageId: any; }) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    };

    console.log('email init complete')

    // Send email and return status.
    transporter.sendMail(mailOptions, getDeliveryStatus);

    console.log('transporter fired, waiting for delivery status.')
}

// Watch for new entry to the email list.
exports.onDataAdded = functions.database.ref('/email-list')
  .onWrite((change:Change<DataSnapshot>, context:EventContext) => {
    // Get the newly created data.
    let newData: DataSnapshot = new DataSnapshot(null);
    let changeFound = false;
    // @ts-ignore
    change.after.forEach(snap1 =>{
      // @ts-ignore
      change.before.forEach(snap2 =>{
        console.log(`1: ${snap1.key}`);
        console.log(`2: ${snap2.key}`);
        if (snap1.key == snap2.key){
          changeFound = false;
          return true;
        }
        else{
          changeFound = true;
        }
      })
      if (changeFound){
        newData = snap1;
        return true;
      }
    })

    if (newData) {
      // Get name.
      let name = newData.val();
      console.log(`name: ${name}`);
      if (name != null) {
        // Format email. All '~' characters should be replaced with '.'
        let email = newData.key;
        let tempEmail = '';
        for (let i = 0; i < email.length; i++){
          if (email[i] == '~'){
            tempEmail += '.';
          }
          else{
            tempEmail += email[i];
          }
        }
        // Get email.
        email = tempEmail;
        console.log(`email: ${email}`);
        if (email != null) {
          // Send the welcome email.
          sendWelcomeEmail(name, email);
        }
      }
    }
    else {
      console.log('No data returned from database.')
    }
});

