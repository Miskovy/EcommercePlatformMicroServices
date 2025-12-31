FROM node:20-alpine

WORKDIR /app

# 👇 ADD THIS LINE to install OpenSSL 3
RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma/ 

RUN npm install

# Generate Prisma Client (Required for TS to know your types)
RUN npx prisma generate

COPY . .

EXPOSE 3002

CMD ["npx", "ts-node-dev", "--respawn", "--transpile-only", "src/index.ts"]