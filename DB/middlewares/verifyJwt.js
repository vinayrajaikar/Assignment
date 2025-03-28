import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

export const verifyJwt = async(req,res,next) =>{
    try{
        const token =await req?.cookies.token;

        if(!token){
            return res.status(401).send({
                message: "token not found in cookie"
            })
        }

        const decodedToken = jwt.verify(token,process.env.token_secret);

        if(!decodedToken){
            return res.status(401).send({
                message: "Invalid token"
            }) 
        }

        const user = await User.findOne({
            username: decodedToken.username
        }).select("-password");

        if(!user){
            return res.status(401).send({
                message: "user not found by token"
            }) 
        }

        req.user=user;

        next();
    }
    catch(error){
        return res.status(401).send({
            message:"Error Verifying Jwt" || error.message
        })
    }
}