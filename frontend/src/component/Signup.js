import { useState, useContext } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
} from "react-bootstrap";
import axios from "axios";
import { Navigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import PasswordInput from "../lib/PasswordInput";
import EmailInput from "../lib/EmailInput";
import { SetPopupContext } from "../App";
import apiList from "../lib/apiList";
import isAuth from "../lib/isAuth";

const MultifieldInput = (props) => {
  const { education, setEducation } = props;

  return (
    <>
      {education.map((obj, key) => (
        <Row key={key} className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Institution Name #{key + 1}</Form.Label>
              <Form.Control
                type="text"
                value={education[key].institutionName}
                onChange={(event) => {
                  const newEdu = [...education];
                  newEdu[key].institutionName = event.target.value;
                  setEducation(newEdu);
                }}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Start Year</Form.Label>
              <Form.Control
                type="number"
                value={obj.startYear}
                onChange={(event) => {
                  const newEdu = [...education];
                  newEdu[key].startYear = event.target.value;
                  setEducation(newEdu);
                }}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>End Year</Form.Label>
              <Form.Control
                type="number"
                value={obj.endYear}
                onChange={(event) => {
                  const newEdu = [...education];
                  newEdu[key].endYear = event.target.value;
                  setEducation(newEdu);
                }}
              />
            </Form.Group>
          </Col>
        </Row>
      ))}
      <Button
        variant="secondary"
        onClick={() =>
          setEducation([
            ...education,
            {
              institutionName: "",
              startYear: "",
              endYear: "",
            },
          ])
        }
        className="mb-3"
      >
        Add another institution details
      </Button>
    </>
  );
};

const Login = (props) => {
  const setPopup = useContext(SetPopupContext);

  const [loggedin, setLoggedin] = useState(isAuth());

  const [signupDetails, setSignupDetails] = useState({
    type: "applicant",
    email: "",
    password: "",
    name: "",
    education: [],
    skills: [],
    resume: "",
    profile: "",
    bio: "",
    contactNumber: "",
  });

  const [phone, setPhone] = useState("");

  const [education, setEducation] = useState([
    {
      institutionName: "",
      startYear: "",
      endYear: "",
    },
  ]);

  const [skills, setSkills] = useState([]);

  const [inputErrorHandler, setInputErrorHandler] = useState({
    email: {
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
    password: {
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
    name: {
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
  });

  const handleInput = (key, value) => {
    setSignupDetails({
      ...signupDetails,
      [key]: value,
    });
  };

  const handleInputError = (key, status, message) => {
    setInputErrorHandler({
      ...inputErrorHandler,
      [key]: {
        required: true,
        untouched: false,
        error: status,
        message: message,
      },
    });
  };

  const handleSkillAdd = (event) => {
    if (event.key === "Enter" && event.target.value.trim() !== "") {
      setSkills([...skills, event.target.value.trim()]);
      event.target.value = "";
    }
  };

  const handleSkillRemove = (index) => {
    const newSkills = skills.filter((_, i) => i !== index);
    setSkills(newSkills);
  };

  const handleLogin = () => {
    const tmpErrorHandler = {};
    Object.keys(inputErrorHandler).forEach((obj) => {
      if (inputErrorHandler[obj].required && inputErrorHandler[obj].untouched) {
        tmpErrorHandler[obj] = {
          required: true,
          untouched: false,
          error: true,
          message: `${obj[0].toUpperCase() + obj.substr(1)} is required`,
        };
      } else {
        tmpErrorHandler[obj] = inputErrorHandler[obj];
      }
    });

    console.log(education);

    let updatedDetails = {
      ...signupDetails,
      education: education
        .filter((obj) => obj.institutionName.trim() !== "")
        .map((obj) => {
          if (obj["endYear"] === "") {
            delete obj["endYear"];
          }
          return obj;
        }),
      skills: skills,
    };

    setSignupDetails(updatedDetails);

    const verified = !Object.keys(tmpErrorHandler).some((obj) => {
      return tmpErrorHandler[obj].error;
    });

    if (verified) {
      axios
        .post(apiList.signup, updatedDetails)
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
      setInputErrorHandler(tmpErrorHandler);
      setPopup({
        open: true,
        severity: "error",
        message: "Incorrect Input",
      });
    }
  };

  const handleLoginRecruiter = () => {
    const tmpErrorHandler = {};
    Object.keys(inputErrorHandler).forEach((obj) => {
      if (inputErrorHandler[obj].required && inputErrorHandler[obj].untouched) {
        tmpErrorHandler[obj] = {
          required: true,
          untouched: false,
          error: true,
          message: `${obj[0].toUpperCase() + obj.substr(1)} is required`,
        };
      } else {
        tmpErrorHandler[obj] = inputErrorHandler[obj];
      }
    });

    let updatedDetails = {
      ...signupDetails,
    };
    if (phone !== "") {
      updatedDetails = {
        ...signupDetails,
        contactNumber: `+${phone}`,
      };
    } else {
      updatedDetails = {
        ...signupDetails,
        contactNumber: "",
      };
    }

    setSignupDetails(updatedDetails);

    const verified = !Object.keys(tmpErrorHandler).some((obj) => {
      return tmpErrorHandler[obj].error;
    });

    console.log(updatedDetails);

    if (verified) {
      axios
        .post(apiList.signup, updatedDetails)
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
      setInputErrorHandler(tmpErrorHandler);
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
    <Container className="mt-5 p-3 shadow w-50">
      <Card>
        <Card.Body>
          <Card.Title className="text-center" as={"h1"}>Signup</Card.Title>
          <Form>
            <Form.Group controlId="formCategory">
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                value={signupDetails.type}
                onChange={(event) => {
                  handleInput("type", event.target.value);
                }}
              >
                <option value="applicant">Applicant</option>
                <option value="recruiter">Recruiter</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={signupDetails.name}
                onChange={(event) => handleInput("name", event.target.value)}
                isInvalid={inputErrorHandler.name.error}
                onBlur={(event) => {
                  if (event.target.value === "") {
                    handleInputError("name", true, "Name is required");
                  } else {
                    handleInputError("name", false, "");
                  }
                }}
              />
              <Form.Control.Feedback type="invalid">
                {inputErrorHandler.name.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formEmail">
              <EmailInput
                label="Email"
                value={signupDetails.email}
                onChange={(event) => handleInput("email", event.target.value)}
                inputErrorHandler={inputErrorHandler}
                handleInputError={handleInputError}
                required={true}
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <PasswordInput
                label="Password"
                value={signupDetails.password}
                onChange={(event) => handleInput("password", event.target.value)}
                isInvalid={inputErrorHandler.password.error}
                onBlur={(event) => {
                  if (event.target.value === "") {
                    handleInputError("password", true, "Password is required");
                  } else {
                    handleInputError("password", false, "");
                  }
                }}
              />
              <Form.Control.Feedback type="invalid">
                {inputErrorHandler.password.message}
              </Form.Control.Feedback>
            </Form.Group>
            {signupDetails.type === "applicant" ? (
              <>
                <MultifieldInput
                  education={education}
                  setEducation={setEducation}
                />
                <Form.Group controlId="formSkills">
                  <Form.Label>Skills</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Press enter to add skills"
                    onKeyDown={handleSkillAdd}
                  />
                  <div className="mt-2">
                    {skills.map((skill, index) => (
                      <Button
                        key={index}
                        variant="outline-secondary"
                        className="me-2 mb-2"
                        onClick={() => handleSkillRemove(index)}
                      >
                        {skill} &times;
                      </Button>
                    ))}
                  </div>
                </Form.Group>
              </>
            ) : (
              <>
                <Form.Group controlId="formBio">
                  <Form.Label>Bio (upto 250 words)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={8}
                    value={signupDetails.bio}
                    onChange={(event) => {
                      if (
                        event.target.value.split(" ").filter(function (n) {
                          return n !== "";
                        }).length <= 250
                      ) {
                        handleInput("bio", event.target.value);
                      }
                    }}
                  />
                </Form.Group>
                <Form.Group controlId="formContactNumber">
                  <Form.Label>Contact Number</Form.Label>
                  <PhoneInput
                    country={"pk"}
                    value={phone}
                    onChange={(phone) => setPhone(phone)}
                  />
                </Form.Group>
              </>
            )}
            <Button
              className="custom"
              onClick={() => {
                signupDetails.type === "applicant"
                  ? handleLogin()
                  : handleLoginRecruiter();
              }}
            >
              Signup
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
