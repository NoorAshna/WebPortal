import { createContext, useState } from "react";
import { BrowserRouter,  Route, Routes } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Welcome, { ErrorPage } from "./component/Welcome";
import AppNavbar from "./component/AppNavbar";
import Login from "./component/Login";
import Logout from "./component/Logout";
import Signup from "./component/Signup";
import Home from "./component/Home";
import Applications from "./component/Applications";
import Profile from "./component/Profile";
import CreateJobs from "./component/recruiter/CreateJobs";
import MyJobs from "./component/recruiter/MyJobs";
import JobApplications from "./component/recruiter/JobApplications";
import RecruiterProfile from "./component/recruiter/Profile";
import MessagePopup from "./lib/MessagePopup";
import isAuth, { userType } from "./lib/isAuth";
import Footer from "./component/Footer";
import 'bootstrap/dist/css/bootstrap.min.css';

const bodyStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  minHeight: "98vh",
  boxSizing: "border-box",
  width: "100%",
};

export const SetPopupContext = createContext();

function App() {
  const [popup, setPopup] = useState({
    open: false,
    severity: "",
    message: "",
  });

  return (
    <BrowserRouter>
      <SetPopupContext.Provider value={setPopup}>
        <Container fluid>
          <Row>
            <Col>
              <AppNavbar />
            </Col>
          </Row>
          <Row>
            <Col style={bodyStyle}>
              <Routes>
                <Route exact path="/" element={<Welcome />} />
                <Route exact path="/login" element={<Login />} />
                <Route exact path="/signup" element={<Signup />} />
                <Route exact path="/logout" element={<Logout />} />
                <Route exact path="/home" element={<Home />} />
                <Route exact path="/applications" element={<Applications />} />
                <Route exact path="/profile" element={userType() === "recruiter" ? <RecruiterProfile />: <Profile />} />
                <Route exact path="/addjob" element={<CreateJobs />} />
                <Route exact path="/myjobs" element={<MyJobs />} />
                <Route exact path="/job/applications/:jobId" element={<JobApplications />} />
                <Route path="*" element={<ErrorPage />} />
              </Routes>
            </Col>
          </Row>
          <Row>
            <Col>
              <Footer />
            </Col>
          </Row>
        </Container>
        <MessagePopup
          open={popup.open}
          setOpen={(status) =>
            setPopup({
              ...popup,
              open: status,
            })
          }
          severity={popup.severity}
          message={popup.message}
        />
      </SetPopupContext.Provider>
    </BrowserRouter>
  );
}

export default App;
