// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyARDj0sIWN6oMmnEiWlDYStzUJpPDGhDP8",
    authDomain: "collageapi-320fb.firebaseapp.com",
    projectId: "collageapi-320fb",
    storageBucket: "collageapi-320fb.appspot.com",
    messagingSenderId: "180850473490",
    appId: "1:180850473490:web:ec685b4678e85d03c036cb",
    measurementId: "G-SPTYV5V2D9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
