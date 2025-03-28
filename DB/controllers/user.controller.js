import { User } from "../models/user.model";
import bcrypt from 'bcrypt'

const generateJwt = async(user) =>{
    const token =await jwt.sign(
        user,
        secret,
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

    const existedUser = User.findOne({
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

    const user = User.create({
        username,
        email,
        password: bcrypt(password,10)
    })

    if(!user){
        return res.status(404).send({
            message:"Failed to create user",
        })
    }
      
    return res.status(200).send({
        message:"User created successfully",
        user:user
    })

}

export const loginUser = async(req,res)=>{
    const {username, email, password} = req.body();

    if(!username || !email || !password){
        res.status(400).send({
            message:"missing credentials"
        })
    }

    const user = User.findOne({
        $or:[
            {username},
            {email}
        ]
    })

    if(!user){
        res.status(400).send({
            message: "User not found"
        })
    }

    const hashedPassword = user.password;

    const validPassword = bcrypt .compare(password,hashedPassword);

    if(!validPassword){
        res.status(400).send({
            message: "Invalid Password"
        })
    }

    const token = generateJwt({
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

