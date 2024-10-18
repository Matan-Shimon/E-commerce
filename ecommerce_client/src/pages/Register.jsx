import styled from "styled-components";
import { mobile } from "../responsive";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { register } from "../redux/apiCalls";
import { useState } from "react";

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
  width: 40%;
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
  flex-direction: column; /* Stack items vertically */
`;

const Input = styled.input`
  flex: 1;
  min-width: 40%;
  margin: 5px 0px;
`;

const Agreement = styled.span`
  font-size: 12px;
  margin: 5px 0px;
`;

const Button = styled.button`
  width: 40%;
  border: none;
  padding: 15px 20px;
  background-color: teal;
  color: white;
  cursor: pointer;
  margin-top: 10px; /* Optional: margin for spacing */
`;

const LinkButton = styled.a`
  margin-left: 5px;
  font-size: 12px;
  text-decoration: underline;
  cursor: pointer;
`;

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({
        isAdmin: false
    });

    const handleChange = (e) => {
      setInputs(prev => {
        return {...prev, [e.target.name]: e.target.value}
      });
      console.log(inputs);
    }

    const handleClick = (e) => {
        e.preventDefault();
        register(dispatch, inputs, navigate);
    }

  return (
    <Container>
      <Wrapper>
        <Title>CREATE AN ACCOUNT</Title>
        <Form>
          <Input name="fullname" onChange={handleChange} placeholder="full name" />
          <Input name="username" onChange={handleChange} placeholder="username" />
          <Input name="email" onChange={handleChange} placeholder="email" />
          <Input name="address" onChange={handleChange} placeholder="address" />
          <Input name="password" onChange={handleChange} placeholder="password" />
          <Agreement>
            By creating an account, I consent to the processing of my
            personal data in accordance with the <b>PRIVACY POLICY</b>
          </Agreement>
          <Agreement>
            ALREADY HAVE AN ACCOUNT?
            <Link to="/login">
                <LinkButton>SIGN IN</LinkButton>
            </Link>
          </Agreement>
          <Button onClick={handleClick}>CREATE</Button>
        </Form>
      </Wrapper>
    </Container>
  );
};

export default Register;
