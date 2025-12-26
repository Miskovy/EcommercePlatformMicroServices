import { Router } from "express";
import categoryRouter from "./category";
const route = Router();

route.use('/category', categoryRouter);

route.get('/', (req, res) => {
    res.send('Product Service API is running');
});
export default route;