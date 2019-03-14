# Firebase Cloud Functions

# Firebase & GCloud Setup in local machine

```sh
$ npm install firebase-functions@latest firebase-admin@latest --save
$ npm install -g firebase-tools

```

- Log in to Firebase Command-Line interface.

```sh
$ firebase login
$ firebase use --add (Select your project and alias)
$ firebase deploy --only functions
OR
$ firebase deploy --only functions:temp(FUNCTION_NAME)
```

- Install Google Cloud SDK

Using the Google Cloud SDK installer: https://cloud.google.com/sdk/docs/downloads-interactive

```sh
$ curl https://sdk.cloud.google.com | bash
$ exec -l $SHELL
$ gcloud init

- Open new window in terminal and check PATH
$ echo $PATH
$ gcloud
```

- Deploy functions using gcloud

```sh
$ gcloud functions deploy helloGET(FUNCTION_NAME) --trigger-http
```

- Test the functions

```sh
$ gcloud functions describe helloGET
URL in browser
$ https://us-central1-temp-69ba5.cloudfunctions.net/helloGET
```

OR

Download GC SDK from https://cloud.google.com/sdk/docs/

```sh
Extract the google-cloud-sdk
$ unzip google-cloud-sdk
$ ./google-cloud-sdk/install.sh
$ ./google-cloud-sdk/bin/gcloud init
```

# Run / Deploy Firebase Gcloud Functions

```sh

$ firebase deploy --only functions
$ gcloud pubsub topics publish every-min  --message="Hello Cron..."
$ firebase functions:log --project PROJECT_ID 

Deploy cron
$ gcloud app deploy
$ gcloud app deploy cron.yaml

You can stream logs from the command line by running:
$ gcloud app logs tail -s default

To view your application in the web browser run:
$ gcloud app browse

Visit the Cloud Platform Console Task Queues page to view your queues and cron jobs.
- https://console.cloud.google.com/appengine/taskqueues/cron?project=PROJECT_ID

```

# Firebase Cloud Messaging

```sh

Get the fcm server key from following link:
$ https://console.firebase.google.com/u/0/project/PROJECT_ID/settings/cloudmessaging/PROJECT_ID_IOS
OR
$ Open firebase console.
$ Go inside your project created.
$ Home > Project Overview > Cloud Messaging > Server Key.
$ Add server key in root .env file.

```

# Add the Firebase Admin SDK to Your Server for Build app server send requests

```sh

Get the service account json from following link:
https://console.firebase.google.com/u/0/project/PROJECT_ID/settings/serviceaccounts/adminsdk
OR
$ Open firebase console.
$ Go inside your project created.
$ Home > Project Overview > Service accounts > Generate new private key. 
$ Place this json file securly in your machine, and provide json file path in root .env file.

```

### Function URL (addMessage): 
- https://us-central1-MY_PROJECT.cloudfunctions.net/temp(FUNCTION_NAME)

### References
- https://cloud.google.com/functions/docs/quickstart
- https://cloud.google.com/sdk/docs/
- https://cloud.google.com/appengine/docs/flexible/nodejs/scheduling-jobs-with-cron-yaml
- https://medium.com/google-cloud/google-cloud-functions-scheduling-cron-5657c2ae5212
- https://firebase.google.com/docs/cloud-messaging/
- https://firebase.google.com/docs/cloud-messaging/send-message