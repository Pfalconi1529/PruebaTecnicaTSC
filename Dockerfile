# BUILDER STAGE
FROM node:20-alpine AS builder

WORKDIR /app
# 1. Optimización del Cache: Copia dependencias primero
COPY package.json package-lock.json ./
RUN npm install
COPY . .
# 2. Seguridad: Asegura que el usuario 'node' tenga la propiedad
RUN chown -R node:node /app 

# Ejecutar el build de TypeScript
RUN npm run build

# PRODUCTION STAGE
FROM node:20-alpine AS production

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --only=production 

# Copiar archivos compilados y asignar propiedad al usuario 'node'
COPY --from=builder --chown=node:node /app/dist ./dist

# 3. Seguridad: Ejecutar como usuario no-root
USER node

# 4. Configuración: Establecer variable de entorno explícita
ENV NODE_ENV=production

CMD ["node", "./dist/app.js"]