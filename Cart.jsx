import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './Cart.css';
import { increaseQty, decreaseQty, removeFromCart } from '../redux/cartSlice';
import { Link, useNavigate } from 'react-router-dom';

function Cart() {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate=useNavigate()
  function handleShopping(){
    navigate('/checkout')
  }

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="cart-container">
      <div className='back'>
        <Link to='/productlist'>Back</Link>
      </div>
      <h2>Cart Items</h2>

      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty 🛒</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div className="cart-item" key={item.id}>
              {item.images?.[0] && (
                <img src={item.images[0]} alt={item.title} className="product-image"  />
              )}

              <div className="cart-details">
                <p>
                  <strong>Title:</strong> {item.title}
                </p>
                <p>
                  <strong>Price:</strong> ${item.price}
                </p>
              </div>

              <div className="qty-controls">
                <button
                  className="decrease-button"
                  onClick={() => dispatch(decreaseQty(item))}
                >
                  −
                </button>
                <p>
                  <strong>Qty:</strong> {item.quantity}
                </p>
                <button
                  className="increase-button"
                  onClick={() => dispatch(increaseQty(item))}
                >
                  +
                </button>

              </div>
              <div className='remove'>
                <button onClick={()=>dispatch(removeFromCart(item))}>Remove Item</button>
              </div>
              
            </div>
            
          ))}

     
          <div className="cart-total">
            <h3>Total: ${total.toFixed(2)}</h3>
          </div>
          <div className='order-placed'>
            <button className='placed' onClick={handleShopping}>Next</button>

          </div>
        </>
      )}
    </div>
  );
}

export default Cart;




