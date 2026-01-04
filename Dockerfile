FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

RUN mkdir -p public/feed data

EXPOSE 8000

CMD ["node", "server.js"]


