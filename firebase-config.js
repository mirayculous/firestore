// firebase-config.js

const firebaseConfig = {
    apiKey: "AIzaSyBvUoRjTUseb_LrP1gv8eAg9SRh58FvwaM",
    authDomain: "finance-tracker-68c20.firebaseapp.com",
    projectId: "finance-tracker-68c20",
    storageBucket: "finance-tracker-68c20.firebasestorage.app",
    messagingSenderId: "1050810724791",
    appId: "1:1050810724791:web:1da90bde89f702363bf832",
    measurementId: "G-1KN2J0BS5J"
  };
  
  // Initialize Firebase
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.app();
  }
  