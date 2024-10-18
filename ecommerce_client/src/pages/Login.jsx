import styled from "styled-components";
import { mobile } from "../responsive";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { login } from "../redux/apiCalls";
import { useNavigate, Link } from "react-router-dom";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0.5)
    ),
    url("https://images.pexels.com/photos/6984650/pexels-photo-6984650.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940")
      center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 25%;
  padding: 20px;
  background-color: white;
  ${mobile({ width: "75%" })}
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 300;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  flex: 1;
  min-width: 40%;
  margin: 10px 0;
  padding: 10px;
`;

const Agreement = styled.span`
  font-size: 12px;
  margin: 20px 0px;
`;

const Button = styled.button`
  width: 40%;
  border: none;
  padding: 15px 20px;
  background-color: teal;
  color: white;
  cursor: pointer;
  margin-bottom: 10px;
  &:disabled {
    color: green;
    cursor: not-allowed;
  }
`;

const LinkButton = styled.a`
  margin: 5px 0px;
  font-size: 12px;
  text-decoration: underline;
  cursor: pointer;
`;

const Error = styled.span`
  color: red;
`;

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false); // State to manage login delay
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get the current user from the Redux store
  const { currentUser, isFetching, error } = useSelector((state) => state.user);

  // Redirect to the homepage if the user is already logged in
  useEffect(() => {
    if (currentUser) {
      navigate("/"); // Redirect to home page or any other protected route
    }
  }, [currentUser, navigate]);

  const handleClick = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true); // Start login delay
    try {
        await login(dispatch, { username, password });
        // Wait for 1 second before proceeding
        setTimeout(() => {
            setIsLoggingIn(false); // End login delay
        }, 1000);
    } catch (err) {
        console.log("Login failed:", err);
        setIsLoggingIn(false); // Ensure to reset logging state in case of failure
    }
  };

  return (
    <Container>
      <Wrapper>
        <Title>SIGN IN</Title>
        <Form>
          <Input
            placeholder="username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            placeholder="password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button onClick={handleClick} disabled={isFetching || isLoggingIn}>
            {isLoggingIn ? "Logging in..." : "LOGIN"}
          </Button>
          <Link to="/register">
            <LinkButton>CREATE AN ACCOUNT</LinkButton>
          </Link>
        </Form>
      </Wrapper>
    </Container>
  );
};

export default Login;