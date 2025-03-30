
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Tu configuración de Firebase
// Normalmente esto debería ser un secreto, pero Firebase permite que estas claves sean públicas
// ya que se restringen con reglas de seguridad en el backend
const firebaseConfig = {
  apiKey: "AIzaSyBq0K6V-XlvFUTdHsjC6GV2Av1snnM2z0s",
  authDomain: "lovable-landing-demo.firebaseapp.com",
  projectId: "lovable-landing-demo",
  storageBucket: "lovable-landing-demo.appspot.com",
  messagingSenderId: "234029048302",
  appId: "1:234029048302:web:f3a38fe4ef06ef8e3adb5a"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
