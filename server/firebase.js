// Import the functions you need from the SDKs you need
const { initializeApp } =require ("firebase/app");
const { getFirestore } =require ("firebase/firestore");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBk15BdqDx2zGxqV-mjlaUlG5pPxhZ57f0",
  authDomain: "lab08app-6d73c.firebaseapp.com",
  projectId: "lab08app-6d73c",
  storageBucket: "lab08app-6d73c.firebasestorage.app",
  messagingSenderId: "1017746194161",
  appId: "1:1017746194161:web:31173edd22bc0de4ddf350",
  measurementId: "G-XFX1DGZ3RT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = { db }