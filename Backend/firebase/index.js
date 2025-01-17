var admin = require("firebase-admin");

var serviceAccount = require("../config/duantotnghiep2025-8a6f4-firebase-adminsdk-x3cs2-01923df3b3.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
module.exports = admin;
