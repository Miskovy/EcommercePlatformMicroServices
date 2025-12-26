FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

EXPOSE 3001
CMD ["npm", "start"]