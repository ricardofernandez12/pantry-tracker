// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDiwVPyawA9O5fC5WO_x1nf1F0nYrneFRw",
  authDomain: "pantry-tracker-73db3.firebaseapp.com",
  projectId: "pantry-tracker-73db3",
  storageBucket: "pantry-tracker-73db3.appspot.com",
  messagingSenderId: "555518576112",
  appId: "1:555518576112:web:963ff9fb1a5f8b302bc935",
  measurementId: "G-8QX97C3G0P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)

export {firestore}