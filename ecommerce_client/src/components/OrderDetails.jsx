import { useEffect, useState } from "react";
import styled from "styled-components";
import { publicRequest, userRequest } from "../requestMethods";

const Container = styled.div`
    padding: 20px;
`;

const BackButton = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    font-weight: bold;
    color: #555;
    transition: color 0.3s;

    &:hover {
        color: #000;
    }
`;

const BackArrow = styled.span`
    margin-right: 5px;
    font-size: 18px;
`;

const Title = styled.h2`
    font-weight: 300;
    margin-bottom: 20px;
`;

const ProductList = styled.div`
    display: flex;
    flex-direction: column;
`;

const ProductItem = styled.div`
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 15px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const ProductDetails = styled.div`
    display: flex;
    flex-direction: column;
`;

const ProductImage = styled.img`
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 5px;
    margin-right: 15px;
`;

const OrderDetails = ({ orderId, onBack }) => {
    const [orderDetails, setOrderDetails] = useState(null);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const token = JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.accessToken;
                const res = await userRequest(token).get(`/orders/${orderId}`);
                setOrderDetails(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        if (orderId) {
            fetchOrderDetails();
        }
    }, [orderId]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const fetchedProducts = [];
                for (const product of orderDetails.products) {
                    const res = await publicRequest.get(`/products/find/${product._id}`);
                    const fetchedProduct = res.data;
                    fetchedProduct.quantity = product.quantity;
                    fetchedProducts.push(fetchedProduct);
                }
                setProducts(fetchedProducts);
            } catch (err) {
                console.log(err);
            }
        };
        if (orderDetails) {
            fetchProducts();
        }
    }, [orderDetails]);

    if (!orderDetails) return <p>Loading order details...</p>;

    return (
        <Container>
            <BackButton onClick={onBack}>
                <BackArrow>←</BackArrow>
                Back to Orders
            </BackButton>
            <Title><b>Order:</b> #{orderDetails._id}</Title>
            <p><b>Total:</b> ${orderDetails.amount}</p>
            <p><b>Date:</b> {new Date(orderDetails.createdAt).toLocaleDateString()}</p>
            <p><b>Address:</b> {orderDetails.address}</p>
            <p><b>Status:</b> {orderDetails.status}</p>
            <ProductList>
                {products.map(product => (
                    <ProductItem key={product._id}>
                        <ProductDetails>
                            <ProductImage src={product.img} alt={product.title} />
                            <div><b>Product:</b> {product.title}</div>
                            <div><b>Quantity:</b> {product.quantity}</div>
                            <div><b>Price:</b> ${product.price}</div>
                        </ProductDetails>
                    </ProductItem>
                ))}
            </ProductList>
        </Container>
    );
};

export default OrderDetails;