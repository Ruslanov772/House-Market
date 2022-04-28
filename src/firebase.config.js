import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyBWQe2qI92qPG1U6YxMNEbPFncuPPHCiSk",
    authDomain: "house-market-27c64.firebaseapp.com",
    projectId: "house-market-27c64",
    storageBucket: "house-market-27c64.appspot.com",
    messagingSenderId: "5486730491",
    appId: "1:5486730491:web:ddf7683cfa605edeee645e"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore();
