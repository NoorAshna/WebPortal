import { useState, useEffect, useContext } from "react";
import {
  Container,
  Button,
  Card,
  Col,
  Row,
  Badge,
  Modal,
  Form,
  InputGroup,
} from "react-bootstrap";
import axios from "axios";
import { SetPopupContext } from "../App";
import apiList from "../lib/apiList";


const ApplicationTile = (props) => {

  const { application } = props;
  const setPopup = useContext(SetPopupContext);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(application.job.rating);

  const appliedOn = new Date(application.dateOfApplication);
  const joinedOn = new Date(application.dateOfJoining);

  const fetchRating = () => {
    axios
      .get(`${apiList.rating}?id=${application.job._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setRating(response.data.rating);
        console.log(response.data);
      })
      .catch((err) => {
        // console.log(err.response);
        console.log(err.response.data);
        setPopup({
          open: true,
          severity: "error",
          message: "Error",
        });
      });
  };


  const colorSet = {
    applied: "#3454D1",
    shortlisted: "#DC851F",
    accepted: "#09BC8A",
    rejected: "#D1345B",
    deleted: "#B49A67",
    cancelled: "#FF8484",
    finished: "#4EA5D9",
  };

  return (
    <Card className="p-2 shadow">
      <Row>
        <Col xs={9} className="px-3">
          <Container className="d-flex gap-2">
            <h5>{application.job.title} </h5>
            <h6 style={{ color: "blueviolet" }}>
              {application.job.company !== undefined
                ? `${application.job.company}`
                : "company"}
            </h6>
          </Container>
          
          <small>
            {application.job.jobType} . ${application.job.salary} .{" "}
            {application.job.duration !== 0
              ? `${application.job.duration} month`
              : "Flexible"}{" "}
          </small>
          <p>Posted By: {application.recruiter.name}</p>
          <div className="d-flex gap-3">
            <p>Applied On: {appliedOn.toLocaleDateString()}</p>
            {(application.status === "accepted" ||
              application.status === "finished") && (
              <p>Joined On: {joinedOn.toLocaleDateString()}</p>
            )}
          </div>
          <div>
            {application.job.skillsets.map((skill, index) => (
              <Badge key={index} bg="secondary" className="me-1 p-2">
                {skill}
              </Badge>
            ))}
          </div>
        </Col>
        <Col xs={3} className="d-flex flex-row align-items-center gap-3">
          <div
            className="text-white p-2 text-center rounded"
            style={{
              background: colorSet[application.status],
            }}
          >
            {application.status}
          </div>
        </Col>
      </Row>
    </Card>
  );
};

const Applications = (props) => {
  const setPopup = useContext(SetPopupContext);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get(apiList.applications, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setApplications(response.data);
      })
      .catch((err) => {
        // console.log(err.response);
        console.log(err.response.data);
        setPopup({
          open: true,
          severity: "error",
          message: "Error",
        });
      });
  };

  return (
    <Container
      className="d-flex flex-column py-4 mh-75"
    >
      <Row className="mb-3">
        <h1>Applications</h1>
      </Row>

      <Row className="w-100">
        {applications.length > 0 ? (
          applications.map((obj, index) => (
            <Row key={index} className="mb-3">
              <ApplicationTile application={obj} />
            </Row>
          ))
        ) : (
          <Col>
            <h5 className="text-center">No Applications Found</h5>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default Applications;
