import SupplierModel from '../models/supplier';
import { Request, Response } from 'express';
import { SuccessResponse } from '../utils/response';
import { BadRequest } from '../Errors/BadRequest';
import mongoose from 'mongoose';

export const createSupplier = async (req: Request, res: Response) => {
    try {
        const { name, companyName, contactEmail, phoneNumber, address } = req.body;
        // Validation
        if (!name || !companyName || !contactEmail || !phoneNumber || !address) {
            throw new Error("Please fill in required fields");
        }
        const newSupplier = new SupplierModel({
            name,
            companyName,
            contactEmail,
            phoneNumber,
            address
        });
        const savedSupplier = await newSupplier.save();
        return SuccessResponse(res, {
            message: "Supplier created successfully",
            data: savedSupplier
        });
    } catch (error: any) {
        throw new BadRequest(error.message || "Failed to create supplier");
    }
};

export const getAllSuppliers = async (req: Request, res: Response) => {
    try {
        const suppliers = await SupplierModel.find();
        return SuccessResponse(res, {
            message: "Suppliers fetched successfully",
            data: suppliers
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

export const getSupplierById = async (req: Request, res: Response) => {
    try {
        const supplierId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(supplierId)) {
            return res.status(400).json({
                message: "Invalid ID format. Must be a 24-character hex string."
            });
        }
        const supplier = await SupplierModel.findById(supplierId);
        if (!supplier) {
            throw new BadRequest("Supplier not found");
        }
        return SuccessResponse(res, {
            message: "Supplier fetched successfully",
            data: supplier
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

export const updateSupplier = async (req: Request, res: Response) => {
    try {
        const supplierId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(supplierId)) {
            return res.status(400).json({
                message: "Invalid ID format. Must be a 24-character hex string."
            });
        }
        const supplier = await SupplierModel.findById(supplierId);
        if (!supplier) {
            throw new BadRequest("Supplier not found");
        }
        const { name, companyName, contactEmail, phoneNumber, address } = req.body;


        if (name) supplier.name = name;
        if (companyName) supplier.companyName = companyName;
        if (contactEmail) supplier.contactEmail = contactEmail;
        if (phoneNumber) supplier.phoneNumber = phoneNumber;
        if (address) supplier.address = address;

        const updatedSupplier = await supplier.save();
        return SuccessResponse(res, {
            message: "Supplier updated successfully",
            data: updatedSupplier
        });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

export const deleteSupplier = async (req: Request, res: Response) => {
    try {
        const supplierId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(supplierId)) {
            return res.status(400).json({
                message: "Invalid ID format. Must be a 24-character hex string."
            });
        }
        const supplier = await SupplierModel.findByIdAndDelete(supplierId);
        if (!supplier) {
            throw new BadRequest("Supplier not found");
        }
        return SuccessResponse(res, {
            message: "Supplier deleted successfully",
            data: supplier
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};