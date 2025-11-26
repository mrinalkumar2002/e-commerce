import express from "express"
 import { register,login,logout } from "../Controller/auth.controller.js"


 const router=express.Router()

 router.post("/register",register) // POST /api/auth/register

 router.post("/login", login);   // POST /api/auth/login
 router.post("/logout", logout);



export default router;