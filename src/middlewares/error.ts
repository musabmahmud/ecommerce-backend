import { NextFunction, Request, Response } from "express";

// const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
//     if (err instanceof CustomError) {
//         return res.status(err.statusCode).json({
//             message: err.message
//         })
//     }
//     return res.status(500).json({
//         message: "Internal Server Error"
//     })
// }import { NextFunction, Request, Response } from "express";

class CustomError extends Error {
    constructor(public statusCode: number, message: string) {
        super(message);
        // Maintain proper prototype chain
        Object.setPrototypeOf(this, CustomError.prototype);
        // Ensure the class name appears in logs
        this.name = 'CustomError';
    }
}

const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error('Error occurred:', err);

    // Handle CustomError instances
    if (err instanceof CustomError) {
        return res.status(err.statusCode).json({
            message: err.message,
            statusCode: err.statusCode
        });
    }

    // Handle generic Errors
    if (err instanceof Error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
            stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined
        });
    }

    // Handle completely unknown errors
    return res.status(500).json({
        message: "Internal Server Error",
        error: "An unknown error occurred"
    });
};

export { errorHandler, CustomError };