
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBK84VweShaBsOf4KgF30Iy5Z1GaCFQ3Bg",
  authDomain: "crm-med-8b83e.firebaseapp.com",
  projectId: "crm-med-8b83e",
  storageBucket: "crm-med-8b83e.appspot.com", 
  messagingSenderId: "963483880309",
  appId: "1:963483880309:web:35acf1ca201b662fffa13c",
  measurementId: "G-VS9YT01FNT"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Solo inicializar analytics si estamos en el navegador
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Comprueba si la URL es una URL de desarrollo local
const isLocalhost = 
  typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || 
   window.location.hostname === '127.0.0.1');

// Si estamos en localhost, podemos usar el emulador
if (isLocalhost) {
  // Uncomment if you're using Firebase Emulator
  // connectFirestoreEmulator(db, '127.0.0.1', 8080);
}

console.log("Firebase inicializado con config:", { 
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  isLocalhost
});

export { auth, googleProvider, db };
