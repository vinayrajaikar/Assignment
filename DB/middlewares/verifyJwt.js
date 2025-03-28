import jwt from "jsonwebtoken"
import { User } from "../models/user.model";

const verifyJwt = async(req,next) =>{
    try{
        const token = req.cookies.token;

        if(!token){
            res.status(401).send({
                message: "token not found in cookie"
            })
        }

        const decodedToken = jwt.verify(token,process.env.token_secret);

        if(!decodedToken){
            res.status(401).send({
                message: "Invalid token"
            }) 
        }

        const user = await User.findById(decodedToken._id).select("-password");

        if(!user){
            res.status(401).send({
                message: "user not found by token"
            }) 
        }

        req.user=user;

        next();
    }
    catch(error){
        res.status(401).send({
            message:"Error Verifying Jwt" || error.message
        })
    }
}