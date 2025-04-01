
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator, collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
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

// Función auxiliar para crear/actualizar el documento de usuario después del registro/login
const saveUserToFirestore = async (user) => {
  if (!user) return;
  
  try {
    // Ruta al documento del usuario utilizando su UID como ID del documento
    const userRef = doc(db, "users", user.uid);
    
    // Datos que guardaremos/actualizaremos
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || null,
      photoURL: user.photoURL || null,
      lastLogin: serverTimestamp(),
      provider: user.providerData[0]?.providerId || "unknown"
    };

    // Si es un registro nuevo, añadir fecha de creación
    if (!user.metadata?.lastSignInTime) {
      userData.createdAt = serverTimestamp();
    }
    
    // Guardar en Firestore (actualiza si existe, crea si no)
    await setDoc(userRef, userData, { merge: true });
    console.log("Usuario guardado en Firestore:", user.uid);
  } catch (error) {
    console.error("Error al guardar usuario en Firestore:", error);
  }
};

// Versiones modificadas que guardan el usuario en Firestore
const createUserWithEmailAndPasswordAndSave = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await saveUserToFirestore(userCredential.user);
    return userCredential;
  } catch (error) {
    console.error("Error al crear usuario:", error);
    throw error;
  }
};

const signInWithEmailAndSave = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await saveUserToFirestore(userCredential.user);
    return userCredential;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw error;
  }
};

export { 
  auth, 
  googleProvider, 
  db, 
  saveUserToFirestore, 
  createUserWithEmailAndPasswordAndSave, 
  signInWithEmailAndSave 
};
