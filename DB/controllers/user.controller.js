import { User } from "../models/user.model.js";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"

const generateJwt = async(user) =>{
    const token =jwt.sign(
        user,
        process.env.token_secret,
        { expiresIn: '1hr'}
    )
    return token;
}

export const registerUser = async(req,res)=>{
   
    const {username,email,password} = req.body;
    
    if(!username || !email || !password){
        return res.status(404).send({
            message:"missing user data",
        })
    }

    const existedUser =await User.findOne({
        $or:[
            {username},
            {email}
        ]
    })

    if(existedUser){
        return res.status(400).send({
            message:"User already exist with this data"
        })
    }

    const user = await User.create({
        username,
        email,
        password:await bcrypt.hash(password,10)
    })

    if(!user){
        return res.status(404).send({
            message:"Failed to create user",
        })
    }
      
    return res.status(200).send({
        message:"User created successfully",
        user:{
            username: user.username,
            email: user.email
        }
    })

}

export const loginUser = async(req,res)=>{
    const {username, email, password} = req.body;

    if(!username || !email || !password){
        return res.status(400).send({
            message:"missing credentials"
        })
    }

    const user =await User.findOne({
        $or:[
            {username},
            {email}
        ]
    })

    if(!user){
        return res.status(400).send({
            message: "User not found"
        })
    }

    const hashedPassword = user.password;

    const validPassword =await bcrypt.compare(password,hashedPassword);

    if(!validPassword){
        return res.status(400).send({
            message: "Invalid Password"
        })
    }

    const token = await generateJwt({
        username: user.username,
        email: user.email
    });
   

    return res
        .status(200)
        .cookie("token",token,{
            httpOnly:true,
            secure:true
        })
        .send({
            message: "User loggedIn Successfully !",
            user: {
                username: user.username,
                email: user.email
            }
        })
}

