# Dockerfile para pre-prod - Vue.js + Vite (sin nginx)

FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application for preview
RUN npm run build

# Expose port 3000 (Vite preview default)
EXPOSE 3000

# Start with Vite preview (sin nginx)
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"] 
