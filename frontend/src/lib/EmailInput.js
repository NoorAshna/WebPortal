import { Form } from "react-bootstrap";

const EmailInput = (props) => {
  const {
    label,
    value,
    onChange,
    inputErrorHandler,
    handleInputError,
    required,
    className,
  } = props;

  return (
    <Form.Group className={className} >
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type="email"
        value={value}
        onChange={onChange}
        onBlur={(event) => {
          if (event.target.value === "") {
            if (required) {
              handleInputError("email", true, "Email is required");
            } else {
              handleInputError("email", false, "");
            }
          } else {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (re.test(String(event.target.value).toLowerCase())) {
              handleInputError("email", false, "");
            } else {
              handleInputError("email", true, "Incorrect email format");
            }
          }
        }}
        isInvalid={inputErrorHandler.email.error}
      />
      <Form.Control.Feedback type="invalid">
        {inputErrorHandler.email.message}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default EmailInput;
