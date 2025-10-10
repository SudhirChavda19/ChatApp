import React, { useEffect, useState } from "react";
import AllRoutes from "./routes/AllRoutes";
import { messaging, getToken, onMessage } from "./firebase";
import Notification from "./components/common/Notification";

function App() {
  const [notification, setNotification] = useState(null);

  const showOSNotification = ({ title, body, icon, onClick }) => {
    if (Notification.permission === "granted") {
      const notification = new window.Notification(title, {
        body,
        icon,
        badge: icon, // optional
      });
      if (onClick) {
        notification.onclick = onClick;
      }
    }
  };

  useEffect(() => {
  //   // if ("serviceWorker" in navigator) {
  //   //   navigator.serviceWorker
  //   //     .register("/firebase-messaging-sw.js")
  //   //     .then((registration) => {
  //   //       console.log("Service Worker registered:", registration);
  //   //     })
  //   //     .catch((err) => {
  //   //       console.error("Service Worker registration failed:", err);
  //   //     });
  //   // }
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then(function (registration) {
          console.log("Service worker registration successful", registration);
        })
        .catch(function (error) {
          console.log("Service worker registration failed", error);
        });
    }
  }, []);

  useEffect(() => {
    if (window.Notification.permission !== "granted") {
      window.Notification.requestPermission();
    }

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Message received: ", payload);

      // Customize notification data
      setNotification({
        title: payload.notification?.title || "New Message",
        body: payload.notification?.body || "",
      });

      showOSNotification({
        title: payload.notification?.title || "New Message",
        body: payload.notification?.body || "",
        icon: "/vatchit.svg",
        onClick: () => window.focus(), // focus your tab
      });

      // Auto-hide after 5 seconds
      // setTimeout(() => setNotification(null), 5000);
    });

    return () => unsubscribe(); // cleanup
  }, []);

  return (
    <React.Fragment>
      <AllRoutes />

      {notification && (
        <Notification
          title={notification.title}
          message={notification.body}
          onClose={() => setNotification(null)}
        />
      )}
    </React.Fragment>
  );
}

export default App;
