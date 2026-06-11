import jwt from "jsonwebtoken"
import User from "../model/user.model.js"


const authenticate = async (req, res, next) =>{
   try {
    const authHeader = req.body.authrization;

    if(!authHeader) {
        return res.status(401).json({success: false, message: "Token required"});
    }

    const token = authHeader.split(" ")[1];

    try {
    let  decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: err.name === "TokenExpiredError" ? "Token expired" : "Invalid token",
      });
    }

    const user = await User.findById(decode.id);
    
    if(!user) {
      return res.status(401).json({success: false, message: "User not found"});
    }

    req.user = user;

    next();
   } catch (error) {
     next(error);
   }
}

export default authenticate;