import express from "express";
import {
  Addtocart,
  getCart,
  updateItemQuantity,
   removeItemFromCart
 
} from "../Controller/cart.controller.js";

import authMiddleware from "../Middleware/auth.js";
import auth from "../Model/auth.model.js";


const router = express.Router();

router.get("/",authMiddleware,getCart)

router.post("/add",authMiddleware, Addtocart);
router.put("/:productId", authMiddleware, updateItemQuantity); 
router.delete("/:productId", authMiddleware, removeItemFromCart);

export default router;

