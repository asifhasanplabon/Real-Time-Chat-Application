import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

const generateToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const setCookieToken = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const register= async (req,res) =>{
    try{
        const {name,email,password } =req.body;

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                message: " The User EMail Already Exists.."
            });
        };

        const user= await User.create({name,email,password});
        const token = generateToken (user._id);

        setCookieToken(res,token);

        res.status(201).json({
            success: true,
            user:{
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
            },
        });
    }catch(error){
        res.status(401).json({
            message: error.message
        });
    }
};

export const login = async(req,res)=>{
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email}).select("+password");

        if(!user ||!(await user.matchPassword(password))) {
            return res.status(401).json({message: "E-Mail or Password Wrong..."});
        };

        await User.findByIdAndUpdate(user._id,{isOnline: true});
        const token = generateToken(user._id);
        setCookieToken(res,token);

        res.status(200).json({
            success: true,
            token,
            user:{
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                isOnline: true,
            },
        });
    }catch(error){
        res.status(200).json({
            message: error.message
        });
    }
};

export const logout = async(req,res) =>{
    try{
        await User.findByIdAndUpdate(req.user._id,{
            isOnline: false,
            lastSeen: Date.now(),
        });

        res.clearCookie("token");
        res.status(200).json({
            success: true,
            message: "Logout Successfully...."
        });
    }catch(error){
        res.status(500).json({
            message: error.message
        });
    }
};

export const getMe = async (req,res) =>{
    try {
        const user = await User.findById(req.user._id);
        res.status(200).json({
            success: true,user
        });
    } catch(error){
        res.status(500).json({message: error.message});
    }
};