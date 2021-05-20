const firebase = require("firebase/app")
require("firebase/auth")
require("firebase/storage")

var admin = require("firebase-admin");

var serviceAccount = require("./teambudget-4a703-firebase-adminsdk-drgv5-60da8c0729.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://teambudget-4a703.appspot.com"
});

require('dotenv').config();


// Your web app's Firebase configuration
const app = firebase.initializeApp({
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL:process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
  });
  
 


  exports.auth = app.auth()
  
  exports.projectStorage = admin.storage().bucket();