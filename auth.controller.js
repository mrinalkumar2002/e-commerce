import mongoose from "mongoose"
import auth from "../Model/auth.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

 export async function  register(req,res) {
    try{
    const {email,password}=req.body      //check where the eamil and password is present or not
    if(!email || !password){
        res.status(400).json({
            message:"Email and Password is required"
        })
    }

    const exist = await auth.findOne({email})    // Check existing user
    if(exist){
        res.status(400).json({message:"Email already exist"})
    }

    const hasspassword= await bcrypt.hash(password,10)

    const user= new auth({     // create a new user
        email,
        password:hasspassword
    })
     await user.save();       //save user in database

    return res.status(201).json({
      message: "User registered successfully",
      userId: user._id
    });

    }
    catch(error){
        res.status(500).json({
            message:"Unavailable to Register"  //handle error
        })
    }


}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and Password are required" });
    }

    // 2. Check user exists
    const user = await auth.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 3. Compare password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 4. Create JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "default_secret_key",
      { expiresIn: "7d" }
    );

    // 5. Success response
    return res.status(200).json({
      message: "Login successful",
      token,
      userId: user._id
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({
      message: error.message || "Problem in Loginning"
    });
  }
}

export function logout(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.status(200).json({ message: "Logged out successfully" });
}


