import mongoose from "mongoose";
import { ProductType } from "../types/types";

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    images: [{ type: String, required: true }],
    color: [{ type: String, required: true }],
    size: [{ type: String, required: true }],
    category: { type: String, required: true },
    stock: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    brand: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

const Product = mongoose.model<ProductType>('Product', ProductSchema);

export default Product;