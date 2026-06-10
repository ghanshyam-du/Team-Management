import express from "express"
import dotenv from "dotenv"
import connectDB from "./src/config/connection.config.js";
import userAuth from "./src/routes/auth.routes.js";

const app = express();
dotenv.config();

const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', userAuth);


connectDB();

app.listen(port, () => {
    console.log(`Server is running on the port number ${port}`);
})


