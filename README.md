# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/3ac9cdd1-998f-41dc-aa76-e8243c1fb6ff

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/3ac9cdd1-998f-41dc-aa76-e8243c1fb6ff) and start prompting.

Changes made via Lovable will be committed automatically to this repo.


This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/3ac9cdd1-998f-41dc-aa76-e8243c1fb6ff) and click on Share -> Publish.
Para que puedas configurar correctamente el proyecto en tu propio GitHub y Firebase, necesitarás cambiar algunas configuraciones clave:

En src/lib/firebase.ts: Debes reemplazar la configuración actual de Firebase con tu propia configuración. Ve a Firebase Console, crea un nuevo proyecto y sigue estos pasos:
Ve a Configuración del Proyecto
Selecciona "Agregar aplicación" y elige "Web"
Registra tu aplicación
Copia la configuración de Firebase que te proporciona (se verá como un objeto similar al actual)
Ejemplo de cómo debería verse:


const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_DOMINIO.firebaseapp.com",
  projectId: "TU_ID_DE_PROYECTO",
  storageBucket: "TU_BUCKET_DE_STORAGE",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};
En GitHub:
Clona el repositorio
Crea un archivo .env en la raíz del proyecto para guardar tus credenciales de Firebase de forma segura
Añade .env a tu .gitignore para no exponer credenciales sensibles
Configuración recomendada en .env:

VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_dominio.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
Luego actualiza src/lib/firebase.ts para usar variables de entorno:


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  // ... resto de configuraciones
};
Habilita la Autenticación de Google en Firebase:
En la consola de Firebase
Ve a "Authentication"
Selecciona "Sign-in method"
Habilita el proveedor de Google
Instala dependencias:

npm install
Ejecuta el proyecto:

npm run dev
¿Necesitas que te explique alguno de estos pasos con más detalle?


