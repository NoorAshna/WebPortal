import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { SetPopupContext } from "../App";
import apiList from "../lib/apiList";
import { userType } from "../lib/isAuth";
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

const JobTile = (props) => {
  const { job } = props;
  const setPopup = useContext(SetPopupContext);

  const [open, setOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [sop, setSop] = useState("");

  const handleApplyModelClose = () => {
    setOpen(false);
    setSop("");
  };
  const handleDetailClose = () => {
    setOpenDetail(false);
    setSop("");
  };

  const handleApply = () => {
    console.log(job._id);
    console.log(sop);
    axios
      .post(
        `${apiList.jobs}/${job._id}/applications`,
        {
          sop: sop,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message,
        });
        handleApplyModelClose();
      })
      .catch((err) => {
        console.log(err.response);
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        handleApplyModelClose();
      });
  };

  const deadline = new Date(job.deadline).toLocaleDateString();

  return (
    <Card className="w-100 my-2 p-3" bg="light">
      <Container className="d-flex w-100">
        <Col xs={9}>
          <Container className="d-flex">
            <Card.Title className="me-3">{job.title}</Card.Title>
            <h6 style={{ color: "blueviolet" }}>
              {job.company !== undefined ? `${job.company}` : "company"}
            </h6>
          </Container>
          <Card.Text>
            <small className="text-muted">
              {" "}
              ${job.salary} . {job.jobType} . {deadline}
            </small>
          </Card.Text>
          <Card.Text>
            {job.skillsets.map((skill) => (
              <>
                <Badge bg="secondary"  className="me-2 p-2">
                  {skill}
                </Badge>
              </>
            ))}
          </Card.Text>
        </Col>
        <Col xs={3} className="d-flex align-items-center justify-content-center gap-3">
            {userType() !== "recruiter" && (
              <Button
                variant="success"
                onClick={() => {
                  setOpen(true);
                }}
              >
                Apply
              </Button>
            )}
            <Button
              // className="rounded-pill"
              variant="secondary"
              onClick={() => {
                setOpenDetail(true);
              }}
            >
              View
            </Button>
        </Col>
      </Container>
      <Modal show={open} onHide={handleApplyModelClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Submit Application</Modal.Title>
        </Modal.Header>
        <Form.Group controlId="sopTextarea" className="m-3 ">
          <Form.Label>Write SOP (up to 250 words)</Form.Label>
          <Form.Control
            as="textarea"
            rows={9}
            spellCheck="true"
            className="w-100 outline-none shadow-none"
            value={sop}
            onChange={(event) => {
              if (
                event.target.value.split(" ").filter((n) => n !== "").length <=
                250
              ) {
                setSop(event.target.value);
              }
            }}
          />
          <Form.Text className="text-muted">
            Ensure the statement does not exceed 250 words.
          </Form.Text>
        </Form.Group>

        <Container className="d-flex align-items-center justify-content-center mb-2">
          <Button variant="success" onClick={() => handleApply()}>
            Submit
          </Button>
        </Container>
      </Modal>
      <Modal show={openDetail} onHide={handleDetailClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{job.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="d-flex gap-3">
            Company:{" "}
            <p className="text-primary">
              {job.company !== undefined ? `${job.company}` : "company"}
            </p>
          </p>

          <p>Salary: {job.salary} per month</p>

          <p>Role: {job.jobType}</p>

          <p>
            Duration:{" "}
            {job.duration !== 0 ? `${job.duration} month` : "Flexible"}
          </p>

          <p>Application Deadline: {deadline}</p>

          <div>
            {job.skillsets.map((skill) => (
              <>
                <Badge bg="secondary" className="m-2 p-2" pill>
                  {skill}
                </Badge>
              </>
            ))}
          </div>
        </Modal.Body>
        <Container className="d-flex align-items-center justify-content-center p-2">
          <Button
            variant="success"
            onClick={() => {
              setOpen(true);
            }}
          >
            Submit
          </Button>
        </Container>
      </Modal>
    </Card>
  );
};

const FilterPopup = (props) => {
  const { open, handleClose, searchOptions, setSearchOptions, getData } = props;

  return (
    <Modal show={open} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Filter Jobs</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3}>
              Job Type
            </Form.Label>
            <Col sm={9}>
              <Form.Check
                inline
                label="Full Time"
                name="fullTime"
                type="checkbox"
                checked={searchOptions.jobType.fullTime}
                onChange={(e) =>
                  setSearchOptions({
                    ...searchOptions,
                    jobType: {
                      ...searchOptions.jobType,
                      [e.target.name]: e.target.checked,
                    },
                  })
                }
              />
              <Form.Check
                inline
                label="Part Time"
                name="partTime"
                type="checkbox"
                checked={searchOptions.jobType.partTime}
                onChange={(e) =>
                  setSearchOptions({
                    ...searchOptions,
                    jobType: {
                      ...searchOptions.jobType,
                      [e.target.name]: e.target.checked,
                    },
                  })
                }
              />
              <Form.Check
                inline
                label="Work From Home"
                name="wfh"
                type="checkbox"
                checked={searchOptions.jobType.wfh}
                onChange={(e) =>
                  setSearchOptions({
                    ...searchOptions,
                    jobType: {
                      ...searchOptions.jobType,
                      [e.target.name]: e.target.checked,
                    },
                  })
                }
              />
            </Col>
          </Form.Group>

          {/* Salary */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3}>
              Salary
            </Form.Label>
            <Col sm={9}>
              <Form.Range
                min={0}
                max={100}
                value={searchOptions.salary}
                onChange={(e) =>
                  setSearchOptions({
                    ...searchOptions,
                    salary: parseInt(e.target.value, 10),
                  })
                }
              />
              <div className="text-center">
                {`Greater than $${(searchOptions.salary * 100000) / 100}`}
              </div>
            </Col>
          </Form.Group>

          {/* Duration */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3}>
              Duration
            </Form.Label>
            <Col sm={9}>
              <Form.Select
                value={searchOptions.duration}
                onChange={(e) =>
                  setSearchOptions({
                    ...searchOptions,
                    duration: e.target.value,
                  })
                }
              >
                <option value="0">All</option>
                <option value="1">1 Month</option>
                <option value="2">2 Months</option>
                <option value="3">3 Months</option>
                <option value="4">4 Months</option>
                <option value="5">5 Months</option>
                <option value="6">6 Months</option>
                <option value="7">7+ Months</option>
              </Form.Select>
            </Col>
          </Form.Group>

          {/* Sort Options */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3}>
              Sort
            </Form.Label>
            <Col sm={9}>
              {["salary", "duration", "rating"].map((field) => (
                <InputGroup
                  className="mb-2"
                  key={field}
                  style={{
                    border: "1px solid #D1D1D1",
                    borderRadius: "5px",
                    padding: "5px",
                  }}
                >
                  <Form.Check
                    inline
                    type="checkbox"
                    id={field}
                    name={field}
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    checked={searchOptions.sort[field].status}
                    onChange={(e) =>
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          [field]: {
                            ...searchOptions.sort[field],
                            status: e.target.checked,
                          },
                        },
                      })
                    }
                  />
                  <Button
                    variant="link"
                    disabled={!searchOptions.sort[field].status}
                    onClick={() =>
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          [field]: {
                            ...searchOptions.sort[field],
                            desc: !searchOptions.sort[field].desc,
                          },
                        },
                      })
                    }
                  >
                    {searchOptions.sort[field].desc ? "↓" : "↑"}
                  </Button>
                </InputGroup>
              ))}
            </Col>
          </Form.Group>

          {/* Apply Button */}
          <div className="d-flex justify-content-center">
            <Button
              variant="success"
              onClick={() => {
                getData();
                handleClose();
              }}
            >
              Apply
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

const Home = (props) => {
  const [jobs, setJobs] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchOptions, setSearchOptions] = useState({
    query: "",
    jobType: {
      fullTime: false,
      partTime: false,
      wfh: false,
    },
    salary: 0,
    duration: "0",
    sort: {
      salary: {
        status: false,
        desc: false,
      },
      duration: {
        status: false,
        desc: false,
      },
      rating: {
        status: false,
        desc: false,
      },
    },
  });

  const setPopup = useContext(SetPopupContext);
  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    console.log("salary is" , searchOptions.salary)
    let searchParams = [];
    if (searchOptions.query !== "") {
      searchParams = [...searchParams, `q=${searchOptions.query}`];
    }
    if (searchOptions.jobType.fullTime) {
      searchParams = [...searchParams, `jobType=Full%20Time`];
    }
    if (searchOptions.jobType.partTime) {
      searchParams = [...searchParams, `jobType=Part%20Time`];
    }
    if (searchOptions.jobType.wfh) {
      searchParams = [...searchParams, `jobType=Work%20From%20Home`];
    }
    if (searchOptions.salary != 0) {
      searchParams = [
        ...searchParams,
        `salary=${searchOptions.salary* 1000}`,
      ];
    }
    if (searchOptions.duration != "0") {
      searchParams = [...searchParams, `duration=${searchOptions.duration}`];
    }

    let asc = [],
      desc = [];

    Object.keys(searchOptions.sort).forEach((obj) => {
      const item = searchOptions.sort[obj];
      if (item.status) {
        if (item.desc) {
          desc = [...desc, `desc=${obj}`];
        } else {
          asc = [...asc, `asc=${obj}`];
        }
      }
    });
    searchParams = [...searchParams, ...asc, ...desc];
    const queryString = searchParams.join("&");
    console.log(queryString);
    let address = apiList.jobs;
    if (queryString !== "") {
      address = `${address}?${queryString}`;
    }

    axios
      .get(address, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setJobs(
          // response.data.filter((obj) => {
          //   const today = new Date();
          //   const deadline = new Date(obj.deadline);
          //   return deadline > today;
          // })
          response.data
        );
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

  return (
    <>
      <Container>
        <Row className="my-3">
          <Col xs={12} sm={8} md={6} lg={4}>
            <h1>Jobs</h1>
          </Col>

          <Col xs={12} sm={8} md={6} lg={4} className="d-flex">
            <InputGroup className="mb-3">
              <Form.Control
                placeholder="Search Jobs"
                value={searchOptions.query}
                onChange={(event) =>
                  setSearchOptions({
                    ...searchOptions,
                    query: event.target.value,
                  })
                }
                onKeyPress={(ev) => {
                  if (ev.key === "Enter") {
                    getData();
                  }
                }}
              />
              <Button
                variant="outline-secondary"
                onClick={() => getData()}
                style={{ border: "none", outline: "none" }}
              >
                <i className="bi bi-search"></i>
              </Button>
            </InputGroup>
          </Col>
          <Col xs="auto">
            <Button onClick={() => setFilterOpen(true)} variant="none">
              <i class="bi bi-filter p-0" ></i>
            </Button>
          </Col>
        </Row>

        <Col className="g-3">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <Row xs={12} sm={6} md={4} lg={3} key={job.id}>
                <JobTile job={job} />
              </Row>
            ))
          ) : (
            <Row xs={12}>
              <div className="text-center">
                <h5>No jobs found</h5>
              </div>
            </Row>
          )}
        </Col>
      </Container>
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
    </>
  );
};

export default Home;
