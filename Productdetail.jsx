import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './Productdetail.css';
import { useDispatch} from 'react-redux'
import { addToCart } from '../redux/cartSlice';


function ProductDetail() {
  const { productId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch=useDispatch()
  const navigate=useNavigate()

  function handlecart(){
    dispatch(addToCart(data))

    navigate("/cart")

  }
  
  async function getData() {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`https://dummyjson.com/products/${productId}`);
      if (!response.ok) throw new Error('Failed to fetch data');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, [productId]);

  if (loading) return <p className="status">Loading product details...</p>;
  if (error) return <p className="status">Error: {error}</p>;
  if (!data) return <p className="status">Data Not Found</p>;

  return (
    <>
    <div>
        <Link to='/productlist' className='Back'>Back</Link>
    </div>
    <div className="product-container fade-in">

      <h2 className="product-title">{data.title}</h2>
      {data.images?.[0] && (
        <img
          src={data.images[0]}
          alt={data.title}
          className="product-image"
        />
      )}
      <p className="product-description">{data.description}</p>
      <p><strong>Price:</strong> ${data.price}</p>
      <p><strong>Category:</strong> {data.category}</p>
      <p><strong>Rating:</strong> {data.rating}</p>
      <p><strong>Brand:</strong> {data.brand}</p>
      {data.warrantyInformation && (
        <p><strong>Warranty:</strong> {data.warrantyInformation}</p>
      )}
      <div className="button-container">
        <button className="add-to-cart-btn" onClick={handlecart}>Add To Cart</button>
      </div>
    </div>
    </>
  );
}

export default ProductDetail;






