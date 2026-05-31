import jwt from "jsonwebtoken";

export const generateAccessToken = (user) =>{
    return jwt.sign(
        {
            id:user._id,
            email:user.email,
            role:user.role
        },
        process.env.ACCESS_SECRET,
        {
            expiresIn:"1m"
        }
    );
};

export const generateRefreshToken = (user) =>{
    return jwt.sign(
        {
            id:user._id
        },
        process.env.REFRESH_SECRET,
        {
            expiresIn:"10m"
        }
    );
};