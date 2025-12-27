import { Router } from "express";
import { createProduct, getAllProducts , getProductById , deleteProduct ,updateProduct , getProductsByCategory } from "../controllers/productController";
import { upload } from "../middlewares/uploads";

const route = Router();

const uploadFields = upload.fields([
    { name: 'MainImage', maxCount: 1 }, 
    { name: 'GalleryImages', maxCount: 5 }
]);

route.post("/", uploadFields, createProduct);
route.get("/", getAllProducts);
route.get("/:id", getProductById);
route.delete("/:id", deleteProduct);
route.put("/:id", uploadFields, updateProduct);
route.get("/category/:categoryId", getProductsByCategory);

export default route;