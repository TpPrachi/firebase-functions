exports.helloGET = (req, res) => {
  res.send('Hello User!');
};

let functions = require('firebase-functions');
let admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.every_min = functions.pubsub.topic('every-min').onPublish((message) => {
    console.log("This job is run every min!");
    if (message.data) {
      const dataString = Buffer.from(message.data, 'base64').toString();
      console.log(`Message Data: ${dataString}`);
    }
    return true;

  });