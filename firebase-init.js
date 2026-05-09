// Firebase Initialization (Compat CDN mode - no imports needed)
const firebaseConfig = {
    apiKey: "AIzaSyCiWZbj3bT_yef_5WO_HZUX51AlMRNrKXA",
    authDomain: "banchee-c70fb.firebaseapp.com",
    projectId: "banchee-c70fb",
    storageBucket: "banchee-c70fb.firebasestorage.app",
    messagingSenderId: "960288951898",
    appId: "1:960288951898:web:bdffa7806c2c86f0c11263",
    measurementId: "G-NWTFLYTZNC"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
