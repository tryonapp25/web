import { Badge } from "lucide-react";

importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCmExZLlpyDs0IBICIcOiAOccjnX0Ololo",
  authDomain: "tryon-308c9.firebaseapp.com",
  projectId: "tryon-308c9",
  storageBucket: "tryon-308c9.firebasestorage.app",
  messagingSenderId: "998228351886",
  appId: "1:998228351886:web:27a9c2568077ff2b2522df",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification?.title || "New message";
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: payload.notification.icon || "",
    badge: payload.notification?.badge || "",
    image: payload.notification?.image || "",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification?.data?.link || "/";

  event.waitUntil(clients.openWindow(url));
});