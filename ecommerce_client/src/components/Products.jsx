import styled from "styled-components"
import Product from "./Product"
import { useState } from "react"
import { useEffect } from "react"
import axios from "axios"

const Container = styled.div`
    padding: 20px;
    display: flex;
    flex-wrap: wrap; /* Allow items to wrap to the next line */
    justify-content: space-around; /* Spread items out with space between */
    gap: 20px; /* Add some space between rows */
`;

const Products = ({cat, filters, sort}) => {
  console.log("filters: ", filters);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setfilteredProducts] = useState([]);
  console.log("im here");
  useEffect(() => {
    const getProducts = async ()=> {
      try {
        const res = await axios.get( cat ? `http://localhost:5000/api/products?category=${cat}` : "http://localhost:5000/api/products");
        setProducts(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    getProducts();
  },[cat]);


  useEffect(() => {
    cat && setfilteredProducts(
      products.filter(item=>
        Object.entries(filters).every(([key, value]) =>
          item[key].includes(value)
        )
        )
    )
  }, [products, cat, filters]);


  useEffect(() => {
    if ((sort === "newest")) {
      setfilteredProducts((prev) =>
        [...prev].sort((a,b) => a.createdAt - b.createdAt)
      );
    } else if ((sort === "asc")) {
      setfilteredProducts((prev) =>
        [...prev].sort((a,b) => a.price - b.price)
      );
    } else {
      setfilteredProducts((prev) =>
        [...prev].sort((a,b) => b.price - a.price)
      );
    }
  }, [sort]);

  return (
    <Container>
        {cat
          ? filteredProducts.map((item) => <Product item={item} key={item.id} />) 
          : products.slice(0,8).map((item) => <Product item={item} key={item.id} />)}
    </Container>
  );
};

export default Products