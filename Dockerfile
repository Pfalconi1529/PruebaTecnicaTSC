FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install  # instala devDependencies también
COPY . .
RUN npm run build

# Producción
FROM node:20-alpine AS production
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --only=production  # solo dependencias de producción
COPY --from=builder /app/dist ./dist

COPY .env ./.env
EXPOSE 3000

CMD ["node", "dist/app.js"]



