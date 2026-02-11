// ==============================
// Firebase Imports
// ==============================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ==============================
// Firebase Configuration
// ==============================
const firebaseConfig = {
 apiKey: "AIzaSyDTEID91DeqCmHY0R9ubR1KECIgTWGoV_0",
  authDomain: "cc106--jenny.firebaseapp.com",
  projectId: "cc106--jenny",
  storageBucket: "cc106--jenny.firebasestorage.app",
  messagingSenderId: "487652624277",
  appId: "1:487652624277:web:947ed52bd91cc89363d89c"
};

// ==============================
// Initialize Firebase
// ==============================
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ==============================
// Register User
// ==============================
window.registerUser = function () {
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      return setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        email,
        createdAt: new Date()
      });
    })
    .then(() => {
      alert("Registration successful!");
      window.location.href = "index.html";
    })
    .catch((error) => {
      alert(error.message);
    });
};

// ==============================
// Login User
// ==============================
window.loginUser = function () {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Login successful!");
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      alert(error.message);
    });
};

// ==============================
// Auth State Listener (Dashboard)
// ==============================
onAuthStateChanged(auth, async (user) => {
  if (user && document.getElementById("userInfo")) {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      document.getElementById("userInfo").innerHTML = `
        <p>Name: ${data.firstName} ${data.lastName}</p>
        <p>Email: ${data.email}</p>
      `;
    }
  } else if (!user && window.location.pathname.includes("dashboard.html")) {
    window.location.href = "index.html";
  }
});

// ==============================
// Logout User
// ==============================
window.logoutUser = function () {
  signOut(auth).then(() => {
    alert("Logged out successfully!");
    window.location.href = "index.html";
  });
};
