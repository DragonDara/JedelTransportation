// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/7.14.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.14.2/firebase-messaging.js');
// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  apiKey: "AIzaSyAjX_XIGDgSXLcS66f7L9nBDM9sTMQd2NM",
  authDomain: "ng-complete-guide-8c51b.firebaseapp.com",
  databaseURL: "https://ng-complete-guide-8c51b.firebaseio.com",
  projectId: "ng-complete-guide-8c51b",
  storageBucket: "ng-complete-guide-8c51b.appspot.com",
  messagingSenderId: "464877494236",
  appId: "1:464877494236:web:6cbed860b9466b8aa5b919",
  measurementId: "G-4YNNXPF7N5"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();