// firebase-messaging.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
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
