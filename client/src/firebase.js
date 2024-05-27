// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-32a7a.firebaseapp.com",
  projectId: "mern-blog-32a7a",
  storageBucket: "mern-blog-32a7a.appspot.com",
  messagingSenderId: "171701957234",
  appId: "1:171701957234:web:8961603c53cee5f11648eb"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);