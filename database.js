// require the admin SDK.
const admin = require("firebase-admin");
// require the service account for the application.
const serviceAccount = require('./comida_database.json');

///////////////// FIREBASE ////////////////////
// init the firebase app with the credentials.
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://comida-97db1.firebaseio.com"
  });

// export the database.
exports.db = admin.firestore();
exports.auth = admin.auth();
exports.firestore = admin.firestore();