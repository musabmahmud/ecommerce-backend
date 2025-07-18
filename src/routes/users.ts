import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User';
import { CustomError } from '../middlewares/error';
const router = express.Router();

router.put("/update/:userId", async (req: Request, res: Response, next: NextFunction) => {
    const password = req.body?.password;
    try {
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hashSync(password, salt);
            req.body.password = await bcrypt.hash(password, hashPassword);

            const user = await User.findById(req.params.userId);

            if (!user) {
                throw new CustomError(404, "User not found");
            }
            const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
                $set: {
                    name: user.name,
                    password: user.password
                },
            }, { new: true })

            res.status(200).json({
                message: "User Updated Successfully",
                data: updatedUser
            })
        }
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});


router.get("/:userId", async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId)
        if (!user) {
            throw new CustomError(404, "User not found");
        }
        res.status(200).json({
            message: "User fetched successfully",
            data: user
        });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
})

//delete user

router.delete("/delete/:userId", async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new CustomError(404, "User not found");
        }
        await user.deleteOne();
        res.status(200).json({
            message: "User deleted successfully",
            data: user
        })
    }
    catch (error) {
        console.log(error)
        next(error)
    }
})


export default router;