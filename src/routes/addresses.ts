import express, { Request, Response, NextFunction } from 'express';
import Address from '../models/Address';
import { ObjectId } from 'mongodb';
const router = express.Router();

router.post("/create", async (req: Request, res: Response, next: NextFunction) => {
    const newAddress = new Address(req.body);
    try {
        const savedAddress = await newAddress.save();
        res.status(201).json({
            message: "Address created successfully",
            data: savedAddress
        });
    }
    catch (error) {
        next(error);
    }
})

router.put("/update/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const savedAddress = await Address.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });

        if (!savedAddress) {
            return res.status(404).json({
                message: "Address not found"
            });
        }

        res.status(200).json({
            message: "Address updated successfully",
            data: savedAddress
        });
    }
    catch (error) {
        next(error);
    }
})

//Delete

router.delete("/delete/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deletedAddress = await Address.findByIdAndDelete(req.params.id);
        if (!deletedAddress) {
            return res.status(404).json({
                message: "Address not found"
            });
        }
        res.status(200).json({
            message: "Address deleted successfully",
            data: deletedAddress
        })
    }
    catch (e) {
        next(e);
    }
})

//Get All Addresses

router.get("/all/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const addresses = await Address.find({ user: req.params.id });
        if (!addresses) {
            return res.status(404).json({
                message: "No addresses found for this user"
            });
        }
        res.status(200).json({
            message: "Addresses fetched successfully",
            data: addresses
        });
    }
    catch (error) {
        next(error);
    }
})



//Get All Addresses

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const address = await Address.findById(new ObjectId(req.params.id));
        if (!address) {
            return res.status(404).json({
                message: "No address found"
            });
        }
        console.log(address)
        res.status(200).json({
            message: "Address fetched successfully",
            data: address
        });
    }
    catch (error) {
        next(error);
    }
})


export default router;