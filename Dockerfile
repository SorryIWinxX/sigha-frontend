# Etapa 1: Construcción
FROM node:20-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Producción con Nginx
FROM nginx:alpine as production-stage
# Copiar los archivos construidos de la etapa anterior
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copiar la configuración de nginx a la carpeta de templates.
# La imagen de nginx ejecutará automáticamente envsubst en los archivos que terminen en .template
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Script mágico: Genera config.js usando las variables de entorno actuales
RUN echo '#!/bin/sh' > /docker-entrypoint.d/40-generate-config.sh && \
    echo 'echo "window.__ENV__ = {" > /usr/share/nginx/html/config.js' >> /docker-entrypoint.d/40-generate-config.sh && \
    echo 'echo "  VITE_SCHOOL: \"$VITE_SCHOOL\"," >> /usr/share/nginx/html/config.js' >> /docker-entrypoint.d/40-generate-config.sh && \
    echo 'echo "  VITE_COLOR: \"$VITE_COLOR\"," >> /usr/share/nginx/html/config.js' >> /docker-entrypoint.d/40-generate-config.sh && \
    echo 'echo "};" >> /usr/share/nginx/html/config.js' >> /docker-entrypoint.d/40-generate-config.sh && \
    chmod +x /docker-entrypoint.d/40-generate-config.sh

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 
