# services/cart-service/Dockerfile

FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma Client (We will add Prisma in the next step)
# RUN npx prisma generate

# Build the NestJS app
RUN npm run build

EXPOSE 3003

# NestJS runs from the "dist" folder after build
CMD ["npm", "run", "start:prod"]