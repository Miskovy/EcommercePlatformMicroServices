import mongoose ,{ Schema, Document, Types } from "mongoose";

export interface IFinancialAccount {
    accountName: string;
    accountType: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
    balance: number;
    accountNumber: string;
    createdAt: Date;
    updatedAt: Date;
}


export const FinancialAccountSchema = new mongoose.Schema({
    accountName: {
        type: String,
        required: true
    },
    accountType: {
        type: String,
        enum: ['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'],
        required: true
    },
    balance: {
        type: Number,
        required: true
    },
    accountNumber: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true });

export default mongoose.model<IFinancialAccount>('FinancialAccount', FinancialAccountSchema);