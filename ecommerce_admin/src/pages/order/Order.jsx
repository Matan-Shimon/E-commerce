import { useLocation } from "react-router-dom"; // To get the order ID from the URL
import "./order.css"; // Import styling for the order
import { useSelector } from "react-redux"; // To access the Redux state
import { useEffect, useState } from "react"; // For managing component state
import { publicRequest } from "../../requestMethods";

export default function Order() {
  const location = useLocation();
  const orderId = location.pathname.split("/")[2]; // Extract the order ID from the URL
  const order = useSelector((state) => state.order.orders.find(
    (order) => order._id === orderId
  )); // Find the order in the Redux state

  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = [];
        for (const product of order.products) {
          const res = await publicRequest.get(`/products/find/${product.productId}`);
          const fetchedProduct = res.data;
          fetchedProduct.quantity = product.quantity;
          fetchedProducts.push(fetchedProduct);
        }
        setProducts(fetchedProducts);
      } catch (err) {
        console.error(err);
      }
    };
    if (order) {
      fetchProducts();
    }
  }, [order]);

  if (!order) return <p>Loading order details...</p>;

  return (
    <div className="order">
      <div className="orderTitleContainer">
        <h1 className="orderTitle">Order Details</h1>
      </div>
      <div className="orderTop">
        <div className="orderInfoContainer">
          <div className="orderInfoItem">
            <span className="orderInfoKey">Order ID:</span>
            <span className="orderInfoValue">{order._id}</span>
          </div>
          <div className="orderInfoItem">
            <span className="orderInfoKey">User ID:</span>
            <span className="orderInfoValue">{order.userId}</span>
          </div>
          <div className="orderInfoItem">
            <span className="orderInfoKey">Amount:</span>
            <span className="orderInfoValue">${order.amount}</span>
          </div>
          <div className="orderInfoItem">
            <span className="orderInfoKey">Address:</span>
            <span className="orderInfoValue">{order.address}</span>
          </div>
          <div className="orderInfoItem">
            <span className="orderInfoKey">Status:</span>
            <span className="orderInfoValue">{order.status}</span>
          </div>
        </div>
      </div>
      <div className="orderBottom">
        <h2 className="orderProductsTitle">Products in this Order:</h2>
        <ul className="productList">
          {products?.map((product) => (
            <li key={product.productId} className="productItem">
              <img src={product.img} alt={product.title} className="productImage"/>
              <div className="productDetails">
                <div className="orderInfoItem">
                  <span className="orderInfoKey">Product:</span>
                  <span className="orderInfoValue">{product.title}</span>
                </div>
                <div className="orderInfoItem">
                  <span className="orderInfoKey">Quantity:</span>
                  <span className="orderInfoValue">{product.quantity}</span>
                </div>
                <div className="orderInfoItem">
                  <span className="orderInfoKey">Price:</span>
                  <span className="orderInfoValue">${product.price}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}