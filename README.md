# SIGHA - FRONTEND - DESARROLLO

<div style="display: flex; align-items: center; gap: 20px; justify-content: center; padding-bottom: 30px">
  <img src="src/assets/logoSIGHA.svg" alt="Logo SIGHA" height="200">
  <img src="src/assets/logo.svg" alt="Logo Vue" height="200">
</div>

Este es el entorno de desarrollo para el proyecto SIGHA Frontend. Aquí se implementan y prueban las primeras actualizaciones del software, por lo que puede contener fallos.

## Configuración Recomendada del IDE

Se recomienda utilizar [VSCode](https://code.visualstudio.com/) junto con la extensión [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (y desactivar Vetur) para una mejor experiencia de desarrollo con Vue.js.

## Soporte de Tipos para Importaciones `.vue` en TypeScript

TypeScript no maneja la información de tipos para importaciones de archivos `.vue` de manera predeterminada. Por lo tanto, reemplazamos el CLI `tsc` con `vue-tsc` para la verificación de tipos. En los editores, necesitamos [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) para que el servicio de lenguaje de TypeScript sea consciente de los tipos `.vue`.

## Personalizar Configuración

Para más detalles sobre la configuración, consulta la [Referencia de Configuración de Vite](https://vite.dev/config/).

## Configuración del Proyecto

Para instalar las dependencias necesarias, ejecuta:

```sh
npm install
```

### Compilar y Recargar Automáticamente para Desarrollo

Para iniciar el servidor de desarrollo con recarga automática, utiliza:

```sh
npm run dev
```

### Verificación de Tipos, Compilación y Minificación para Producción

Para compilar el proyecto para producción, ejecuta:

```sh
npm run build
```

## Contribuir

Si deseas contribuir al proyecto, por favor sigue las siguientes pautas:

1. Haz un fork del repositorio.
2. Crea una nueva rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -m 'Añadir nueva funcionalidad'`).
4. Sube tus cambios a la rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

## Contacto

Para cualquier pregunta o comentario, por favor contacta al equipo de desarrollo a través de [correo electrónico] o crea un issue en el repositorio.

# sigha-frontend
