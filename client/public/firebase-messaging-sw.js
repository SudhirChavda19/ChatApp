/* eslint-disable no-undef */
// import { initializeApp } from '../node_modules/firebase/app/dist/app/index';
// import { getMessaging } from '../node_modules/firebase/messaging/dist/messaging/index';
// import { onBackgroundMessage } from '../node_modules/firebase/messaging/sw/dist/messaging/sw/index';

/* eslint-disable no-undef */
// import { initializeApp } from "firebase/app";
// import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getMessaging, onBackgroundMessage } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-messaging-sw.js";

const app = initializeApp({
  apiKey: "AIzaSyAlMTSCurqKeadZnBH_RKOewMbX-j0pxjY",
  authDomain: "vatchit-544f1.firebaseapp.com",
  projectId: "vatchit-544f1",
  storageBucket: "vatchit-544f1.firebasestorage.app",
  messagingSenderId: "819680974685",
  appId: "1:819680974685:web:db792853fdd709c2387ab4",
  measurementId: "G-J9QEETKB2Y",
});

const messaging = getMessaging(app);

onBackgroundMessage(messaging, (payload) => {
  const notificationTitle = `${payload.notification.title} • VatChit`;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/vatchit.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
