import express, { NextFunction, Request, Response } from 'express';
import Order from '../models/Order';
import Address from '../models/Address';

const router = express.Router();



// Create Order
router.post('/create', async (req: Request, res: Response, next: NextFunction) => {
    try {
        // 1. Create address first
        const newAddress = new Address({
            user: req.body.user,
            street: req.body.address.street,
            city: req.body.address.city,
            phone: req.body.address.phone,
            zilla: req.body.address.zilla,
            zipCode: req.body.address.zipCode,
            country: req.body.address.country
        });

        const savedAddress = await newAddress.save();

        if (!savedAddress) {
            return res.status(400).json({ message: "Failed to create address" });
        }

        // 2. Create order with address reference
        const newOrder = new Order({
            user: req.body.user,
            products: req.body.products,
            totalAmount: req.body.totalAmount,
            address: savedAddress._id,
            status: 'pending',
            note: req.body.note
        });

        const savedOrder = await newOrder.save();

        if (!savedOrder) {
            return res.status(400).json({ message: "Failed to create order" });
        }
        
        // 3. Populate and return the complete order
        const completeOrder = await Order.findById(savedOrder._id)
            .populate('address')
            .populate('products.product');

        res.status(201).json({
            message: "Order created successfully",
            data: completeOrder
        });

    } catch (error) {
        next(error)
    }
})

export default router;