# 1. Use Node 20 Alpine (Modern Standard)
FROM node:20-alpine

# 2. Set working directory
WORKDIR /app

# 3. 🛠️ INSTALL DEPENDENCIES
# Even with Node 20, Alpine Linux is "bare bones." 
# We MUST install these libraries so 'canvas' can work.
RUN apk add --no-cache \
    build-base \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev \
    python3

# 4. Install Node dependencies
COPY package*.json ./
RUN npm install --production

# 5. Copy the rest of the code
COPY . .

# 6. Create folders explicitly
RUN mkdir -p public/feed data

# 7. Expose and Start
EXPOSE 8000
CMD ["node", "server.js"]