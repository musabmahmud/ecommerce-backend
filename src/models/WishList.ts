import mongoose, { Schema } from "mongoose";
import { WishListType } from "../types/types";


const WishListSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    products: [{
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true }
    }],
    createdAt: { type: Date, default: Date.now }
})

const WishList = mongoose.model<WishListType>("WishList", WishListSchema);

export default WishList;