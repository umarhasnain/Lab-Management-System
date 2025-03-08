// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBX5zzADOTTzeo3xi5vBUydwKNfdV1SdOc",
    authDomain: "smit-batch-9-75dc8.firebaseapp.com",
    databaseURL: "https://smit-batch-9-75dc8-default-rtdb.firebaseio.com",
    projectId: "smit-batch-9-75dc8",
    storageBucket: "smit-batch-9-75dc8.appspot.com",
    messagingSenderId: "467611414345",
    appId: "1:467611414345:web:1d10ee360efaa158663498"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
