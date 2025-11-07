# BUILDER STAGE
FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . . 
RUN npm run build
FROM node:20-alpine AS production

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --only=production 
COPY --from=builder --chown=node:node /app/dist ./dist
RUN chmod +x ./node_modules/.bin/*
USER node
ENV NODE_ENV=production

CMD ["node", "./dist/app.js"]