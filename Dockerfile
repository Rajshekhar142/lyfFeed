# ---------- Base ----------
FROM node:20-bullseye-slim

# ---------- System deps for canvas ----------
RUN apt-get update && apt-get install -y \
  libcairo2-dev \
  libjpeg-dev \
  libpango1.0-dev \
  libgif-dev \
  librsvg2-dev \
  python3 \
  make \
  g++ \
  && rm -rf /var/lib/apt/lists/*

# ---------- App ----------
WORKDIR /app

# Copy only package files first (better caching)
COPY package*.json ./

# Install ONLY production deps (CI-safe)
RUN npm ci --omit=dev

# Copy rest of the source
COPY . .

# ---------- Runtime ----------
ENV NODE_ENV=production
EXPOSE 8000

CMD ["npm", "start"]
