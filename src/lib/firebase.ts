
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-analytics.js";
// Tu configuración de Firebase
// Normalmente esto debería ser un secreto, pero Firebase permite que estas claves sean públicas
// ya que se restringen con reglas de seguridad en el backend
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: "crm-med-8b83e",
    storageBucket: "crm-med-8b83e.firebasestorage.app",
    messagingSenderId: "963483880309",
    appId: "1:963483880309:web:35acf1ca201b662fffa13c",
    measurementId: "G-VS9YT01FNT"
  };

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
