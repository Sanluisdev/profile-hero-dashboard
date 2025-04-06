
# Permisos de Firebase

Este archivo documenta las reglas de seguridad y permisos necesarios para el correcto funcionamiento de la aplicación.

## Reglas de Firestore

Para resolver el error "Missing or insufficient permissions" en las colecciones, debes configurar las siguientes reglas en la consola de Firebase:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir acceso a la colección 'users' por usuario autenticado o administrador
    match /users/{userId} {
      allow read: if request.auth != null && (request.auth.uid == userId || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true);
      allow write: if request.auth != null && (request.auth.uid == userId || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true);
    }
    
    // Permitir acceso a la colección 'schedule' por cualquiera para lectura, solo admin para escritura
    match /schedule/{document} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == "KTZux14pVHQ9sv202AUChoLuR0F2";
    }
    
    // Reglas para futuras colecciones
    match /{collection}/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
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

### Error: "net::ERR_BLOCKED_BY_CLIENT"

Este error indica que las peticiones a Firebase están siendo bloqueadas por el cliente. Posibles causas:

1. **Extensiones del navegador**: Extensiones como AdBlocker, Privacy Badger, uBlock Origin pueden estar bloqueando peticiones a los servidores de Firebase.
   - **Solución**: Deshabilita temporalmente estas extensiones o agrega una excepción para tu dominio.

2. **VPN o firewall**: Si estás utilizando una VPN o firewall, podrían estar bloqueando las comunicaciones con Firebase.
   - **Solución**: Desactiva temporalmente la VPN o configura excepciones en el firewall.

3. **Políticas de red corporativas**: Si estás en una red empresarial, pueden tener políticas que bloquean servicios en la nube.
   - **Solución**: Consulta con el administrador de la red.

### Solución específica para el usuario administrador

Para el usuario administrador con ID `KTZux14pVHQ9sv202AUChoLuR0F2` (jmesparre@gmail.com), es necesario agregar manualmente el campo `isAdmin: true` en su documento de Firestore.

Pasos para agregar el campo isAdmin:
1. Ve a la [consola de Firebase](https://console.firebase.google.com/)
2. Selecciona tu proyecto y ve a "Firestore Database"
3. Navega a la colección "users"
4. Localiza el documento con ID "KTZux14pVHQ9sv202AUChoLuR0F2"
5. Haz clic en "Editar" y agrega un nuevo campo:
   - Campo: `isAdmin`
   - Tipo: boolean
   - Valor: `true`
6. Guarda los cambios

También se ha añadido una regla específica para el usuario con ID "KTZux14pVHQ9sv202AUChoLuR0F2" para permitirle escribir en la colección "schedule" incluso si hay problemas con la verificación de isAdmin.

## Notas importantes

Cualquier cambio en la estructura de datos o en las necesidades de acceso debe ser reflejado en este documento y en las reglas de seguridad de Firebase.
