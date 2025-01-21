var admin = require("firebase-admin");

var serviceAccount = require("../config/website-rivera-firebase-adminsdk-593y8-28e521f875.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
