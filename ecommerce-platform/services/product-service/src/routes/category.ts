import { Router } from "express";
import { createCategory, getAllCategories , getCategoryById , deleteCategory ,updateCategory } from "../controllers/categoryController";


const route = Router();

route.get("/", getAllCategories);
route.post("/", createCategory);
route.get("/:id", getCategoryById);
route.delete("/:id", deleteCategory);
route.put("/:id", updateCategory);
export default route;