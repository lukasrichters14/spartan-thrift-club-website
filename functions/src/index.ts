// This code adapted from: https://techtrench.org/firebase-functions-send-email/

"use strict";
import {Change, EventContext} from 'firebase-functions';
import { DataSnapshot } from 'firebase-functions/lib/providers/database';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

// Retrieve email credentials from firebase config
const gmailEmail = functions.config().gmail.login;
const gmailPassword = functions.config().gmail.pass;

// The alias will be used as the sending address.
const gmailAlias = 'noreply@spartanthrift.com';

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
        from: gmailAlias,
        to: email,
        subject: subject, // Subject line
        html: '<html lang="en">\n' +
          '<h1 style="text-align: center; background-color: #18453b; color: white; padding: 1rem">\n' +
          '    Spartan Thrift Club</h1>\n' +
          '<div style="margin: auto 3rem auto 3rem">\n' +
          '<p style="text-align: center; font-size: 1.3rem; margin-top: 4rem"> Thank you for signing up for\n' +
          '    email blasts from spartan thrift club! We\'ll be using these email blasts to communicate\n' +
          '    important events, meetings, and other club information to our members. If you want to always\n' +
          '    stay in contact, check out our\n' +
          '    <a href="https://discord.gg/8EnJfpg4FQ" target="_blank">Discord</a> server!</p>\n' +
          '<p style="text-align: center; font-size: 1.3rem">If you think this email was sent to you in error,\n' +
          '    or you no longer want to receive emails from us, click the unsubscribe link at the bottom of the\n' +
          '    page.</p>\n' +
          '\n' +
          '<p style="font-size: 1.3rem; margin-bottom: 0; margin-top: 5rem">Cheers,</p>\n' +
          '<p style="font-size: 1.3rem; margin-top: 0">Spartan Thrift Club</p>\n' +
          '\n' +
          '<p style="text-align: center; margin-top: 4rem; font-size: 0.8rem">Don\'t want to receive emails from\n' +
          '    us anymore? <a href="" target="_blank">Unsubscribe</a> from our email blasts.</p>\n' +
          '</div>\n' +
          '</html>' // html body
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

