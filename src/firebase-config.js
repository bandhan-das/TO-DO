// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDgGSAfYZJFEwd5oKCSRmmCy1wV9W2A4sY",
  authDomain: "my-todo-app-19b4b.firebaseapp.com",
  projectId: "my-todo-app-19b4b",
  storageBucket: "my-todo-app-19b4b.appspot.com",
  messagingSenderId: "374275133110",
  appId: "1:374275133110:web:a799bdf801b014a05f6017",
  measurementId: "G-LLS38XT8Y9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);