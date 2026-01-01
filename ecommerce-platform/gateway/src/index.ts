import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;


app.use(cors());
app.use(helmet());
// app.use(express.json()); removed to allow raw body for certain proxies

app.get('/health', (req, res) => {
  res.json({ message: 'E-commerce Platform API is running' });
});

// Proxy Routes
// IMPORTANT: The targets must use the DOCKER CONTAINER NAMES
const productServiceUrl = process.env.PRODUCT_SERVICE_URL || 'http://product-service:3001';
const userServiceUrl = process.env.USER_SERVICE_URL || 'http://user-service:3002';


// Forward /api/products request to Product Service
app.use('/api/products', createProxyMiddleware({
  target: productServiceUrl,
  changeOrigin: true,
  pathRewrite: {
    '^/api/products': '',
  },
}));


// Forward /api/auth request to User Service
app.use('/api/user', createProxyMiddleware({
  target: userServiceUrl,
  changeOrigin: true,
  pathRewrite: {
    '^/api/user': '',
  },
}));


app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});