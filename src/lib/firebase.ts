import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCFDGELwOCTtx3P19YO_paSsVsDn9573c8",
    authDomain: "cantech-dashboard.firebaseapp.com",
    projectId: "cantech-dashboard",
    storageBucket: "cantech-dashboard.firebasestorage.app",
    messagingSenderId: "959990567025",
    appId: "1:959990567025:web:319655dd7e711ca62f4bd0",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);