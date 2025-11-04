import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import { FaCartPlus, FaHome } from 'react-icons/fa';
import { useSelector } from 'react-redux';


function Header() {

  const cartItems=useSelector((state)=>state.cart.items)

  return (
    <>
    <div>
      <h1></h1>

    </div>
    <div className='navbar'>
      <nav>
        <div className="nav-links">
          <Link to='/'><FaHome /> Home</Link>
          <Link to='/cart'><FaCartPlus /> {cartItems.length}</Link>
        </div>
      </nav>
    </div>
    </>
  );
}

export default Header;

