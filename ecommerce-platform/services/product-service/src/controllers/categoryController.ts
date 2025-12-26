import { Request, Response } from "express";
import { BadRequest } from "../Errors/BadRequest";
import Category from "../models/Category";
import { SuccessResponse } from "../utils/response";
import mongoose from "mongoose";


export const createCategory = async (req: Request, res: Response) => {
    const { name, description, parentCategory_Id } = req.body;
    if (!name || !description)
        throw new BadRequest("Name and Description are required fields");

    if (parentCategory_Id) {

        const parentCategory = await Category.findById(parentCategory_Id);
        if (!parentCategory)
            throw new BadRequest("Parent Category not found");

        const category = await Category.create({
            name,
            description,
            parentCategory_Id: parentCategory._id
        });

        return SuccessResponse(res, {
            message: "Category created successfully",
            data: category
        });

    } else {

        const category = await Category.create({
            name,
            description
        });
        return SuccessResponse(res, {
            message: "Category created successfully",
            data: category
        });

    }
};


export const getAllCategories = async (req: Request, res: Response) => {
    const categories = await Category.find().populate('parentCategory_Id');
    return SuccessResponse(res, {
        message: "Categories fetched successfully",
        data: categories
    });
};

export const getCategoryById = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            message: "Invalid ID format. Must be a 24-character hex string."
        });
    }
    const category = await Category.findById(id).populate('parentCategory_Id');
    if (!category)
        throw new BadRequest("Category not found");
    return SuccessResponse(res, {
        message: "Category fetched successfully",
        data: category
    });
};

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // 1. Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid ID format. Must be a 24-character hex string."
            });
        }

        // 2. Cascade Delete: Delete all children first
        // We use deleteMany to remove ANY category that lists this ID as its parent.
        // If no children exist, this returns { deletedCount: 0 } and does not error.
        const childrenResult = await Category.deleteMany({ parentCategory_Id: id });

        // 3. Delete the Parent Category
        const category = await Category.findByIdAndDelete(id);

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        // 4. Return Success
        return res.status(200).json({
            message: "Category deleted successfully",
            deletedChildrenCount: childrenResult.deletedCount, // Useful info for the frontend
            data: category
        });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error });
    }
};


export const updateCategory = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const category = await Category.findByIdAndUpdate(id);
    if (!category)
        throw new BadRequest("Category not found");
    category.name = name || category.name;
    category.description = description || category.description;
    await category.save();
    return SuccessResponse(res, {
        message: "Category updated successfully",
        data: category
    });

};