// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBHcHoPE_JiJ2nHI-m7rMIAEnd_ghWmngg",
  authDomain: "mal-profiles-about-me-expand.firebaseapp.com",
  projectId: "mal-profiles-about-me-expand",
  storageBucket: "mal-profiles-about-me-expand.firebasestorage.app",
  messagingSenderId: "254550027669",
  appId: "1:254550027669:web:bd160fa153ff0408bf5a9c",
  measurementId: "G-PPC30W29RX"
};


// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase
const analytics = getAnalytics(app);

// Khởi tạo các dịch vụ
const db = getFirestore(app);
const auth = getAuth(app);

// Xuất ra để các file khác có thể sử dụng
export { db, auth };