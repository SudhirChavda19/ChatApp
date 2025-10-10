const admin = require("firebase-admin");
const serviceAccount = require("../config/vatchit-544f1-firebase-adminsdk-fbsvc-793eb70047.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
