import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCiWZbj3bT_yef_5WO_HZUX51AlMRNrKXA",
    authDomain: "banchee-c70fb.firebaseapp.com",
    projectId: "banchee-c70fb",
    storageBucket: "banchee-c70fb.firebasestorage.app",
    messagingSenderId: "960288951898",
    appId: "1:960288951898:web:bdffa7806c2c86f0c11263",
    measurementId: "G-NWTFLYTZNC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const auth = getAuth(app);
export { app, analytics };
