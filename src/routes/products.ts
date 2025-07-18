import express, { Request, Response, NextFunction } from 'express';
import Product from '../models/Product';
import { CustomError } from '../middlewares/error';

const router = express.Router();

//create product
router.post("/create", async (req: Request, res: Response, next: NextFunction) => {
    const newProduct = new Product(req.body);
    try {
        const savedProduct = await newProduct.save();
        res.status(201).json({
            message: "Product created Successfully",
            data: savedProduct
        })
    }
    catch (error) {
        next(error);
    }
})

//search
router.get("/search/:query", async (req: Request, res: Response, next: NextFunction) => {
    const query = req.params.query
    try {
        const products = await Product.find({
            $or: [
                { name: { $regex: new RegExp(query, 'i') } },
                { category: { $regex: new RegExp(query, 'i') } },
                { description: { $regex: new RegExp(query, 'i') } },
            ]
        })
        res.status(200).json({
            message: products.length ? "Successfully Products Searched by Query!" : "No Products Found",
            data: products ? products : []
        })
    }
    catch (error) {
        next(error);
    }
})

//Get All
router.get("/all", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await Product.find();
        res.status(200).json({
            message: products.length ? "Products Fetch Successfully!" : "No Products Found",
            data: products ? products : []
        })
    }
    catch (error) {
        next(error);
    }
})

//Single Product
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await Product.findById({ _id: req.params.id });
        res.status(200).json({
            message: product ? "Product Fetch Successfully!" : "No Product Found",
            data: product ? product : null
        })
    }
    catch (error) {
        next(error);
    }
})


//Filter By Category
router.get("/category/:query", async (req: Request, res: Response, next: NextFunction) => {
    const query = req.params.query
    try {
        const products = await Product.find({
            $or: [
                { category: { $regex: new RegExp(query, 'i') } }
            ]
        })
        res.status(200).json({
            message: products.length ? "Successfully Products Searched by Query!" : "No Products Found",
            data: products ? products : []
        })
    }
    catch (error) {
        next(error);
    }
})

// router.put("/update/:id")
//create product
router.put("/update/:id", async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const updateProduct = new Product(req.body);
    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

        if (!updatedProduct) {
            throw new CustomError(404, "Product not found");
        }

        res.status(201).json({
            message: "Product Updated Successfully",
            data: updatedProduct
        })
    }
    catch (error) {
        next(error);
    }
})



export default router;