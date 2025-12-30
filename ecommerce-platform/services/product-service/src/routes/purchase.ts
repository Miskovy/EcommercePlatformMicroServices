import { Router } from "express";
import { createPurchase, getAllPurchases , getPurchaseById , getPurchasesByFinancialAccount , getPurchasesByProduct , getPurchasesBySupplier ,deletePurchase , updatePurchase } from "../controllers/purchaseController";
import { upload } from "../middlewares/uploads";

const route  = Router();

const uploadFields = upload.fields([
    { name: 'receiptImage', maxCount: 1 }
]);

route.post("/", uploadFields, createPurchase);
route.get("/", getAllPurchases);
route.get("/:id", getPurchaseById);
route.get("/product/:productId", getPurchasesByProduct);
route.get("/supplier/:supplierId", getPurchasesBySupplier);
route.get("/financial-account/:financialAccountId", getPurchasesByFinancialAccount);
route.delete("/:id", deletePurchase);
route.put("/:id", uploadFields, updatePurchase);

export default route;