import { Request, Response } from 'express';
import { BadRequest } from '../Errors/BadRequest';
import PurchaseModel from '../models/Purchase';
import { SuccessResponse } from '../utils/response';
import mongoose from 'mongoose';
import ProductModel from '../models/Product';
import SupplierModel from '../models/supplier';
import FinancialAccountModel from '../models/FinancialAccount';

interface MulterRequest extends Request {
    files: {
        [fieldname: string]: Express.Multer.File[];
    }
}

export const createPurchase = async (req: Request, res: Response) => {
    try {
        const { productId, supplierId, quantity, totalPrice, receiptImage, financialAccountId } = req.body;
        const files = (req as MulterRequest).files;

        if (!productId || !supplierId || !quantity || !totalPrice || !receiptImage || !financialAccountId) {
            throw new BadRequest("Please fill in required fields");
        }

        const product = await ProductModel.findById(productId);
        if (!product) {
            throw new BadRequest("Product not found");
        }

        const supplier = await SupplierModel.findById(supplierId);
        if (!supplier) {
            throw new BadRequest("Supplier not found");
        }

        if (quantity <= 0) {
            throw new BadRequest("Quantity must be greater than zero");
        }
        if (totalPrice <= 0) {
            throw new BadRequest("Total price must be greater than zero");
        }

        if (!files || !files['receiptImage']) {
            throw new Error("Receipt image is required");
        }

        const receiptImagePath = files['receiptImage'][0].path;
        const FinancialAccount = await FinancialAccountModel.findById(financialAccountId);
        if (!FinancialAccount) {
            throw new BadRequest("Financial Account not found");
        }
        if (FinancialAccount.balance < totalPrice) {
            throw new BadRequest("Insufficient balance in the financial account");
        }
        // Deduct the totalPrice from the financial account balance
        FinancialAccount.balance -= totalPrice;
        await FinancialAccount.save();

        //Add stock to the product
        product.stock += Number(quantity);
        await product.save();

        // Create a new purchase record
        const purchase = new PurchaseModel({
            productId,
            supplierId,
            quantity,
            totalPrice,
            receiptImage: receiptImagePath,
            financialAccountId
        });
        await purchase.save();

        return SuccessResponse(res, {
            message: "Purchase created successfully",
            data: purchase
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
}


export const getAllPurchases = async (req: Request, res: Response) => {
    try {
        const purchases = await PurchaseModel.find();
        return SuccessResponse(res, {
            message: "Purchases fetched successfully",
            data: purchases
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
}

export const getPurchaseById = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            message: "Invalid ID format. Must be a 24-character hex string."
        });
    }
    const purchase = await PurchaseModel.findById(id).populate('productId supplierId financialAccountId');
    if (!purchase) {
        throw new BadRequest("Purchase not found");
    }
    return SuccessResponse(res, {
        message: "Purchase fetched successfully",
        data: purchase
    });

}

export const getPurchasesByProduct = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                message: "Invalid Product ID format. Must be a 24-character hex string."
            });
        }
        const Product = await ProductModel.findById(productId);
        if (!Product) {
            throw new BadRequest("Product not found");
        }
        const purchases = await PurchaseModel.find({ productId }).populate('productId supplierId financialAccountId');
        if (!purchases) {
            throw new BadRequest("Purchases not found");
        }
        return SuccessResponse(res, {
            message: "Purchases fetched successfully",
            data: purchases
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
}


export const getPurchasesBySupplier = async (req: Request, res: Response) => {
    try {
        const { supplierId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(supplierId)) {
            return res.status(400).json({
                message: "Invalid Supplier ID format. Must be a 24-character hex string."
            });
        }
        const Supplier = await SupplierModel.findById(supplierId);
        if (!Supplier) {
            throw new BadRequest("Supplier not found");
        }
        const purchases = await PurchaseModel.find({ supplierId }).populate('productId supplierId financialAccountId');
        if (!purchases) {
            throw new BadRequest("Purchases not found");
        }
        return SuccessResponse(res, {
            message: "Purchases fetched successfully",
            data: purchases
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }

}


export const getPurchasesByFinancialAccount = async (req: Request, res: Response) => {
    try {
        const { financialAccountId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(financialAccountId)) {
            return res.status(400).json({
                message: "Invalid Financial Account ID format. Must be a 24-character hex string."
            });
        }
        const FinancialAccount = await FinancialAccountModel.findById(financialAccountId);
        if (!FinancialAccount) {
            throw new BadRequest("Financial Account not found");
        }
        const purchases = await PurchaseModel.find({ financialAccountId }).populate('productId supplierId financialAccountId');
        if (!purchases) {
            throw new BadRequest("Purchases not found");
        }
        return SuccessResponse(res, {
            message: "Purchases fetched successfully",
            data: purchases
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
}


export const deletePurchase = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid ID format. Must be a 24-character hex string."
            });
        }
        const purchase = await PurchaseModel.findByIdAndDelete(id);
        if (!purchase) {
            throw new BadRequest("Purchase not found");
        }
        return SuccessResponse(res, {
            message: "Purchase deleted successfully",
            data: purchase
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
}


// export const updatePurchase = async (req: Request, res: Response) => {
//     try {
//         const { id } = req.params;
//         const updateData = req.body;
//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).json({
//                 message: "Invalid ID format. Must be a 24-character hex string."
//             });
//         }
//         const purchase = await PurchaseModel.findByIdAndUpdate(id, updateData, { new: true });
//         if (!purchase) {
//             throw new BadRequest("Purchase not found");
//         }

//     } catch (error) {
//         res.status(500).json({ message: "Internal Server Error", error });
//     }
// }