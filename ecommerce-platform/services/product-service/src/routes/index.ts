import { Router } from "express";
import categoryRouter from "./category";
import productRouter from "./product";
import purchaseRouter from "./purchase";
import supplierRouter from "./supplier";
import financialAccountRouter from "./financialAccount";

const route = Router();

route.use('/category', categoryRouter);
route.use('/product', productRouter);
route.use('/purchase', purchaseRouter);
route.use('/supplier', supplierRouter);
route.use('/financial-account', financialAccountRouter);

route.get('/', (req, res) => {
    res.send('Product Service API is running');
});
export default route;