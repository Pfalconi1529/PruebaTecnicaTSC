FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install  # instala también devDependencies
COPY . .
RUN chmod +x node_modules/.bin/*
RUN npm run build
# Producción
FROM node:20-alpine AS production
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --only=production  # solo dependencias necesarias
COPY --from=builder /app/dist ./dist

CMD ["node", "./dist/app.js"]
