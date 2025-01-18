var admin = require("firebase-admin");

var serviceAccount = require("../config/website-rivera-firebase-adminsdk-593y8-28e521f875.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
module.exports = admin;

// var admin = require("firebase-admin");

// var serviceAccount = require("path/to/serviceAccountKey.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });
