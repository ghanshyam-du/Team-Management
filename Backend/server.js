import express from "express"
import dotenv from "dotenv"

const app = express();
dotenv.config();

const port  = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({extended: true}));



app.listen(port, ()=>{
  console.log(`Server is running on the port number ${port}`);
})
