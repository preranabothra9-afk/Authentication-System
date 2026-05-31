import User from "../models/User.js";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import { cookieOptions } from "../utils/cookieOptions.js";
import redisClient from "../config/redis.js";
import jwt from "jsonwebtoken";

export const registerUser = async(req, res) =>{
    try {
        const{name, email, password} = req.body;
        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(409).json({
                success:false,
                message:"User already exists!"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({name, email, password:hashedPassword});
        res.status(201).json({
            success:true,
            message:"User registered successfully!",
            user:{id:user._id, name:user.name, email:user.email}
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Internal server error"
        });
    }
}

export const loginUser = async(req, res) =>{
    try {
        const {name, email, password} = req.body;
        const user = await User.findOne({email});

        if(!user){
            return res.status(401).json({
                success:false,
                message:"Invalid Credentials"
            });
        }
        
        const isvalidPass = await bcrypt.compare(password, user.password);
        if(!isvalidPass){
            return res.status(401).json({
                success:false,
                message:"Invalid Credentials"
            });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        await redisClient.setEx(
            user._id.toString(),
            600,
            refreshToken,
        );
        res.cookie("accessToken", accessToken, cookieOptions);

        res.status(200).json({
            success:true,
            message:"Login successful",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

export const getProfile = async(req, res) =>{
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.status(200).json({
            success:true,
            user
        });

    } catch (error) {
        res.status(400).json({
            success:false,
            message:"Internal Server error"
        });
    }
};

export const refreshAccessToken = async (req,res)=>{
    try{
        const oldToken = req.cookies.accessToken;
        if(!oldToken){
            return res.status(401).json({
                success:false,
                message:"No Access Token"
            });
        }
        const decoded = jwt.decode(oldToken);
        if(!decoded){
            return res.status(401).json({
                success:false,
                message:"Invalid Token"
            });
        }
        const userId = decoded.id;
        const refreshToken = await redisClient.get(userId);

        if(!refreshToken){
            return res.status(401).json({
                success:false,
                message:"Refresh Token Expired"
            });
        }
        jwt.verify(
            refreshToken,
            process.env.REFRESH_SECRET
        );
        const user = await User.findById(userId);

        const newAccessToken = generateAccessToken(user);
        console.log("ACCESS TOKEN REFRESHED");
        console.log(new Date().toLocaleTimeString());

        res.cookie(
            "accessToken",
            newAccessToken,
            cookieOptions
        );

        res.status(200).json({
            success:true,
            message:"Access Token Refreshed"
        });

    }
    catch(error){

        res.status(401).json({
            success:false,
            message:"Refresh Failed"
        });
    }
};

export const logoutUser = async (req,res)=>{
    try{
        const token = req.cookies.accessToken;
        if(token){
            const decoded = jwt.decode(token);
            if(decoded?.id){
                await redisClient.del(decoded.id);
            }
        }
        res.clearCookie(
            "accessToken",
            {
                httpOnly:true,
                secure:false,
                sameSite:"strict",
                path:"/"
            }
        );

        return res.status(200).json({
            success:true,
            message:"Logout Successful"
        });

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Logout Failed"
        });
    }
};