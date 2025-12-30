import FinancialAccountModel from "../models/FinancialAccount";
import { Request, Response } from "express";
import { BadRequest } from "../Errors/BadRequest";
import { SuccessResponse } from "../utils/response";
import mongoose from "mongoose";


export const createFinancialAccount = async (req: Request, res: Response) => {
        const { accountName, accountType, balance, accountNumber } = req.body;

        if (!accountName || !accountType || balance == null || !accountNumber) {
            throw new BadRequest("All fields are required");
        }

        const existingAccount = await FinancialAccountModel.findOne({ accountNumber });
        if (existingAccount) {
            throw new BadRequest("Account with this number already exists");
        }
        if (!['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'].includes(accountType)) {
            throw new BadRequest("Invalid account type");
        }

        const newAccount = new FinancialAccountModel({
            accountName,
            accountType,
            balance,
            accountNumber
        });

        const savedAccount = await newAccount.save();

        return SuccessResponse(res, {
            message: "Financial account created successfully",
            data: savedAccount
        });
};


export const getAllFinancialAccounts = async (req: Request, res: Response) => {
        const accounts = await FinancialAccountModel.find();
        return SuccessResponse(res, {
            message: "Financial accounts fetched successfully",
            data: accounts
        });
};

export const getFinancialAccountById = async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }
        const account = await FinancialAccountModel.findById(id);
        if (!account) {
            return res.status(404).json({ message: "Financial account not found" });
        }
        return SuccessResponse(res, {
            message: "Financial account fetched successfully",
            data: account
        });
};

export const updateFinancialAccount = async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }
        const account = await FinancialAccountModel.findById(id);

        if (!account) {
            throw new BadRequest("Financial account not found");
        }

        const { accountName, accountType, balance, accountNumber } = req.body;
        if (accountType && !['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'].includes(accountType)) {
            throw new BadRequest("Invalid account type");
        }
        
        if (balance) {
            const parsedBalance = Number(balance);
            if (!isNaN(parsedBalance)) {
                account.balance = parsedBalance;
            }else{
                throw new BadRequest("Balance must be a number");
            }
        }

        if (accountName) account.accountName = accountName;
        if (accountType) account.accountType = accountType;
        if (balance != null) account.balance = balance;
        if (accountNumber) account.accountNumber = accountNumber;

        const updatedAccount = await account.save();

        return SuccessResponse(res, {
            message: "Financial account updated successfully",
            data: updatedAccount
        });
};

export const deleteFinancialAccount = async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }
        const account = await FinancialAccountModel.findByIdAndDelete(id);
        if (!account) {
            throw new BadRequest("Financial account not found");
        }
        return SuccessResponse(res, {
            message: "Financial account deleted successfully",
            data: account
        });
};
