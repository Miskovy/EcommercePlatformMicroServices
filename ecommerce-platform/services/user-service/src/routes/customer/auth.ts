import { Router } from "express";
import { login , register } from "../../controllers/authController";
const route = Router();

route.post('/auth/login', login);
route.post('/auth/register', register);

export default route;