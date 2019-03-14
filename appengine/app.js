require('dotenv').config();

const express = require('express');
const PubSub = require('@google-cloud/pubsub');
const FCM = require('fcm-push');
const _ = require('lodash');
const cors = require('cors');
// const nodemailer = require('nodemailer');
const moment = require('moment-timezone');
const functions = require('firebase-functions');
const admin = require('firebase-admin');

// var serviceAccount = require(process.env.ServiceAccount);

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

admin.initializeApp(functions.config().firebase);

var db = admin.firestore();

const app = express();
// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

const fcm = new FCM(process.env.ServerKey);

// Create a new PubSub client using the GOOGLE_CLOUD_PROJECT
// environment variable. This is automatically set to the correct
// value when running on AppEngine.
const pubsubClient = new PubSub({
  projectId: process.env.GOOGLE_CLOUD_PROJECT
  // projectId: 'temp-69ba5'
});

// For any request to /public/{some_topic}, push a simple
// PubSub message to that topic.
app.get('/publish/:topic', async (req, res) => {
  const topic = req.params['topic'];
  try {
    await pubsubClient.topic(topic).publisher().publish(Buffer.from('pubsubClient Published.'));
    var userRef = db.collection('users');
    userRef.where('data', '==', new Date()).get()
    userRef.get().then(data => {
      if (data.empty) {
        console.log('No matching documents.');
        return;
      }
      let registrationIds = [];
      data.docs.forEach((userDoc) => {
        const user = userDoc.data();
        console.log(`-*- User: ${JSON.stringify(user)}`);
        let currentTimeTZ = '';
        let currentTimeUTC = '';
        let dailyAtUTCTime = '';
        let dailyAtTZTime = '';
        if (user.dailyAt && typeof user.dailyAt === "string") {
          if (user.timezone) {
            currentTimeTZ = moment().tz(user.timezone).format('hh:mm');
            console.log(`Current Timezone Time: ${currentTimeTZ}`);
            // Get UTC date string from firestore
            const tempDateString = `${user.dailyAt} UTC`;
            dailyAtTZTime = moment(new Date(tempDateString)).tz(user.timezone).format("hh:mm"); // Assume this is always UTC     
            console.log(`User Daily At: ${dailyAtTZTime} -*- Timezone`);
          } else {
            currentTimeUTC = moment().utc().format('hh:mm');
            console.log(`Current UTC Time: ${currentTimeUTC}`);
            dailyAtUTCTime = moment(user.dailyAt).format('hh:mm');
            console.log(`User Daily At: ${dailyAtTZTime} -*- UTC`);
          }
        } else if (user.dailyAt && typeof user.dailyAt === "object") {
          currentTimeUTC = moment().utc().format('hh:mm');
          console.log(`Current UTC Time: ${currentTimeUTC}`);
          console.log(moment.utc(user.dailyAt.toDate()));
          dailyAtUTCTime = moment(user.dailyAt.toDate()).format('hh:mm'); // Assume this is always UTC
          console.log(`User Daily At: ${dailyAtUTCTime} -*- Always UTC`);
        }
        // currentTimeUTC === dailyAtUTCTime && 
        if (user.isNotificationEnable && user.deviceToken && 
          (user.timezone ? ((currentTimeTZ === dailyAtTZTime) && (currentTimeUTC === dailyAtUTCTime)) : (currentTimeUTC === dailyAtUTCTime) )) {
            console.log('-*- Inside push device token -*-')
          registrationIds.push(user.deviceToken);
          registrationIds = _.uniq(registrationIds);
        }
      });
      console.log(`Registration ID#: ${JSON.stringify(registrationIds)}`);
      if (registrationIds && registrationIds.length > 0) {
        const message = {
          registration_ids: registrationIds, // needed in FCM
          'mutable-content': 1,
          notification: { // Send notification or data
            title: 'Temp',
            body: 'Temp notification!',
            'mutable-content': 1,
          }
        };
        fcm.send(message).then((response) => {
          console.log('Successfully sent with response: ', response);
        }).catch((err) => {
          console.log('Something has gone wrong!');
          console.log(err);
        });
        // Send a message to the devices corresponding to the provided
        // registration tokens.
        // admin.messaging().sendToDevice(registrationIds, message)
        //   .then(function (response) {
        //     // See the MessagingDevicesResponse reference documentation for
        //     // the contents of response.
        //     console.log('Successfully sent message:', response);
        //   }).catch(function (error) {
        //     console.log('Error sending message:', error);
        //   });        
      }
      console.log(`Cloud inside pubsubClient appengine: ${topic}`);
      res.status(200).send('Published to ' + topic).end();
    }).catch(err => {
      console.log('Error getting documents', err);
    });
  } catch (e) {
    res.status(500).send('' + e).end();
  }
});

// Index page, just to make it easy to see if the app is working.
app.get('/', (req, res) => {
  res.status(200).send('[functions-cron]: Hello, world!').end();
});

// Start the server
const PORT = process.env.PORT || 6060;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});