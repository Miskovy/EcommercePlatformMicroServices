import mongoose ,{ Schema, Document, Types } from "mongoose";

export interface IProduct extends Document{
    name: string,
    description: string,
    price: number,
    stock: number,
    category: Types.ObjectId,
    createdAt: Date
}


const ProductSchema: Schema = new Schema({
    name: {type: String , required: true},
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true  
    },
    stock:{
        type: Number,
        required: true,
        default:0
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
}, {timestamps:true});

export default mongoose.model<IProduct>('Product', ProductSchema);