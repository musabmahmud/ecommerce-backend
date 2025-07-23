import express, { NextFunction, Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import { CustomError } from '../middlewares/error';
import jwt, { JwtPayload } from 'jsonwebtoken'

const router = express.Router();

//Register route
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body;
        const exisitingUser = await User.findOne({ email });
        if (exisitingUser) {
            throw new CustomError(400, "User already exists with this email");
        }
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            name,
            email,
            password: hashPassword
        })

        const savedUser = await newUser.save();

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error('JWT_SECRET is missing!');
            throw new CustomError(500, "Server configuration error");
        }

        const token = jwt.sign({ _id: savedUser._id }, secret, { expiresIn: "7d" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        }).status(201).json({
            data: savedUser,
            message: "User registered successfully"
        })
    }
    catch (error) {
        next(error);
    }
})


router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        // Input validation
        if (!email || !password) {
            throw new CustomError(400, "Email and password are required");
        }

        const user = await User.findOne({ email });
        if (!user) {
            throw new CustomError(404, "User not found");
        }

        const match = await bcrypt.compare(password, user.password);
        console.log('Password match result:', match);

        if (!match) {
            throw new CustomError(400, "Invalid credentials");
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error('JWT_SECRET is missing!');
            throw new CustomError(500, "Server configuration error");
        }

        const token = jwt.sign({ _id: user._id }, secret, { expiresIn: "7d" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        }).status(200).json({
            message: "Login Successful",
            user: {
                _id: user._id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        next(error);
    }
});


router.get('/logout', async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 0,
        }).status(200).json({
            message: "Logout Successful"
        })
    }
    catch (e) {
        console.log(e)
        next(e);
    }
})

// router.get('/refetch', async(req: Request, res: Response, next: NextFunction)=>{
//     const token = req.cookies.token;
//     try{
//         const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
//         const id = (decoded as JwtPayload)._id;
//         const user = await User.findById(id);
//         res.status(200).json({
//             message: "User get Successful",
//             data: {
//                 _id: user?._id,
//                 name: user?.name,
//                 email: user?.email
//             }
//         });
//     }
//     catch(e){
//         console.log(e)
//         next(e);
//     }
// })

export default router;