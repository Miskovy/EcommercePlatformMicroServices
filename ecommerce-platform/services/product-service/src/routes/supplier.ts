import { Router } from "express";
import { createSupplier, getAllSuppliers, getSupplierById , updateSupplier , deleteSupplier } from "../controllers/supplier";

const route  = Router();

route.post("/", createSupplier);
route.get("/", getAllSuppliers);
route.get("/:id", getSupplierById);
route.put("/:id", updateSupplier);
route.delete("/:id", deleteSupplier);

export default route;