import mongoose ,{ Schema, Document, Types } from "mongoose";

export interface IPurchase extends Document {
    productId: Types.ObjectId;
    supplierId: Types.ObjectId;
    quantity: number;
    totalPrice: number;
    receiptImage: string;
    financialAccountId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export const PurchaseSchema: Schema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    supplierId: {
        type: Schema.Types.ObjectId,
        ref: 'Supplier',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    receiptImage: {
        type: String,
        required: true
    },
    financialAccountId: {
        type: Schema.Types.ObjectId,
        ref: 'FinancialAccount',
        required: true
    }
}, { timestamps: true });
export default mongoose.model<IPurchase>('Purchase', PurchaseSchema);