import React, { useEffect, useState } from "react";
import AllRoutes from "./routes/AllRoutes";
import { messaging, onMessage } from "./firebase";
import Notification from "./components/common/Notification";
import notificationSound from "./assets/notification.mp3";

function App() {
  const [notification, setNotification] = useState(null);

  // const showOSNotification = ({ title, body, icon, onClick }) => {
  //   if (Notification.permission === "granted") {
  //     const notification = new window.Notification(`${title} • VatChit`, {
  //       body,
  //       icon: "/vatchit.svg",
  //       // badge: icon, // optional
  //     });
  //     if (onClick) {
  //       notification.onclick = onClick;
  //     }
  //   }
  // };

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js", { type: "module" })
        .then(function (registration) {
          registration.update();
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
      // console.log("Message received: ", payload);
      const sound = new Audio(notificationSound);
          sound.play();

      // Customize notification data
      if (document.visibilityState === "visible") {
        setNotification({
          title: payload.notification?.title || "New Message",
          body: payload.notification?.body || undefined,
          gifUrl: payload?.data?.gifUrl ? payload.data.gifUrl : undefined,
          show: true
        });
      }
      // else {
      //   showOSNotification({
      //     title: payload.notification?.title || "New Message",
      //     body: payload.notification?.body || "",
      //     onClick: () => window.focus(), // focus your tab
      //   });
      // }

      setTimeout(() => setNotification({show: false}), 4000);
    });

    return () => unsubscribe();
  }, []);

  return (
    <React.Fragment>
      <AllRoutes />

      {notification && (
        <Notification
          title={notification.title}
          message={notification.body}
          gifUrl={notification.gifUrl}
          showNotification={notification.show}
          onClose={() => setNotification(null)}
        />
      )}
    </React.Fragment>
  );
}

export default App;
