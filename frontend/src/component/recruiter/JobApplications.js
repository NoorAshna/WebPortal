import { useState, useEffect, useContext } from "react";
import {
  Button,
  Modal,
  Form,
  Row,
  Col,
  Container,
  Card,
  Badge,
  Image,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "axios";
import { SetPopupContext } from "../../App";
import apiList, { server } from "../../lib/apiList";
import { FaFilter, FaArrowUp, FaArrowDown } from "react-icons/fa";

const FilterPopup = (props) => {
  const { open, handleClose, searchOptions, setSearchOptions, getData } = props;
  return (
    <Modal show={open} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Filter Applications</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group as={Row} controlId="formApplicationStatus">
            <Form.Label column sm={3}>
              Application Status
            </Form.Label>
            <Col sm={9}>
              <Form.Check
                type="checkbox"
                label="Rejected"
                name="rejected"
                checked={searchOptions.status.rejected}
                onChange={(event) => {
                  setSearchOptions({
                    ...searchOptions,
                    status: {
                      ...searchOptions.status,
                      [event.target.name]: event.target.checked,
                    },
                  });
                }}
              />
              <Form.Check
                type="checkbox"
                label="Applied"
                name="applied"
                checked={searchOptions.status.applied}
                onChange={(event) => {
                  setSearchOptions({
                    ...searchOptions,
                    status: {
                      ...searchOptions.status,
                      [event.target.name]: event.target.checked,
                    },
                  });
                }}
              />
              <Form.Check
                type="checkbox"
                label="Shortlisted"
                name="shortlisted"
                checked={searchOptions.status.shortlisted}
                onChange={(event) => {
                  setSearchOptions({
                    ...searchOptions,
                    status: {
                      ...searchOptions.status,
                      [event.target.name]: event.target.checked,
                    },
                  });
                }}
                />
              </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="formSort">
              <Form.Label column sm={3}>
                Sort
              </Form.Label>
              <Col sm={9}>
                <div className="d-flex align-items-center">
                <Form.Check
                  type="checkbox"
                  label="Name"
                  name="name"
                  checked={searchOptions.sort["jobApplicant.name"].status}
                  onChange={(event) =>
                  setSearchOptions({
                    ...searchOptions,
                    sort: {
                    ...searchOptions.sort,
                    "jobApplicant.name": {
                      ...searchOptions.sort["jobApplicant.name"],
                      status: event.target.checked,
                    },
                    },
                  })
                  }
                  id="name"
                />
                <Button
                  variant="link"
                  disabled={!searchOptions.sort["jobApplicant.name"].status}
                  onClick={() => {
                  setSearchOptions({
                    ...searchOptions,
                    sort: {
                    ...searchOptions.sort,
                    "jobApplicant.name": {
                      ...searchOptions.sort["jobApplicant.name"],
                      desc: !searchOptions.sort["jobApplicant.name"].desc,
                    },
                    },
                  });
                  }}
                >
                  {searchOptions.sort["jobApplicant.name"].desc ? (
                  <FaArrowDown />
                  ) : (
                  <FaArrowUp />
                  )}
                </Button>
                </div>
                <div className="d-flex align-items-center">
                <Form.Check
                  type="checkbox"
                  label="Date of Application"
                  name="dateOfApplication"
                  checked={searchOptions.sort.dateOfApplication.status}
                  onChange={(event) =>
                  setSearchOptions({
                    ...searchOptions,
                    sort: {
                    ...searchOptions.sort,
                    dateOfApplication: {
                      ...searchOptions.sort.dateOfApplication,
                      status: event.target.checked,
                    },
                    },
                  })
                  }
                  id="dateOfApplication"
                />
                <Button
                  variant="link"
                  disabled={!searchOptions.sort.dateOfApplication.status}
                  onClick={() => {
                  setSearchOptions({
                    ...searchOptions,
                    sort: {
                      ...searchOptions.sort,
                      dateOfApplication: {
                        ...searchOptions.sort.dateOfApplication,
                        desc: !searchOptions.sort.dateOfApplication.desc,
                      },
                    },
                  });
                }}
              >
                {searchOptions.sort.dateOfApplication.desc ? (
                  <FaArrowDown />
                ) : (
                  <FaArrowUp />
                )}
              </Button>
              </div>
              <div className="d-flex align-items-center">
              <Form.Check
                type="checkbox"
                label="Rating"
                name="rating"
                checked={searchOptions.sort["jobApplicant.rating"].status}
                onChange={(event) =>
                  setSearchOptions({
                    ...searchOptions,
                    sort: {
                      ...searchOptions.sort,
                      "jobApplicant.rating": {
                        ...searchOptions.sort["jobApplicant.rating"],
                        status: event.target.checked,
                      },
                    },
                  })
                }
                id="rating"
              />
              <Button
                variant="link"
                disabled={!searchOptions.sort["jobApplicant.rating"].status}
                onClick={() => {
                  setSearchOptions({
                    ...searchOptions,
                    sort: {
                      ...searchOptions.sort,
                      "jobApplicant.rating": {
                        ...searchOptions.sort["jobApplicant.rating"],
                        desc: !searchOptions.sort["jobApplicant.rating"].desc,
                      },
                    },
                  });
                }}
              >
                {searchOptions.sort["jobApplicant.rating"].desc ? (
                  <FaArrowDown />
                ) : (
                  <FaArrowUp />
                )}
              </Button>
              </div>

            </Col>
          </Form.Group>
          <Button variant="primary" onClick={() => getData()}>
            Apply
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

const ApplicationTile = (props) => {
  const { application, getData } = props;
  const setPopup = useContext(SetPopupContext);
  const [open, setOpen] = useState(false);

  const appliedOn = new Date(application.dateOfApplication);

  const handleClose = () => {
    setOpen(false);
  };

  const colorSet = {
    applied: "primary",
    shortlisted: "warning",
    accepted: "success",
    rejected: "danger",
    deleted: "secondary",
    cancelled: "light",
    finished: "info",
  };

  const getResume = () => {
    if (
      application.jobApplicant.resume &&
      application.jobApplicant.resume !== ""
    ) {
      const address = `${server}${application.jobApplicant.resume}`;
      console.log(address);
      axios(address, {
        method: "GET",
        responseType: "blob",
      })
        .then((response) => {
          const file = new Blob([response.data], { type: "application/pdf" });
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
        })
        .catch((error) => {
          console.log(error);
          setPopup({
            open: true,
            severity: "error",
            message: "Error",
          });
        });
    } else {
      setPopup({
        open: true,
        severity: "error",
        message: "No resume found",
      });
    }
  };

  const updateStatus = (status) => {
    const address = `${apiList.applications}/${application._id}`;
    const statusData = {
      status: status,
      dateOfJoining: new Date().toISOString(),
    };
    axios
      .put(address, statusData, {
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
        console.log(err.response);
      });
  };

  const buttonSet = {
    applied: (
      <>
        <Col>
          <Button
            variant="warning"
            onClick={() => updateStatus("shortlisted")}
          >
            Shortlist
          </Button>
        </Col>
        <Col>
          <Button variant="danger" onClick={() => updateStatus("rejected")}>
            Reject
          </Button>
        </Col>
      </>
    ),
    shortlisted: (
      <>
        <Col>
          <Button variant="success" onClick={() => updateStatus("accepted")}>
            Accept
          </Button>
        </Col>
        <Col>
          <Button variant="danger" onClick={() => updateStatus("rejected")}>
            Reject
          </Button>
        </Col>
      </>
    ),
    rejected: (
      <Col>
        <Badge bg="danger">Rejected</Badge>
      </Col>
    ),
    accepted: (
    
        <Badge bg="success">Accepted</Badge>
      
    ),
    cancelled: (
      <Col>
        <Badge bg="light">Cancelled</Badge>
      </Col>
    ),
    finished: (
      <Col>
        <Badge bg="info">Finished</Badge>
      </Col>
    ),
  };

  return (
    <Card className="mb-3">
      <Card.Body>
        <Row>
          <Col xs={2} className="d-flex justify-content-center align-items-center">
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                backgroundColor: "#ccc",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "24px",
                color: "#fff",
              }}
            >
              {application.jobApplicant.name.charAt(0)}
            </div>
          </Col>
          <Col xs={7}>
            <Card.Title>{application.jobApplicant.name} {buttonSet[application.status]}</Card.Title>
            <Card.Text>Applied On: {appliedOn.toLocaleDateString()}</Card.Text>
            <Card.Text>
              Education:{" "}
              {application.jobApplicant.education
                .map((edu) => {
                  return `${edu.institutionName} (${edu.startYear}-${
                    edu.endYear ? edu.endYear : "Ongoing"
                  })`;
                })
                .join(", ")}
            </Card.Text>
            <Card.Text>
              SOP: {application.sop !== "" ? application.sop : "Not Submitted"}
            </Card.Text>
            <Card.Text>
              {application.jobApplicant.skills.map((skill) => (
                <Badge bg="secondary" className="me-1" key={skill}>
                  {skill}
                </Badge>
              ))}
            </Card.Text>
          </Col>
          <Col xs={3} className="d-flex flex-column justify-content-between">
            <Button variant="secondary" onClick={() => getResume()}>
              Download Resume
            </Button>
            
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};


const JobApplications = (props) => {
  const setPopup = useContext(SetPopupContext);
  const [applications, setApplications] = useState([]);
  const { jobId } = useParams();
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchOptions, setSearchOptions] = useState({
    status: {
      all: false,
      applied: false,
      shortlisted: false,
    },
    sort: {
      "jobApplicant.name": {
        status: false,
        desc: false,
      },
      dateOfApplication: {
        status: true,
        desc: true,
      },
      "jobApplicant.rating": {
        status: false,
        desc: false,
      },
    },
  });

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    let searchParams = [];

    if (searchOptions.status.rejected) {
      searchParams = [...searchParams, `status=rejected`];
    }
    if (searchOptions.status.applied) {
      searchParams = [...searchParams, `status=applied`];
    }
    if (searchOptions.status.shortlisted) {
      searchParams = [...searchParams, `status=shortlisted`];
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
    let address = `${apiList.applicants}?jobId=${jobId}`;
    if (queryString !== "") {
      address = `${address}&${queryString}`;
    }

    console.log(address);

    axios
      .get(address, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setApplications(response.data);
      })
      .catch((err) => {
        console.log(err.response);
        setApplications([]);
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
      });
  };

  return (
    <>
      <Container className="py-4">
        <Row className="mb-3">
          <Col>
            <h2>Applications</h2>
          </Col>
          <Col className="text-end">
            <Button variant="outline-primary" onClick={() => setFilterOpen(true)}>
              <FaFilter /> Filter
            </Button>
          </Col>
        </Row>
        <Row>
          {applications.length > 0 ? (
            applications.map((obj) => (
              <Col xs={12} key={obj._id}>
                <ApplicationTile application={obj} getData={getData} />
              </Col>
            ))
          ) : (
            <Col>
              <h5 className="text-center">No Applications Found</h5>
            </Col>
          )}
        </Row>
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

export default JobApplications;
