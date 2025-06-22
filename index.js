// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBF6C85P7K-kqPmc5KrxK0X1wrIAxzbV-M",
  authDomain: "pk-card-website.firebaseapp.com",
  projectId: "pk-card-website",
  storageBucket: "pk-card-website.firebasestorage.app",
  messagingSenderId: "1099269510878",
  appId: "1:1099269510878:web:71db82bd0b05fe8db1144f",
  measurementId: "G-RB485D0NT9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);