import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICategory extends Document {
    name: string,
    description: string
    parentCategory_Id?: Types.ObjectId
    createdAt: Date
}

const CategorySchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    parentCategory_Id: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: false
    },
}, {timestamps:true});

export default mongoose.model<ICategory>('Category', CategorySchema);