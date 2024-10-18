import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { userRequest } from "../requestMethods";
import OrderDetails from "../components/OrderDetails";
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Container = styled.div`
    padding: 20px;
`;

const Title = styled.h1`
    font-weight: 300;
    text-align: center;
    margin-bottom: 20px;
`;

const OrderList = styled.ul`
    list-style: none;
    padding: 0;
`;

const OrderItem = styled.li`
    border: 1px solid #ddd;
    padding: 15px;
    margin-bottom: 10px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #f0f0f0;
    }
`;

const OrderInfo = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
`;

const OrderText = styled.p`
    margin: 0;
`;

const BackButton = styled.button`
    margin: 20px auto;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    border: none;
    border-radius: 5px;
    background-color: #00070f;
    color: white;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #323232;
    }
`;

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const user = useSelector((state) => state.user.currentUser);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                if (user) {
                    const token = JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.accessToken;
                    const res = await userRequest(token).get(`/orders/find/${user._id}`);
                    console.log(res.data);
                    setOrders(res.data);
                }
            } catch (err) {
                console.log(err);
            }
        };
        fetchOrders();
    }, [user]);

    const [selectedOrderId, setSelectedOrderId] = useState(null);

    const handleOrderClick = (orderId) => {
        setSelectedOrderId(orderId);
    };

    const handleBackHome = () => {
        navigate('/'); // Navigate back to the home page
    };

    return (
        <Container>
            {selectedOrderId ? (
                <>
                    <OrderDetails orderId={selectedOrderId} onBack={() => setSelectedOrderId(null)} />
                </>
            ) : (
                <>
                    <BackButton onClick={handleBackHome}>Back to Home</BackButton>
                    <Title>Your Orders</Title>
                    <OrderList>
                        {orders.map((order) => (
                            <OrderItem key={order._id} onClick={() => handleOrderClick(order._id)}>
                                <OrderInfo>
                                    <OrderText><b>Order #:</b> {order._id}</OrderText>
                                    <OrderText><b>Total:</b> ${order.amount}</OrderText>
                                    <OrderText><b>Date:</b> {new Date(order.createdAt).toLocaleDateString()}</OrderText>
                                </OrderInfo>
                            </OrderItem>
                        ))}
                    </OrderList>
                </>
            )}
        </Container>
    );
};

export default Orders;