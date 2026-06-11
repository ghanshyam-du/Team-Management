import User from "../model/user.model.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"


const handleRegister = async (req, res, next) => {

    try {
        let { name, department, role, email, password } = req.body;

        const present = await User.findOne({ where: { email } });

        if (present) {
            return res.status(409).json({ success: false, message: "Email is already in use!" });
        }

        const pass = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, pass);


        const newUser = new User({
            name,
            email,
            department,
            role,
            password: hashPassword,
        });

        await newUser.save();

        res.status(201).json({ success: true, message: "User registered successfully!" });

    } catch (error) {
      return res.status(400).json({error: "something went wrong :", details: error.message })

    }
}



const hanldeLogin = async (req, res, next) =>{
    try {
        let {email, password} =  req.body;

        const present = await User.findOne({email});
        console.log("login data", present);

        if(!present) {
           return  res.status(400).json({success: false, message: "User not found!"});
        }

        const match = await bcrypt.compare(password, present.password);
        console.log("match", match);
        
        if(!match){
           return res.status(400).json({success: false, message: "Password is incorrect"});
        }
         console.log("match", match);

        const token = jwt.sign(
            {id :present._id, role: present.role },
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
        );
        console.log("token", token);

       return res.status(200).json({success: true, message: "Login Successful", token});

    } catch (error) {
       return res.status(400).json({error: "something went wrong :", details: error.message });
        
    }
}



export {hanldeLogin, handleRegister};