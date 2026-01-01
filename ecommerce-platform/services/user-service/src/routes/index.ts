import { Router } from "express";
import CustomerauthRouter from "./customer/auth";

const route = Router();

route.use('/customer', CustomerauthRouter);

route.get('/', (req, res) => {
    res.send('User Service API is running');
});
export default route;