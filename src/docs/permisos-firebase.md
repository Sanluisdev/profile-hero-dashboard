
# Permisos de Firebase

Este archivo documenta las reglas de seguridad y permisos necesarios para el correcto funcionamiento de la aplicación.

## Reglas de Firestore

Para resolver el error "Missing or insufficient permissions" en la colección "schedule", debes configurar las siguientes reglas en la consola de Firebase:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir acceso completo a usuarios autenticados que sean administradores
    match /schedule/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Reglas para la colección de usuarios
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Reglas para otras colecciones
    // ...
  }
}
```

## Pasos para actualizar las reglas de Firebase

1. Ve a la [consola de Firebase](https://console.firebase.google.com/)
2. Selecciona tu proyecto: "crm-med-8b83e"
3. Ve a "Firestore Database" en el menú lateral
4. Haz clic en la pestaña "Rules"
5. Copia y pega las reglas anteriores
6. Haz clic en "Publish"

## Resolución de problemas comunes de permisos

### Error: "Missing or insufficient permissions"

Este error ocurre cuando:
1. El usuario no está autenticado
2. El usuario no tiene los permisos necesarios según las reglas de seguridad
3. Las reglas de seguridad están mal configuradas

### Error: "Unexpected 'allow'"

Este error ocurre cuando hay un problema de sintaxis en las reglas de seguridad. En particular:
- Cuando se utiliza "allow read: allow read;" en lugar de solo "allow read;"
- Cuando hay una coma faltante o una estructura incorrecta

### Corrección del error de sintaxis

El error que estás viendo en la consola de Firebase ("No se pudieron guardar las reglas: Line 6: Unexpected 'allow'") se debe a que la línea:
```
allow read: allow read;
```
debería ser simplemente:
```
allow read: if true;
```

### Verificación de permisos de administrador

Para verificar si un usuario tiene permisos de administrador:

1. Asegúrate de que el documento del usuario en la colección "users" tenga un campo "isAdmin" configurado como true
2. Verifica que el usuario esté correctamente autenticado antes de intentar acceder a recursos protegidos

## Notas importantes

Cualquier cambio en la estructura de datos o en las necesidades de acceso debe ser reflejado en este documento y en las reglas de seguridad de Firebase.
