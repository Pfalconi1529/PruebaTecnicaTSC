# BUILDER STAGE
FROM node:20-alpine AS builder

WORKDIR /app
# Optimización del Cache: Copia dependencias primero
COPY package.json package-lock.json ./
RUN npm install

# REVERTIR EL ORDEN DE ESTOS DOS PASOS
COPY . . 
RUN chmod +x ./node_modules/.bin/* # Ejecutar el build de TypeScript
RUN npm run build

# ----------------------------------------------------
# PRODUCTION STAGE (Seguridad no-root aplicada aquí)
# ----------------------------------------------------
FROM node:20-alpine AS production

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --only=production 

# Copiar archivos compilados y asignar propiedad al usuario 'node'
COPY --from=builder --chown=node:node /app/dist ./dist

# Ejecutar como usuario no-root
USER node

# Establecer variable de entorno
ENV NODE_ENV=production

CMD ["node", "./dist/app.js"]