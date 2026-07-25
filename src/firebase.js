// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD703rY_FHyoyk1-d7o69zEO75PivkFA3g",
  authDomain: "firstweb-26c8f.firebaseapp.com",
  projectId: "firstweb-26c8f",
  storageBucket: "firstweb-26c8f.firebasestorage.app",
  messagingSenderId: "589586412604",
  appId: "1:589586412604:web:0de961af984651ae2b7f39",
  measurementId: "G-WW41QMMVX4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);