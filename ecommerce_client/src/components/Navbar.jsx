import { Badge } from '@mui/material';
import Search from '@mui/icons-material/Search';
import ShoppingCartOutlined from '@mui/icons-material/ShoppingCartOutlined';
import ListAltOutlined from '@mui/icons-material/ListAltOutlined'; // Import Orders Icon
import HomeOutlined from '@mui/icons-material/HomeOutlined'; // Import Home Icon
import React, { useState } from "react";
import styled from "styled-components";
import { mobile } from "../responsive";
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { logout } from '../redux/apiCalls';
import { resetCart } from '../redux/cartRedux';

const Container = styled.div`
  height: 60px;
  ${mobile({ height: "50px" })};
`;

const Wrapper = styled.div`
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${mobile({ padding: "10px 0px" })};
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start; /* Align items to the left */
`;

const Language = styled.span`
  font-size: 24px;
  cursor: pointer;
  margin-left: 10px; /* Adjusted spacing for the Language option */
  ${mobile({ display: "none" })};
`;

const SearchContainer = styled.div`
  border: 0.5px solid lightgray;
  display: flex;
  align-items: center;
  margin-left: 15px; /* Margin for the search container */
  padding: 5px;
`;

const Input = styled.input`
  border: none;
  ${mobile({ width: "50px" })};
`;

const Center = styled.div`
  flex: 1;
  text-align: center;
`;

const Logo = styled.h1`
  font-weight: bold;
  ${mobile({ fontSize: "24px" })};
`;

const Right = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  ${mobile({ flex: 2, justifyContent: "center" })};
`;

const MenuItem = styled.div`
  font-size: 14px;
  cursor: pointer;
  margin-left: 25px; /* Spacing between menu items */
  ${mobile({ fontSize: "12px", marginLeft: "10px" })};
`;

const HomeIcon = styled.div`
  margin-right: 10px; /* Spacing between home icon and language */
`;

const Navbar = () => {
  const quantity = useSelector(state => state.cart.quantity);
  const currentUser = useSelector((state) => state.user.currentUser);
  const [showLogout, setShowLogout] = useState(false);
  const dispatch = useDispatch();

  // Toggle the visibility of the logout button
  const handleAvatarClick = () => {
    setShowLogout(prevState => !prevState);
  };

  const handleLogout = async (e) => {
    try {
      await logout(dispatch);
      dispatch(resetCart());
      setShowLogout(false);
    } catch (err) {
      console.log("Logout failed:", err);
    }
  }

  return (
    <Container>
      <Wrapper>
        <Left>
          <Link to="/"> {/* Link to Home */}
            <HomeIcon>
              <HomeOutlined style={{ fontSize: 24, color: 'black' }} /> {/* Home Icon */}
            </HomeIcon>
          </Link>
          <Language>EN</Language>
          <SearchContainer>
            <Input placeholder="Search" />
            <Search style={{ color: "gray", fontSize: 24 }} />
          </SearchContainer>
        </Left>
        <Center>
          <Logo>MATAN.</Logo>
        </Center>
        <Right>
          <img
            src="https://i2.wp.com/vdostavka.ru/wp-content/uploads/2019/05/no-avatar.png?fit=512%2C512&ssl=1"
            alt="Avatar"
            className="topAvatar"
            onClick={handleAvatarClick}
            style={{
              fontSize: 24,
              cursor: 'pointer',
              width: '30px',
              height: '30px',
              borderRadius: '50%',
            }}
          />
          {showLogout && (
            <Link to="/login" className="logoutButton" onClick={handleLogout} style={{ marginLeft: '10px' }}>
              Logout
            </Link>
          )}
          <Link to="/orders"> {/* Link to Orders Page */}
            <MenuItem>
              <ListAltOutlined style={{ fontSize: 24, color: 'black' }} /> {/* Orders Icon */}
            </MenuItem>
          </Link>
          <Link to="/cart">
            <MenuItem>
              <Badge badgeContent={quantity} color="primary">
                <ShoppingCartOutlined style={{ fontSize: 24, color: 'black' }} />
              </Badge>
            </MenuItem>
          </Link>
        </Right>
      </Wrapper>
    </Container>
  );
};

export default Navbar;
