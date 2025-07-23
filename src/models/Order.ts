import mongoose, { Schema } from "mongoose";
import { OrderType } from "../types/types";


const OrderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    address: { type: Schema.Types.ObjectId, ref: "Address", required: true },
    status: { type: String, enum: ["pending", "processing", "shipped", "delivered", "cancelled"], default: "pending" },
    note: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})

const Order = mongoose.model<OrderType>('Order', OrderSchema);

export default Order;

//
// const OrderSchema = new Schema({
//     user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//     products: [{
//         product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
//         quantity: { type: Number, required: true }
//     }],
//     totalAmount: { type: Number, required: true },
//     phone: { type: Number, required: true },
//     street: { type: String, required: true },
//     city: { type: String, required: true },
//     zipCode: { type: String, required: true },
//     status: { type: String, enum: ["pending", "processing", "shipped", "delivered", "cancelled"], default: "pending" },
//     note: { type: String, required: false },
//     createdAt: { type: Date, default: Date.now }
// })

// const Order = mongoose.model<OrderType>('Order', OrderSchema);

// export default Order;