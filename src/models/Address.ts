import { count } from "console";
import mongoose, { Schema } from "mongoose";
import { AddressType } from "../types/types";

const AddressSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    phone: { type: String, required: true },
    zilla: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

const Address = mongoose.model<AddressType>("Address", AddressSchema)

export default Address;