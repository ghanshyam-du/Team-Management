import mongoose from "mongoose";


const connectDB = () => {
    try {
        mongoose.connect(process.env.DB_URI)
        .then(()=>{console.log("Connected to database")})
        .catch((err)=>{console.log(err)});
        

    } catch (error) {
        console.log(error);
    }
}

export default connectDB;