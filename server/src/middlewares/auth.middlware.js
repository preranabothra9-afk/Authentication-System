import jwt from "jsonwebtoken";

export const authenticate =(req,res,next)=>{
    try{
        const token = req.cookies.accessToken;
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Access Token Missing"
            });
        }
        const decoded = jwt.verify(
            token,
            process.env.ACCESS_SECRET
        );
        req.user = decoded;
        next();
    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:"Invalid or Expired Token"
        });
    }
};