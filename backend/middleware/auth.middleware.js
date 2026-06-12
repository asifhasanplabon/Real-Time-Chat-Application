import jwt from 'jsonwebtoken';
import User from "../models/User.model.js";

const protect = async(req,res,next) =>{
    try{
        const token = req.cookies?.token || req.header.authorizations?.replace("Bearer ","");

        if(!token){
            return res.status(401).json({
                message:"Please Login..."
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");

        if(!req.user){
            return res.status(401).json({
                message: "No user Found"
            });
        }
        next();
    } catch(error){
        return res.status(401).json({
            message:" The token is mismatched"
        });
    }
};

export default protect;