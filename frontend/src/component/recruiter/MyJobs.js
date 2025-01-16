import { useState, useEffect, useContext } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Badge,
  Modal,
} from "react-bootstrap";
import { useNavigate} from "react-router-dom";
import axios from "axios";
import { SetPopupContext } from "../../App";
import apiList from "../../lib/apiList";
const JobTile = (props) => {
  let history = useNavigate();
  const { job, getData } = props;
  const setPopup = useContext(SetPopupContext);

  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [jobDetails, setJobDetails] = useState(job);


  const handleInput = (key, value) => {
    setJobDetails({
      ...jobDetails,
      [key]: value,
    });
  };

  const handleClick = (location) => {
    history.push(location);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
  };

  const handleDelete = () => {
    console.log(job._id);
    axios
      .delete(`${apiList.jobs}/${job._id}`, {
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
        handleClose();
      })
      .catch((err) => {
        console.log(err.response);
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        handleClose();
      });
  };

  const handleJobUpdate = () => {
    axios
      .put(`${apiList.jobs}/${job._id}`, jobDetails, {
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
        handleCloseUpdate();
      })
      .catch((err) => {
        console.log(err.response);
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        handleCloseUpdate();
      });
  };

  const postedOn = new Date(job.dateOfPosting);

  return (
    <div className="job-tile p-3 mb-4 border rounded shadow">
      <Row className="mb-4">
        {/* Job Information Column */}
        <Col xs={8}>
          <h5>{job.title}</h5>
          <p>Role: {job.jobType}</p>
          <p>Salary: {job.salary} per month</p>
          <p>
            Duration: {job.duration !== 0 ? `${job.duration} month` : `Flexible`}
          </p>
          <p>Date of Posting: {postedOn.toLocaleDateString()}</p>
          <p>Number of Applicants: {job.maxApplicants}</p>
          <p>
            Remaining Number of Positions:{" "}
            {job.maxPositions - job.acceptedCandidates}
          </p>
          <div>
            {job.skillsets.map((skill, index) => (
              <Badge
                key={index}
                pill
                bg="secondary"
                className="me-2 p-2"
                style={{ fontSize: "0.85rem" }}
              >
                {skill}
              </Badge>
            ))}
          </div>
        </Col>

        {/* Action Buttons Column */}
        <Col xs={4} className="d-flex align-items-start gap-2">
            <i className="bi bi-eye "
             onClick={() => handleClick(`/job/applications/${job._id}`)}
             style={{ color: "green", cursor: "pointer" }}
             ></i>

            <i className="bi bi-pencil"
            onClick={() => setOpenUpdate(true)}
            style={{ cursor: "pointer" }}
            ></i>

          <i
            className="bi bi-trash"
            onClick={() => setOpen(true)}
            style={{ color: "red", cursor: "pointer" }}
          ></i>
        </Col>
      </Row>
      <Modal show={open} onHide={handleClose} centered>
        <Modal.Body className="text-center p-4">
          <h4 className="mb-3">Are you sure?</h4>
          <Container>
            <Row className="justify-content-center">
              <Col xs="auto">
                <Button
                  variant="danger"
                  className="px-4 py-2"
                  onClick={() => handleDelete()}
                >
                  Delete
                </Button>
              </Col>
              <Col xs="auto">
                <Button
                  variant="secondary"
                  className="px-4 py-2"
                  onClick={() => handleClose()}
                >
                  Cancel
                </Button>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
      <Modal show={openUpdate} onHide={handleCloseUpdate} centered>
        <Modal.Body className="p-4">
          <h1 className="mb-3 text-center">Update Details</h1>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Application Deadline</Form.Label>
              <Form.Control
                type="datetime-local"
                value={jobDetails.deadline.substr(0, 16)}
                onChange={(event) => handleInput("deadline", event.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Maximum Number Of Applicants</Form.Label>
              <Form.Control
                type="number"
                value={jobDetails.maxApplicants}
                onChange={(event) => handleInput("maxApplicants", event.target.value)}
                min={1}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Positions Available</Form.Label>
              <Form.Control
                type="number"
                value={jobDetails.maxPositions}
                onChange={(event) => handleInput("maxPositions", event.target.value)}
                min={1}
              />
            </Form.Group>
            <div className="d-flex justify-content-around">
              <Button
                variant="success"
                className="px-4 py-2"
                onClick={() => handleJobUpdate()}
              >
                Update
              </Button>
              <Button
                variant="secondary"
                className="px-4 py-2"
                onClick={() => handleCloseUpdate()}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

const FilterPopup = (props) => {
  const { open, handleClose, searchOptions, setSearchOptions, getData } = props;
  return (
    <Modal show={open} onHide={handleClose} centered>
      <Modal.Body>
        <Container>
          <Row className="mb-3">
            <Col>
              <h4>Filter Jobs</h4>
            </Col>
          </Row>
          <Form>
            <Form.Group as={Row} className="mb-3" controlId="formJobType">
              <Form.Label column sm={3}>
                Job Type
              </Form.Label>
              <Col sm={9}>
                <Form.Check
                  type="checkbox"
                  label="Full Time"
                  name="fullTime"
                  checked={searchOptions.jobType.fullTime}
                  onChange={(event) => {
                    setSearchOptions({
                      ...searchOptions,
                      jobType: {
                        ...searchOptions.jobType,
                        [event.target.name]: event.target.checked,
                      },
                    });
                  }}
                />
                <Form.Check
                  type="checkbox"
                  label="Part Time"
                  name="partTime"
                  checked={searchOptions.jobType.partTime}
                  onChange={(event) => {
                    setSearchOptions({
                      ...searchOptions,
                      jobType: {
                        ...searchOptions.jobType,
                        [event.target.name]: event.target.checked,
                      },
                    });
                  }}
                />
                <Form.Check
                  type="checkbox"
                  label="Work From Home"
                  name="wfh"
                  checked={searchOptions.jobType.wfh}
                  onChange={(event) => {
                    setSearchOptions({
                      ...searchOptions,
                      jobType: {
                        ...searchOptions.jobType,
                        [event.target.name]: event.target.checked,
                      },
                    });
                  }}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formDuration">
              <Form.Label column sm={3}>
                Duration
              </Form.Label>
              <Col sm={9}>
                <Form.Select
                  value={searchOptions.duration}
                  onChange={(event) =>
                    setSearchOptions({
                      ...searchOptions,
                      duration: event.target.value,
                    })
                  }
                >
                  <option value="0">All</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                </Form.Select>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formSort">
              <Form.Label column sm={3}>
                Sort
              </Form.Label>
              <Col sm={9}>
                <Form.Check
                  type="checkbox"
                  label="Salary"
                  name="salary"
                  checked={searchOptions.sort.salary.status}
                  onChange={(event) =>
                    setSearchOptions({
                      ...searchOptions,
                      sort: {
                        ...searchOptions.sort,
                        salary: {
                          ...searchOptions.sort.salary,
                          status: event.target.checked,
                        },
                      },
                    })
                  }
                />
                <Form.Check
                  type="checkbox"
                  label="Duration"
                  name="duration"
                  checked={searchOptions.sort.duration.status}
                  onChange={(event) =>
                    setSearchOptions({
                      ...searchOptions,
                      sort: {
                        ...searchOptions.sort,
                        duration: {
                          ...searchOptions.sort.duration,
                          status: event.target.checked,
                        },
                      },
                    })
                  }
                />
                <Form.Check
                  type="checkbox"
                  label="Rating"
                  name="rating"
                  checked={searchOptions.sort.rating.status}
                  onChange={(event) =>
                    setSearchOptions({
                      ...searchOptions,
                      sort: {
                        ...searchOptions.sort,
                        rating: {
                          ...searchOptions.sort.rating,
                          status: event.target.checked,
                        },
                      },
                    })
                  }
                />
              </Col>
            </Form.Group>

            <Row className="justify-content-center">
              <Col xs="auto">
                <Button variant="primary" onClick={() => getData()}>
                  Apply
                </Button>
              </Col>
              <Col xs="auto">
                <Button variant="secondary" onClick={handleClose}>
                  Cancel
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

const MyJobs = (props) => {
  const [jobs, setJobs] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchOptions, setSearchOptions] = useState({
    query: "",
    jobType: {
      fullTime: false,
      partTime: false,
      wfh: false,
    },
    salary: [0, 100],
    duration: "0",
    sort: {
      salary: { status: false, desc: false },
      duration: { status: false, desc: false },
      rating: { status: false, desc: false },
    },
  });

  const setPopup = useContext(SetPopupContext);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    let searchParams = [`myjobs=1`];
    if (searchOptions.query !== "") searchParams.push(`q=${searchOptions.query}`);
    if (searchOptions.jobType.fullTime) searchParams.push(`jobType=Full%20Time`);
    if (searchOptions.jobType.partTime) searchParams.push(`jobType=Part%20Time`);
    if (searchOptions.jobType.wfh) searchParams.push(`jobType=Work%20From%20Home`);
    if (searchOptions.salary[0] !== 0) searchParams.push(`salaryMin=${searchOptions.salary[0] * 1000}`);
    if (searchOptions.salary[1] !== 100) searchParams.push(`salaryMax=${searchOptions.salary[1] * 1000}`);
    if (searchOptions.duration !== "0") searchParams.push(`duration=${searchOptions.duration}`);

    let asc = [], desc = [];
    Object.keys(searchOptions.sort).forEach((key) => {
      const item = searchOptions.sort[key];
      if (item.status) {
        if (item.desc) desc.push(`desc=${key}`);
        else asc.push(`asc=${key}`);
      }
    });

    searchParams = [...searchParams, ...asc, ...desc];
    const queryString = searchParams.join("&");
    const address = queryString ? `${apiList.jobs}?${queryString}` : apiList.jobs;

    axios
      .get(address, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => setJobs(response.data))
      .catch((err) => {
        console.error(err.response.data);
        setPopup({
          open: true,
          severity: "error",
          message: "Error",
        });
      });
  };

  return (
    <Container className="py-4">
      <Row className="mb-4 text-center">
        <Col>
          <h1>My Jobs</h1>
        </Col>
      </Row>

      <Row className="justify-content-center mb-4">
        <Col md={8}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search Jobs"
              value={searchOptions.query}
              onChange={(e) =>
                setSearchOptions({ ...searchOptions, query: e.target.value })
              }
              onKeyPress={(e) => e.key === "Enter" && getData()}
            />
            <Button variant="outline-secondary" onClick={() => getData()}>
              {/* <Search /> */}search
            </Button>
          </InputGroup>
        </Col>
        <Col md="auto">
          <Button variant="outline-primary" onClick={() => setFilterOpen(true)}>
            {/* <Filter />  */}
            Filter
          </Button>
        </Col>
      </Row>

      <Row>
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <Col key={job.id} xs={12} md={6} className="mb-4">
              <JobTile job={job} getData={getData} />
            </Col>
          ))
        ) : (
          <Col>
            <h5 className="text-center">No jobs found</h5>
          </Col>
        )}
      </Row>

      <FilterPopup
        open={filterOpen}
        searchOptions={searchOptions}
        setSearchOptions={setSearchOptions}
        handleClose={() => setFilterOpen(false)}
        getData={() => {
          getData();
          setFilterOpen(false);
        }}
      />
    </Container>
  );
};

export default MyJobs;
