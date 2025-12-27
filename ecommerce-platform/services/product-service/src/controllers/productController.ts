import { Request, Response } from 'express';
import { BadRequest } from '../Errors/BadRequest';
import ProductModel from '../models/Product';
import { SuccessResponse } from '../utils/response';
import mongoose from 'mongoose';
import { saveBase64Image } from '../utils/handleImages';
import fs from 'fs';

interface MulterRequest extends Request {
    files: {
        [fieldname: string]: Express.Multer.File[];
    }
}

export const createProduct = async (req: Request, res: Response) => {
    try {
        const { name, description, price, category } = req.body;

        // Cast req to MulterRequest to fix TS errors
        const files = (req as MulterRequest).files;

        // Validation
        if (!name || !description || !price || !category) {
            throw new Error("Please fill in required fields");
        }
        if (!files || !files['MainImage']) {
            throw new Error("Main image is required");
        }

        // 1. Get Main Image Path
        // Multer saves it to disk, we just save the filename/path to DB
        const mainImagePath = files['MainImage'][0].path;

        // 2. Get Gallery Image Paths
        let galleryPaths: string[] = [];
        if (files['GalleryImages']) {
            galleryPaths = files['GalleryImages'].map(file => file.path);
        }

        const product = await ProductModel.create({
            name,
            description,
            price: Number(price), // Multer sends body data as strings
            stock: 0,
            category,
            MainImage: mainImagePath,
            GalleryImages: galleryPaths
        });
        return SuccessResponse(res, {
            message: "Product created successfully",
            data: product
        });

    } catch (error: any) {
        throw new BadRequest(error.message || "Failed to create product");
    }
};


export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await ProductModel.find().populate('category parentCategory_Id');
        return SuccessResponse(res, {
            message: "Products fetched successfully",
            data: products
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }

};


export const getProductById = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            message: "Invalid ID format. Must be a 24-character hex string."
        });
    }
    const product = await ProductModel.findById(id).populate('category parentCategory_Id');
    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }
    return SuccessResponse(res, {
        message: "Product fetched successfully",
        data: product
    });
};

export const getProductsByCategory = async (req: Request, res: Response) => {
    try {

        const { categoryId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({
                message: "Invalid Category ID format. Must be a 24-character hex string."
            });
        }
        const products = await ProductModel.find({ category: categoryId }).populate('category parentCategory_Id');
        if (!products) {
            return res.status(404).json({
                message: "Category not found"
            });
        }
        if (products.length === 0) {
            return res.status(404).json({
                message: "No products found for this category"
            });
        }
        return SuccessResponse(res, {
            message: "Products fetched successfully",
            data: products
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }

};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid ID format. Must be a 24-character hex string."
            });
        }
        const product = await ProductModel.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        return SuccessResponse(res, {
            message: "Product deleted successfully",
            data: product
        });


    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // 1. Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        // 2. Fetch Product first (We need it to check old data)
        const product = await ProductModel.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const { name, description, price, category } = req.body;
        const files = (req as MulterRequest).files;

        // 3. Safe Image Updating
        // We use "?. " optional chaining to safely check if files exist

        // Update Main Image
        if (files && files['MainImage'] && files['MainImage'].length > 0) {
            // If there was an old image, delete it
            if (product.MainImage) {
                // Check if file exists then delete
                fs.unlink(product.MainImage, (err) => {
                    if (err) console.error("Failed to delete old image:", err);
                });
            }
            product.MainImage = files['MainImage'][0].path;
        }

        // Update Gallery
        if (files && files['GalleryImages'] && files['GalleryImages'].length > 0) {
            const newGalleryPaths = files['GalleryImages'].map(file => file.path);

            // OPTION A: Replace old gallery entirely
            product.GalleryImages = newGalleryPaths;

            // OPTION B: Append to existing gallery (Uncomment if preferred)
            // product.GalleryImages.push(...newGalleryPaths);
        }

        // 4. Update Text Fields (Handle Type Conversion!)
        if (name) product.name = name;
        if (description) product.description = description;
        if (category) product.category = category;

        // Critical: Convert string price to Number
        if (price) {
            const parsedPrice = Number(price);
            if (!isNaN(parsedPrice)) {
                product.price = parsedPrice;
            }
        }

        await product.save();

        // 5. Success Response
        // (Assuming you have SuccessResponse imported, otherwise use res.json)
        return SuccessResponse(res, {
            message: "Product updated successfully",
            data: product
        });

    } catch (error: any) {
        console.error(error); // Log error for debugging
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};