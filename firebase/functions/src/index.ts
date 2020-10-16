import * as functions from 'firebase-functions';

const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const secrets = require('./secrets');

admin.initializeApp();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'lukasrichters14@gmail.com',
      pass: secrets.password
    }
  });

exports.emailSender = functions.https.onRequest((req, res) =>
{
  const mailOptions =
    {
      from: 'lukasrichters14@gmail.com', // Adding sender's email
      to: req.query.dest, // Getting recipient's email by query string
      subject: 'Email Sent via Firebase', // Email subject
      html: '<b>Sending emails with Firebase is easy!</b>' // Email content in HTML
    };

  return transporter.sendMail(mailOptions, (err: any, info: any) =>
  {
    if (err)
    {
      return res.send(err.toString());
    }
    return res.send('Email sent succesfully');
  });
});
