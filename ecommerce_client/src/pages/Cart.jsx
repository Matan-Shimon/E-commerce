import styled from "styled-components"
import Navbar from "../components/Navbar"
import Announcement from "../components/Announcement"
import Footer from "../components/Footer"
import Add from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';
import { mobile } from "../responsive"
import { useSelector } from "react-redux";
import StripeCheckout from "react-stripe-checkout";
import { useEffect, useState } from "react";
import { publicRequest, userRequest } from "../requestMethods";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { deleteProduct, resetCart } from "../redux/cartRedux";
import Delete from '@mui/icons-material/Delete';

console.log("hel")
console.log(process.env);

const KEY = process.env.REACT_APP_STRIPE_KEY;
console.log("first")
// console.log("Stripe Key:", KEY);
console.log(process.env.REACT_APP_STRIPE_KEY)

const Container = styled.div``
const Wrapper = styled.div`
    padding: 20px;
    ${mobile({padding: "10px"})}
`
const Title = styled.h1`
    font-weight: 300;
    text-align: center;
`
const Top = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
`

const TopButton = styled.button`
    padding: 10px;
    font-weight: 400; // Match font weight to TopText
    font-size: 14px; // Adjust font size to match TopText, change as necessary
    cursor: pointer;
    background-color: transparent; // Remove background
    color: black; // Set text color to match TopText
    border: none; // Remove border
    text-decoration: underline; // Add underline to match TopText
    margin-left: -20px; // Adjust left margin as needed
    transition: color 0.3s; // Optional transition for hover effect

    &:hover {
        color: gray; // Change color on hover (optional)
    }
`;



const TopTexts = styled.div`
    ${mobile({display: "none"})}
`

const TopText = styled.span`
    text-decoration: underline;
    cursor: pointer;
    margin: 0px 10px;
`

const Bottom = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;  // Allow wrapping of children
    ${mobile({flexDirection: "column"})}
`;
const Info = styled.div`
    flex: 3;
`
const Product = styled.div`
    display: flex;
    justify-content: space-between;
    ${mobile({flexDirection: "column"})}
`;

const DeleteButton = styled.button`
    border: none;
    background: transparent;
    cursor: pointer;
    color: red;
`;
const ProductDetails = styled.div`
    flex: 2;
    display: flex;
    margin-bottom: 20px; // Add space below each product
`;

const Image = styled.img`
    width: 150px;  // Set a fixed width
    height: 150px; // Set a fixed height
    object-fit: cover; // Maintain aspect ratio and cover the area
`;

const Details = styled.div`
    padding: 2px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
`
const ProductName = styled.span``
const ProductId = styled.span``
const ProductColor = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: ${(props) => props.color};
    border: 2px solid black;  // Add a black border
    padding: 2px;  // Add padding to wrap the color with a border
    box-sizing: border-box;  // Ensure the padding doesn't affect the size
`
const ProductSize = styled.span``

const PriceDetails = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

const ProductAmountContainer = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 20px;
`
const ProductAmount = styled.div`
    font-size: 24px;
    margin: 5px;
    ${mobile({margin: "5px 15px"})}
`
const ProductPrice = styled.div`
    font-size: 30px;
    font-weight: 200;
    ${mobile({marginBottom: "20px"})}
`

const Hr = styled.hr`
    background-color: #eee;
    border: none;
    height: 1px;
`

const Summary = styled.div`
    flex: 1;
    border: 0.5px solid lightgray;
    border-radius: 10px;
    padding: 20px;
    height: fit-content; 
    overflow: hidden; 

    // Media query for smaller devices
    @media (max-width: 768px) {
        padding: 15px; // Adjust padding for smaller screens
    }
`;

const SummaryTitle = styled.h1`
    font-weight: 200;
`
const SummaryItem = styled.div`
    margin: 15px 0px; // Reduce margin for better fit
    display: flex;
    justify-content: space-between;
    font-weight: ${props=>props.type === "total" && "500"};
    font-size: ${props=>props.type === "total" && "24px"};
`;
const SummaryItemText = styled.span``
const SummaryItemPrice = styled.span``
const Button = styled.button`
    width: 100%;
    padding: 10px;
    background-color: black;
    color: white;
    font-weight: 600;
    cursor: pointer;
    margin-top: 10px; // Add margin for spacing
`;

const Cart = () => {
    const cart = useSelector(state => state.cart);
    const user = useSelector(state => state.user);
    const [stripeToken, setStripeToken] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onToken = (token) => {
        setStripeToken(token);
    }

    const handleDelete = (productId) => {
        dispatch(deleteProduct(productId)); // Dispatch the removeProduct action
    };

    useEffect(() => {
        const makeRequest = async () => {
            try {
                const token = JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.accessToken;
                const res = await userRequest(token).post("/checkout/payment", {
                    tokenId: stripeToken.id,
                    amount: cart.total * 100
                })
                console.log(cart.products);
                alert("Payment succesfull!");
                console.log(user.currentUser.accessToken);
                console.log("address\n", user.address);
                const res2 = await userRequest(token).post("/orders/", {
                    products: cart.products,
                    amount: cart.total,
                    address: user.currentUser.address,
                    userId: user.currentUser._id
                });
                console.log(res.data);
                dispatch(resetCart());
                navigate('/orders');
            } catch (err) {
                console.log(err);
            }
        }
        stripeToken && makeRequest();
    }, [stripeToken, cart.total, navigate]);
    

    return (
        <Container>
            <Navbar/>
            <Announcement/>
            <Wrapper>
                <Title>YOUR BAG</Title>
                <Top>
                    <TopButton>
                        <Link to="/" style={{color: "black"}}>
                            CONTINUE SHOPPING
                        </Link>
                    </TopButton>
                    <TopTexts>
                        <TopText>Shopping Bag ({cart.products.length})</TopText>
                        <TopText>Your Wishlist (0)</TopText>
                    </TopTexts>
                </Top>
                <Bottom>
                    <Info>
                        {cart.products.map((product) => (
                        <Product key={product._id}>
                            <ProductDetails>
                                <Image src={product.img} />
                                <Details>
                                    <ProductName><b>Product:</b> {product.title} </ProductName>
                                    <ProductId><b>Id:</b> {product._id} </ProductId>
                                    <ProductColor color={product.color} />
                                    <ProductSize><b>Size:</b> {product.size} </ProductSize>
                                </Details>
                            </ProductDetails>
                            <PriceDetails>
                                <ProductAmountContainer>
                                    <Add/>
                                    <ProductAmount> {product.quantity} </ProductAmount>
                                    <Remove/>
                                </ProductAmountContainer>
                                <ProductPrice>$ {product.price * product.quantity} </ProductPrice>
                            </PriceDetails>
                            <Delete style={{ cursor: 'pointer', color: 'red' }} onClick={() => handleDelete(product._id)} />
                        </Product>
                        ))}
                        <Hr/>
                    </Info>
                    <Summary>
                        <SummaryTitle>ORDER SUMMARY</SummaryTitle>
                        <SummaryItem>
                            <SummaryItemText>Subtotal</SummaryItemText>
                            <SummaryItemPrice>$ {cart.total}</SummaryItemPrice>
                        </SummaryItem>
                        <SummaryItem>
                            <SummaryItemText>Estimated Shipping</SummaryItemText>
                            <SummaryItemPrice>$ 5.90</SummaryItemPrice>
                        </SummaryItem>
                        <SummaryItem>
                            <SummaryItemText>Shipping Discount</SummaryItemText>
                            <SummaryItemPrice>$ -5.90</SummaryItemPrice>
                        </SummaryItem>
                        <SummaryItem type="total">
                            <SummaryItemText>Total</SummaryItemText>
                            <SummaryItemPrice>$ {cart.total}</SummaryItemPrice>
                        </SummaryItem>
                        <StripeCheckout
                            name="Matan Shop"
                            image="https://marketplace.canva.com/EAFauoQSZtY/1/0/1600w/canva-brown-mascot-lion-free-logo-qJptouniZ0A.jpg"
                            billingAddress
                            shippingAddress
                            description = {`Your total is $${cart.total}`}
                            amount={cart.total*100}
                            token={onToken}
                            stripeKey={KEY}
                        >
                            <Button>CHECKOUT NOW</Button>
                        </StripeCheckout>
                    </Summary>
                </Bottom>
            </Wrapper>
            <Footer/>
        </Container>
      )
}

export default Cart