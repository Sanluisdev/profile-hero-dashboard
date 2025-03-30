
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBK84VweShaBsOf4KgF30Iy5Z1GaCFQ3Bg",
  authDomain: "crm-med-8b83e.firebaseapp.com",
  projectId: "crm-med-8b83e",
  storageBucket: "crm-med-8b83e.appspot.com", // Corregido el dominio de storage
  messagingSenderId: "963483880309",
  appId: "1:963483880309:web:35acf1ca201b662fffa13c",
  measurementId: "G-VS9YT01FNT"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, db };
