import React, { useEffect, useState } from 'react';
import { GoSearch } from "react-icons/go";
import './ProductList.css';
import { useNavigate } from 'react-router-dom';


function ProductList() {
  const [data, setData] = useState([]);
  const[filtered,setfiltered]=useState([])
  const navigate=useNavigate()

  function handleDetail(productId){
    navigate(`/productdetail/${productId}`)
  }
  

  async function getData() {
    try {
      const response = await fetch('https://dummyjson.com/products');
      const result = await response.json();
      setData(result.products);
      setfiltered(result.products)
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  function handlesearch(e){
    const text=e.target.value.toLowerCase()

    const filteredData=data.filter((item)=>{
        return(
        item.title.toLowerCase().includes(text)||
        item.description.toLowerCase().includes(text)||
        item.category.toLowerCase().includes(text)
        )
        
    })
    setfiltered(filteredData)
  }

  return (
    <>
    <div className='search'>
       <GoSearch/><input placeholder='enter the product' onChange={handlesearch} />
    </div>

    <div className="product-list">
      {filtered.length > 0 ? (
        filtered.map((product) => (
          <div className="product-card" key={product.id} onClick={() => handleDetail(product.id)}>
            <img src={product.images[0]} alt={product.title} />
            <h3>{product.title}</h3>
            <p>{product.description}</p>
          </div>
        ))
      ) : (
        <p>Data not found</p>
      )}
    </div>
    </>
  );
}

export default ProductList;

