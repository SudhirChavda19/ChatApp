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
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
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
