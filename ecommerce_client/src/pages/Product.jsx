import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Announcement from '../components/Announcement';
import NewsLetter from '../components/NewsLetter';
import Footer from '../components/Footer';
import styled from 'styled-components';
import Add from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';
import { mobile } from '../responsive';
import { useLocation } from 'react-router-dom';
import { publicRequest } from '../requestMethods';
import { addProduct } from '../redux/cartRedux';
import { useDispatch } from 'react-redux';

const Container = styled.div``;

const IconWrapper = styled.div`
    cursor: pointer;
`;

const Wrapper = styled.div`
    padding: 50px;
    display: flex;
    ${mobile({ padding: "10px", flexDirection: "column" })}
`;

const ImgContainer = styled.div`
    flex: 1;
`;

const Image = styled.img`
    width: 300px; /* Fixed width */
    height: 300px; /* Fixed height */
    object-fit: cover; /* Maintain aspect ratio */
    ${mobile({ width: "200px", height: "200px" })} /* Responsive adjustments */
`;

const InfoContainer = styled.div`
    flex: 1;
    padding: 0px 20px; /* Reduced padding to shift text left */
    text-align: left; /* Align text to the left */
    ${mobile({ padding: "10px", textAlign: "left" })} /* Ensure mobile text is also left-aligned */
`;

const Title = styled.h1`
    font-weight: 200;
    margin: 10px 0; /* Adjust margin to bring it closer to the image */
`;

const Desc = styled.p`
    margin: 10px 0; /* Adjust margin to bring it closer to the image */
`;

const Price = styled.div`
    font-weight: 100;
    font-size: 40px;
    margin: 10px 0; /* Adjust margin to bring it closer to the image */
`;

const FilterContainer = styled.div`
    width: 50%;
    margin: 30px 0px;
    display: flex;
    justify-content: space-between;
    ${mobile({ width: "100%" })}
`;

const Filter = styled.div`
    display: flex;
    align-items: center;
`;

const FilterTitle = styled.span`
    font-size: 20px;
    font-weight: 100;
`;

const FilterColor = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: ${props => props.color};
    margin: 0px 5px;
    cursor: pointer;
    border: 2px solid ${props => props.isSelected ? 'black' : 'gray'};
    padding: 2px;
    box-sizing: border-box;
`;

const FilterSize = styled.select`
    margin-left: 10px;
    padding: 5px;
`;

const FilterSizeOption = styled.option``;

const AddContainer = styled.div`
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    ${mobile({ width: "100%" })}
`;

const AmountContainer = styled.div`
    display: flex;
    align-items: center;
    font-weight: 700;
`;

const Amount = styled.span`
    width: 30px;
    height: 30px;
    border-radius: 10px;
    border: 1px solid teal;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0px 5px;
`;

const Button = styled.button`
    padding: 15px;
    border: 2px solid teal;
    background-color: white;
    cursor: pointer;
    font-weight: 500;

    &:hover {
        background-color: #f8f4f4;
    }
`;

const Product = () => {
    const location = useLocation();
    const id = location.pathname.split("/")[2];
    const [product, setProduct] = useState({});
    const [quantity, setQuantity] = useState(1);
    const [color, setColor] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [size, setSize] = useState("");
    const dispatch = useDispatch();

    useEffect(() => {
        const getProduct = async () => {
            try {
                const res = await publicRequest.get("/products/find/" + id);
                setProduct(res.data);
                setSize(res.data.size[0]);
                setColor(res.data.color[0]);
                setSelectedColor(res.data.color[0]);
            } catch (err) {
                console.log(err);
            }
        };
        getProduct();
    }, [id]);

    const handleQuantity = (type) => {
        if (type === "dec") {
            if (quantity > 1) {
                setQuantity(quantity - 1);
            }
        } else {
            setQuantity(quantity + 1);
        }
    };

    const handleClick = () => {
        dispatch(addProduct({ ...product, quantity, color, size }));
    };

    return (
        <Container>
            <Navbar />
            <Announcement />
            <Wrapper>
                <ImgContainer>
                    <Image src={product.img} alt={product.title} />
                </ImgContainer>
                <InfoContainer>
                    <Title>{product.title}</Title>
                    <Desc>{product.desc}</Desc>
                    <Price>$ {product.price}</Price>
                    <FilterContainer>
                        <Filter>
                            <FilterTitle>Color</FilterTitle>
                            {product.color?.map((c) => (
                                <FilterColor
                                    isSelected={selectedColor === c}
                                    color={c}
                                    key={c}
                                    onClick={() => {
                                        setColor(c);
                                        setSelectedColor(c);
                                    }}
                                />
                            ))}
                        </Filter>
                        <Filter>
                            <FilterTitle>Size</FilterTitle>
                            <FilterSize onChange={(e) => setSize(e.target.value)}>
                                {product.size?.map((s) => (
                                    <FilterSizeOption key={s}>{s}</FilterSizeOption>
                                ))}
                            </FilterSize>
                        </Filter>
                    </FilterContainer>
                    <AddContainer>
                        <AmountContainer>
                            <IconWrapper>
                                <Remove onClick={() => handleQuantity("dec")} />
                            </IconWrapper>
                            <Amount>{quantity}</Amount>
                            <IconWrapper>
                                <Add onClick={() => handleQuantity("inc")} />
                            </IconWrapper>
                        </AmountContainer>
                        <Button onClick={handleClick}>ADD TO CART</Button>
                    </AddContainer>
                </InfoContainer>
            </Wrapper>
            <NewsLetter />
            <Footer />
        </Container>
    );
};

export default Product;
