import { messaging, getToken } from "../firebase";

const grantNotificationPermissionAndGenerateFcmToken = async () => {
  try {
    const registration = await navigator.serviceWorker.ready;
    if (registration) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const token = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_PUBLIC_VAPID_KEY,
          serviceWorkerRegistration: registration,
        });
        return token;
      } else {
        alert("Notification Permission Denied");
        return;
      }
    }
  } catch (err) {
    console.error("Error getting permission or token:", err);
  }
};

export default grantNotificationPermissionAndGenerateFcmToken;
