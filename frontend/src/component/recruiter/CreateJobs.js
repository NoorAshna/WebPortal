import React, { useContext, useState } from "react";
import { Button, Container, Row, Col, Form, Modal } from "react-bootstrap";
import axios from "axios";
import { SetPopupContext } from "../../App";
import apiList from "../../lib/apiList";

const CreateJobs = (props) => {
  const setPopup = useContext(SetPopupContext);

  const [jobDetails, setJobDetails] = useState({
    title: "",
    company: "",
    maxApplicants: 100,
    maxPositions: 30,
    deadline: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000)
      .toISOString()
      .substr(0, 16),
    skillsets: [],
    jobType: "Full Time",
    duration: 0,
    salary: 0,
  });

  const handleInput = (key, value) => {
    setJobDetails({
      ...jobDetails,
      [key]: value,
    });
  };

  const handleUpdate = () => {
    console.log("Creating Job:", jobDetails);
    axios
      .post(apiList.jobs, jobDetails, {
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
        setJobDetails({
          title: "",
          company: "",
          maxApplicants: 100,
          maxPositions: 30,
          deadline: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000)
            .toISOString()
            .substr(0, 16),
          skillsets: [],
          jobType: "Full Time",
          duration: 0,
          salary: 0,
        });
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        console.log(err.response);
      });
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center mb-4">
        <Col xs={12} md={8} className="text-center">
          <h1>Add Job</h1>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs={12} md={8}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={jobDetails.title}
                onChange={(e) => handleInput("title", e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Company</Form.Label>
              <Form.Control
                type="text"
                value={jobDetails.company}
                onChange={(e) => handleInput("company", e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Skills</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter skills separated by commas"
                value={jobDetails.skillsets.join(", ")}
                onChange={(e) =>
                  handleInput("skillsets", e.target.value.split(",").map((s) => s.trim()))
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Job Type</Form.Label>
              <Form.Select
                value={jobDetails.jobType}
                onChange={(e) => handleInput("jobType", e.target.value)}
              >
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Work From Home">Work From Home</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Duration</Form.Label>
              <Form.Select
                value={jobDetails.duration}
                onChange={(e) => handleInput("duration", e.target.value)}
              >
                <option value={0}>Flexible</option>
                <option value={1}>1 Month</option>
                <option value={2}>2 Months</option>
                <option value={3}>3 Months</option>
                <option value={4}>4 Months</option>
                <option value={5}>5 Months</option>
                <option value={6}>6 Months</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Salary</Form.Label>
              <Form.Control
                type="number"
                min="0"
                value={jobDetails.salary}
                onChange={(e) => handleInput("salary", e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Application Deadline</Form.Label>
              <Form.Control
                type="datetime-local"
                value={jobDetails.deadline}
                onChange={(e) => handleInput("deadline", e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Maximum Number of Applicants</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={jobDetails.maxApplicants}
                onChange={(e) => handleInput("maxApplicants", e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Positions Available</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={jobDetails.maxPositions}
                onChange={(e) => handleInput("maxPositions", e.target.value)}
              />
            </Form.Group>

            <Button
              variant="success"
              className="w-100 mt-3"
              onClick={handleUpdate}
            >
              Create Job
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateJobs;
