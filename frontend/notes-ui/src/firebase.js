import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBDMp1jszw3Ivns8NoFO7sgSghnhH3w7r8",

  authDomain: "notes-mangment.firebaseapp.com",

  projectId: "notes-mangment",

  storageBucket: "notes-mangment.firebasestorage.app",

  messagingSenderId: "46416906268",

  appId: "1:46416906268:web:b9d986d61b592d46a5b7d9",

  measurementId: "G-7PM1PQHBX8",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { auth };
