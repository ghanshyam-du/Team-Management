import express from "express"
import dotenv from "dotenv"
import connectDB from "./src/config/connection.config.js";
import userAuth from "./src/routes/auth.routes.js";
import teamRoutes from "./src/routes/team.routes.js";
import userRoutes from "./src/routes/user.routes.js";

const app = express();
dotenv.config();

const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use('/api/auth', userAuth);
app.use("/api/users", userRoutes);
app.use("/api/team", teamRoutes);


connectDB();

app.listen(port, () => {
    console.log(`Server is running on the port number ${port}`);
})


