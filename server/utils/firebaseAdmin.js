const admin = require("firebase-admin");
const serviceAccount =
  process.env.NODE_ENV === "production"
    ? require("/etc/secrets/vatchit-544f1-firebase-adminsdk-fbsvc-793eb70047.json")
    : require("../config/vatchit-544f1-firebase-adminsdk-fbsvc-793eb70047.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
