import Cart from "../Model/cart.model.js";
import mongoose from "mongoose";

function ensureUser(req, res) {
  if (!req.user || !req.user._id) {
    console.warn("Missing req.user in request");
    res.status(401).json({ message: "Unauthorized: missing token" });
    return false;
  }
  return true;
}
export async function getCart(req, res) {
  try {
    const cart = await Cart.findOne({ userId: req.user._id })
      .populate("items.productId", "title price images");

    if (!cart) {
      return res.status(200).json({
        message: "Cart is empty",
        cart: { items: [] }
      });
    }

    return res.status(200).json({
      message: "Cart fetched successfully",
      cart
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function Addtocart(req, res) {
  try {
    const { productId } = req.body;
    let quantity = Number(req.body.quantity ?? 1);

    // basic validation
    if (!productId) return res.status(400).json({ message: "productId is required" });
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid productId" });
    }
    if (!Number.isFinite(quantity) || quantity < 1) {
      quantity = 1; // enforce sensible default
    }
    // find or create cart
    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = new Cart({
        userId: req.user._id,
        items: [{ productId, quantity }]
      });
    } else {
      // find existing item and update numerically
      const item = cart.items.find(i => i.productId.toString() === productId);
      if (item) {
        item.quantity = Number(item.quantity || 0) + quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    }
    await cart.save();

    const updated = await Cart.findById(cart._id)
    .populate("items.productId", "title price images");

    return res.status(200).json({ message: "Cart updated", cart: updated });
  }
   catch (err) {
    console.error("Addtocart error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
}

export async function updateItemQuantity(req, res) {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid productId" });
    }
    const qty = Number(quantity);
    if (!Number.isFinite(qty) || qty < 1) {
      return res.status(400).json({ message: "Quantity must be integer >=1" });
    }
    //  1. Try to find the cart
    let cart = await Cart.findOne({ userId: req.user._id });
    //  2. If no cart exists, create one
    if (!cart) {
      cart = new Cart({
        userId: req.user._id,
        items: [{ productId, quantity: qty }]
      });
      await cart.save();
    } 
    else {
      // 3. Check if item exists in cart
      let item = cart.items.find(i => i.productId.toString() === productId);
      //  4. If item not found → add new item
      if (!item) {
        cart.items.push({ productId, quantity: qty });
      } else {
        //  5. If found → update qty
        item.quantity = qty;
      }
      await cart.save();
    }
    //  6. Populate before sending response
    const updated = await Cart.findById(cart._id)
      .populate("items.productId", "title price images");
    return res.status(200).json({
      message: "Quantity updated",
      cart: updated
    });

  } catch (err) {
    console.error("updateItemQuantity error:", err);
    return res.status(500).json({ message: err.message });
  }
}

export async function removeItemFromCart(req, res) {
   
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid productId" });
    }

    // Find the user's cart
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const originalLength = cart.items.length;
    cart.items = cart.items.filter(
      (i) => i.productId.toString() !== productId.toString()
    );

    if (cart.items.length === originalLength) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    await cart.save();

    const populated = await Cart.findById(cart._id)
      .populate("items.productId", "title price images");

    return res.status(200).json({ message: "Item removed", cart: populated });
    
  } 
  catch (err) {
    console.error("removeItemFromCart:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
}

