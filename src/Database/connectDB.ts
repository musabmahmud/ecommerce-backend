import mongoose from "mongoose";

const connectDB = async () => {
    // const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@simple-crud.k64iglw.mongodb.net/?retryWrites=true&w=majority&appName=simple-crud`;
    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@simple-crud.k64iglw.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=simple-crud`;
    try {
        await mongoose.connect(uri);
        console.log("Database connected successfully");
    }
    catch (e) {
        console.log(e)
    }
}

export default connectDB;