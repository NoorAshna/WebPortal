import { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Button, Form, Modal, Card } from "react-bootstrap";
import axios from "axios";
import { SetPopupContext } from "../App";
import apiList from "../lib/apiList";

const MultifieldInput = (props) => {
  const { education, setEducation } = props;

  return (
    <>
      {education.map((obj, key) => (
        <Row className="mb-3" key={key}>
          <Col md={6}>
            <Form.Group controlId={`institutionName-${key}`}>
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
            <Form.Group controlId={`startYear-${key}`}>
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
            <Form.Group controlId={`endYear-${key}`}>
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
      <Row className="text-center">
        <Col>
          <Button
            variant="secondary"
            onClick={() =>
              setEducation([
                ...education,
                { institutionName: "", startYear: "", endYear: "" },
              ])
            }
          >
            Add Another Institution
          </Button>
        </Col>
      </Row>
    </>
  );
};

const Profile = (props) => {
  const setPopup = useContext(SetPopupContext);
  const [userData, setUserData] = useState();
  const [open, setOpen] = useState(false);

  const [profileDetails, setProfileDetails] = useState({
    name: "",
    education: [],
    skills: [],
  });

  const [education, setEducation] = useState([
    { institutionName: "", startYear: "", endYear: "" },
  ]);

  const handleInput = (key, value) => {
    const reader = new FileReader();
    reader.readAsDataURL(value);
    reader.onload = () => {
      const base64 = reader.result;
    setProfileDetails({ ...profileDetails, [key]: base64 });
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get(apiList.user, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setProfileDetails(response.data);
        if (response.data.education.length > 0) {
          setEducation(
            response.data.education.map((edu) => ({
              institutionName: edu.institutionName || "",
              startYear: edu.startYear || "",
              endYear: edu.endYear || "",
            }))
          );
        }
      })
      .catch((err) => {
        setPopup({ open: true, severity: "error", message: "Error" });
      });
  };

  const handleUpdate = () => {
    const updatedDetails = {
      ...profileDetails,
      education: education
        .filter((obj) => obj.institutionName.trim() !== "")
        .map((obj) => {
          if (obj.endYear === "") delete obj.endYear;
          return obj;
        }),
    };

    axios
      .put(apiList.user, updatedDetails, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setPopup({ open: true, severity: "success", message: response.data.message });
        getData();
      })
      .catch((err) => {
        setPopup({ open: true, severity: "error", message: err.response.data.message });
      });
    setOpen(false);
  };

  return (
    <Container fluid className="py-4">
      <Row className="justify-content-center mb-4">
        <Col md={6} className="text-center">
          <h2>Profile</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Body>
              <Form>
                <Form.Group controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={profileDetails.name}
                    onChange={(event) => handleInput("name", event.target.value)}
                  />
                </Form.Group>

                <MultifieldInput education={education} setEducation={setEducation} />

                {/* Skills (simple implementation since ChipInput isn't available in React-Bootstrap) */}
                <Form.Group controlId="skills">
                  <Form.Label>Skills</Form.Label>
                  <Form.Control
                    type="text"
                    value={profileDetails.skills.join(", ")}
                    placeholder="Enter skills separated by commas"
                    onChange={(event) =>
                      handleInput("skills", event.target.value.split(",").map((s) => s.trim()))
                    }
                  />
                </Form.Group>

                {/* Placeholder for File Upload Inputs */}
                {/* <Form.Group controlId="resume">
                  <Form.Label>Resume (.pdf)</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={(event) => handleInput("resume", event.target.files[0])}
                  />
                </Form.Group>
                <Form.Group controlId="profile">
                  <Form.Label>Profile Photo (.jpg/.png)</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={(event) => handleInput("profile", event.target.files[0])}
                  />
                </Form.Group> */}

                <Button variant="success" className="mt-3" onClick={handleUpdate}>
                  Update Details
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
