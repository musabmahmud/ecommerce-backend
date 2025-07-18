import { NextFunction, Request, Response } from "express";
import { CustomError } from "./error";
import jwt, { JwtPayload } from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    if (!token) {
        throw new CustomError(401, "You are Unauthorized, Please Login First");
    }
    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error('JWT_SECRET is missing!');
            throw new CustomError(500, "Server configuration error");
        }
        const decoded = jwt.verify(token, secret as string);
        req.userId = (decoded as JwtPayload)._id;
        console.log("verified token passed")
        next();
    }
    catch (error) {
        console.log(error)
        next(error)
    }
}

export default verifyToken;