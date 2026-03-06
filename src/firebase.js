// firebase-messaging.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCmExZLlpyDs0IBICIcOiAOccjnX0Ololo",
  authDomain: "tryon-308c9.firebaseapp.com",
  projectId: "tryon-308c9",
  storageBucket: "tryon-308c9.firebasestorage.app",
  messagingSenderId: "998228351886",
  appId: "1:998228351886:web:27a9c2568077ff2b2522df",
  measurementId: "G-EDFHNX6DK6"
};



const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export async function setupNotifications() {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Notification permission not granted");
  }

  const token = await getToken(messaging, {
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
  });

  console.log("FCM token:", token);
  return token;
}


export function notificationMessageListener() {
  const messaging = getMessaging();
  
  const unsubscribe = onMessage(messaging, (payload) => {
    console.log("Message received:", payload);

    if (Notification.permission === "granted") {
      const title = payload.notification?.title || "New notification";
      const options = {
        body: payload.notification?.body || "",
        icon: payload.notification.icon || "",
        badge: payload.notification?.badge || "",
        image: payload.notification?.image || "",
      };

      const notification = new Notification(title, options);

      notification.onclick = () => {
        window.open(payload.fcmOptions?.link || "/", "_blank");
      };
    }
  });
  return unsubscribe;
}
