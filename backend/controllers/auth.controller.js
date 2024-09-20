import {User} from '../models/user.model.js';
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from '../utils/generateToken.js';

export async function signup(req,res){
    try{
        const{email,password,username}=req.body; //requesting credentials from the user

        if(!username|| !email || !password){
            return res.status(400).json({success:false,message:"All fields are required"});

        }

        //checking if email entered is valid
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        //throwing error for invalid email
        if(!emailRegex.test(email)){
            return res.status(400).json({success:false,message:"Invalid email"})
            // Error 400 (Bad Request) when calling server using POST method in MERN 
        }
        
        if(password.length<6){
            return res.status(400).json({success:false,message:"password must be atleast 6 characters"})
        }

        //linking the user model with authenticatiom
        const existingUserByEmail= await User.findOne({email:email})
        
        if(existingUserByEmail){
            return res.status(400).json({success:false,message:"Email already exists"})
        }

        const existingUserByUsername= await User.findOne({username:username})

        if(existingUserByUsername){
            return res.status(400).json({success:false,message:"Username already exists"})
        }
        const salt=await bcryptjs.genSalt(10);
        const hashedPassword=await bcryptjs.hash(password,salt);
        const PROFILE_PICS = ["/avatar1.png", "/avatar2.png", "/avatar3.png"];

		const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];
        const newUser=new User({
            email:email,
            password:hashedPassword,
            username:username,
            image,
        });

        
            generateTokenAndSetCookie(newUser.id,res);
            await newUser.save(); 
            return res.status(201).json({success:true,user:{
                ...newUser._doc,
                password: "" //removes password from the response
            },
           });
        
        
    }catch(error){
        console.group("error in signup controller",error.message);
        res.status(500).json({success:false,message:"Internal server error"})
    }
}
export async function login(req,res){
    try{
        const {email,password}=req.body;

        if(!email || !password){
            return res.status(400).json({success:false,message:"all fields are required"});
        }

        const user=await User.findOne({email:email})
        if(!user){
            return res.status(404).json({success:false,message:"Invalid Credentials"});
        }

        const isPasswordCorrect= await bcryptjs.compare(password,user.password);

        if(!isPasswordCorrect){
            return res.status(400).json({success:false,message:"Invalid credentials"});
        }
        generateTokenAndSetCookie(user.id,res);

        res.status(200).json({
            success:true,
            user: {
                ...user._doc,
                password:""
            }
        })
    }
    catch(error){
            console.log("error in login controller",error.message);
            res.status(500).json({success:false,message:"Internal server error"});
    }
}
export async function logout(req,res){
    try{
        res.clearCookie("jwt-netflix");
        res.status(200).json({success:true,message:"logged out successfully"});
    }catch(error){
        console.log("error in logout controller",error.message);
        res.status(500).json({success:false,message:"Internal Server Error"});
    }
}

export async function authCheck(req,res) {
    try{
        console.log("req.user:",req.user);
        res.status(200).json({success:true, user:req.user});
    }catch(error){
        console.log("Error in authCheck controller",error.message);
        res.status(500).json({success:false,message:"Internal server error"});
    }
}
