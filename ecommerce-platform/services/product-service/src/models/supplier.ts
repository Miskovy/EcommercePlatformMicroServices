import mongoose ,{ Schema, Document, Types } from "mongoose";

export interface ISupplier extends Document {
    name: string;
    companyName: string;
    contactEmail: string;
    phoneNumber: string;
    address: string;
    createdAt: Date;
    updatedAt: Date;
}

export const SupplierSchema: Schema = new Schema({
    name: { type: String, required: true },
    companyName: { type: String, required: true },
    contactEmail: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model<ISupplier>('Supplier', SupplierSchema);