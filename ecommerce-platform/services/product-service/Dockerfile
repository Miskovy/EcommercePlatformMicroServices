# Use a lightweight Node image
FROM node:18-alpine

WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose the port defined in index.ts
EXPOSE 3001

# Use ts-node-dev for development (hot reloading)
CMD ["npx", "ts-node-dev", "--respawn", "--transpile-only", "src/index.ts"]