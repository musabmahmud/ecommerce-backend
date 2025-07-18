import express from "express";
import dotenv from 'dotenv';
import connectDB from "./Database/connectDB";
import authRoute from "./routes/auth";
import userRoute from "./routes/users";
import productRoute from "./routes/products";

import { errorHandler } from "./middlewares/error";
import cookieParser from 'cookie-parser';
import verifyToken from "./middlewares/verifyToken";
// import monggose from "mongoose"
const app = express();

dotenv.config();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send("Welcome to the E-commerce API of TS");
})

app.use('/api/auth/', authRoute)
app.use('/api/user/', verifyToken, userRoute)
app.use('/api/product/', verifyToken, productRoute)


app.use(errorHandler)

app.listen(port, () => {
    connectDB();
    console.log(`Server is running on port ${port}`);
})

