import jwt from "jsonwebtoken"
import User from "../model/user.model.js"


const authenticate = async (req, res, next) =>{
   try {
    const authHeader = req.headers.authorization;

    console.log("header", authHeader);

    if(!authHeader) {
        return res.status(401).json({success: false, message: "Token required"});
    }

    const token = authHeader.split(" ")[1];
    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: err.name === "TokenExpiredError" ? "Token expired" : "Invalid token",
      });
    }

    const user = await User.findById(decoded.id);
    
    if(!user) {
      return res.status(401).json({success: false, message: "User not found"});
    }

    req.user = user;

    next();
   } catch (error) {
    res.status(400).json({success: false, message: "User not found", error});
     next(error);
   }
}

export default authenticate;