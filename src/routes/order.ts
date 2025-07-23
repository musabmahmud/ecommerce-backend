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

//cancel order

router.delete('/cancel/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orderId = req.params.id;
        if (!orderId) {
            return res.status(400).json({ message: "Order ID is required" });
        }
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        if (order.status === 'cancelled') {
            return res.status(400).json({ message: "Order is already cancelled" });
        }
        order.status = 'cancelled';
        const updatedOrder = await order.save();
        if (!updatedOrder) {
            return res.status(400).json({ message: "Failed to cancel order" });
        }
        res.status(200).json({
            message: "Order cancelled successfully",
            data: updatedOrder
        })
    }
    catch (error) {
        next(error);
    }
})

//single order


router.get('/:userId/:orderId', async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
    const orderId = req.params.orderId;
    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }
    try {
        const order = await Order.find({ user: userId, _id: orderId }).populate('address').populate('products.product');
        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            })
        }
        return res.status(200).json({
            message: "Order found",
            data: order
        });
    }
    catch (error) {
        next(error);
    }
})
export default router;