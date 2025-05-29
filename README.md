# vue-project

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

## Docker Setup

### Construcción de la imagen

```sh
docker build -t spo-frontend-dev .
```

### Ejecutar en modo desarrollo

#### Opción 1: Básica

```sh
docker run -p 5173:5173 spo-frontend-dev
```

#### Opción 2: Con hot reload (recomendado para desarrollo)

```sh
docker run -p 5173:5173 -v $(pwd)/src:/app/src spo-frontend-dev
```

#### Opción 3: Con hot reload completo

```sh
docker run -p 5173:5173 -v $(pwd):/app -v /app/node_modules spo-frontend-dev
```

### Acceso a la aplicación

Una vez ejecutado el contenedor, la aplicación estará disponible en:

```
http://localhost:5173
```

### Notas sobre Docker

- El Dockerfile está optimizado para desarrollo con hot reload
- Puerto expuesto: `5173` (puerto por defecto de Vite)
- Se recomienda usar la opción 2 o 3 para desarrollo activo
- Los cambios en el código se reflejarán automáticamente en el navegador

# sigha-frontend
