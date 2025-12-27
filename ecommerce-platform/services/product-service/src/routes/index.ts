import { Router } from "express";
import categoryRouter from "./category";
import productRouter from "./product";
const route = Router();

route.use('/category', categoryRouter);
route.use('/product', productRouter);

route.get('/', (req, res) => {
    res.send('Product Service API is running');
});
export default route;