import { useState } from "react";
import { Form, InputGroup, Button } from "react-bootstrap";
const PasswordInput = (props) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Form.Group controlId="formBasicPassword" className="mt-3">
      <Form.Label>{props.label}</Form.Label>
      <InputGroup>
        <Form.Control
          type={showPassword ? "text" : "password"}
          value={props.value}
          onChange={(event) => props.onChange(event)}
          onBlur={props.onBlur ? props.onBlur : null}
          className={props.className}
          isInvalid={props.error}
        />
          <Button variant="outline-secondary" onClick={handleShowPassword}>
          {showPassword ? (
              <i className="bi bi-eye-slash"></i>
            ) : (
              <i className="bi bi-eye"></i>
            )}
          </Button>
      </InputGroup>
    </Form.Group>
  );
};

export default PasswordInput;
