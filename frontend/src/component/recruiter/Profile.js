import { useContext, useEffect, useState } from "react";
import { Button, Container, Row, Col, Form, Card } from "react-bootstrap";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";

import { SetPopupContext } from "../../App";

import apiList from "../../lib/apiList";

const Profile = (props) => {
  const setPopup = useContext(SetPopupContext);
  const [initialDetails, setInitialDetails] = useState({});
  const [profileDetails, setProfileDetails] = useState({
    name: "",
    bio: "",
    contactNumber: "",
  });

  const handleInput = (key, value) => {
    setProfileDetails({
      ...profileDetails,
      [key]: value,
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get(apiList.user, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setProfileDetails(response.data);
        setInitialDetails(response.data);
            })
      .catch((err) => {
        console.log(err.response.data);
        setPopup({
          open: true,
          severity: "error",
          message: "Error",
        });
      });
  };

  const handleUpdate = () => {
    let updatedDetails = {
      ...profileDetails,
    };

if(JSON.stringify(initialDetails) !== JSON.stringify(updatedDetails)){
    axios
      .put(apiList.user, updatedDetails, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message,
        });
        getData();
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        console.log(profileDetails.contactNumber);
      });
    }else{
      setPopup({
        open: true,
        severity: "info",
        message: `No changes made ${profileDetails.contactNumber}`,
      });
    }
  };

  return (
    <Container style={{ padding: "30px", minHeight: "93vh" }}>
      <Row className="justify-content-center">
        <Col md="auto">
          <h1>Profile</h1>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={8}>
          <Card style={{ padding: "20px" }}>
            <Form>
              <Form.Group controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={profileDetails.name}
                  onChange={(event) => handleInput("name", event.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formBio">
                <Form.Label>Bio (upto 250 words)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={8}
                  value={profileDetails.bio}
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
              <Form.Group controlId="formPhone">
                <PhoneInput
                  country={"pk"}
                  value={profileDetails.contactNumber}
                  onChange={(value) => handleInput("contactNumber", `+${value}`)}
                  style={{ width: "auto" , marginTop: "20px"}}
                />
              </Form.Group>
              <Button
                variant="success"
                onClick={handleUpdate}
                style={{ marginTop: "30px" }}
                className="custom"
              >
                Update Details
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
