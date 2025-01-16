import homeImage from "../Images/homeImage.jpg";
import { Image , Container , Row , Col, Button } from 'react-bootstrap'
const Welcome = (props) => {

  return (
    <Container className="mt-5 bg-tertiary py-4" >
      <Row className="align-items-center " >
      <Col >
        <h1 >Find Your Dream Job</h1>
        <p >Discover the perfect job for you with our extensive listings. 
          Explore a wide range of opportunities and take the first step towards your dream career</p>
          <Button  className="rounded-pill px-4 custom" href="/home">View Jobs</Button>
      </Col>
      <Col  className="text-center">
        <Image src={homeImage} alt="home Image" rounded  fluid style={{maxWidth:"450px" }}/>
      </Col>
      </Row>
    </Container>
  );
};

export const ErrorPage = (props) => {
  return (
    <Container className="d-flex flex-column justify-content-center align-items-center p-2" style={{ minHeight: "93vh" }}>
      <Row>
        <Col>
          <h1>Error 404</h1>
        </Col>
      </Row>
    </Container>
  );
};

export default Welcome;
