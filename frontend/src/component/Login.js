import { useContext, useState } from "react";
import { Form, Button, Container, Row, Col, Alert,Card } from "react-bootstrap";
import axios from "axios";
import { Navigate } from "react-router-dom";
import PasswordInput from "../lib/PasswordInput";
import EmailInput from "../lib/EmailInput";
import { SetPopupContext } from "../App";
import apiList from "../lib/apiList";
import isAuth from "../lib/isAuth";

const Login = () => {
  const setPopup = useContext(SetPopupContext);

  const [loggedin, setLoggedin] = useState(isAuth());

  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });

  const [inputErrorHandler, setInputErrorHandler] = useState({
    email: {
      error: false,
      message: "",
    },
    password: {
      error: false,
      message: "",
    },
  });

  const handleInput = (key, value) => {
    setLoginDetails({
      ...loginDetails,
      [key]: value,
    });
  };

  const handleInputError = (key, status, message) => {
    setInputErrorHandler({
      ...inputErrorHandler,
      [key]: {
        error: status,
        message: message,
      },
    });
  };

  const handleLogin = () => {
    const verified = !Object.keys(inputErrorHandler).some((obj) => {
      return inputErrorHandler[obj].error;
    });
    if (verified) {
      axios
        .post(apiList.login, loginDetails)
        .then((response) => {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("type", response.data.type);
          setLoggedin(isAuth());
          setPopup({
            open: true,
            severity: "success",
            message: "Logged in successfully",
          });
          console.log(response);
        })
        .catch((err) => {
          setPopup({
            open: true,
            severity: "error",
            message: err.response.data.message,
          });
          console.log(err.response);
        });
    } else {
      setPopup({
        open: true,
        severity: "error",
        message: "Incorrect Input",
      });
    }
  };

  return loggedin ? (
    <Navigate to="/" />
  ) : (
    <Card className="mt-5 p-3 shadow ">
      <Row className="justify-content-md-center">
        <Col md="auto m-3">
          <h1>Login</h1>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <EmailInput
                label="Email"
                value={loginDetails.email}
                onChange={(event) => handleInput("email", event.target.value)}
                inputErrorHandler={inputErrorHandler}
                handleInputError={handleInputError}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <PasswordInput
                label="Password"
                value={loginDetails.password}
                onChange={(event) => handleInput("password", event.target.value)}
              />
            </Form.Group>

            <Button  onClick={() => handleLogin()} className="mt-3 custom">
              Login
            </Button>
          </Form>
        </Col>
      </Row>
    </Card>
  );
};

export default Login;
