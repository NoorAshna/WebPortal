import { Toast, ToastContainer } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const MessagePopup = (props) => {
  const handleClose = () => {
    props.setOpen(false);
  };

  // Define background color based on severity
  const getBackgroundColor = (severity) => {
    switch (severity) {
      case 'success':
        return 'bg-success text-white';
      case 'error':
        return 'bg-danger text-white';
      case 'warning':
        return 'bg-warning text-dark';
      case 'info':
        return 'bg-info text-white';
      default:
        return 'bg-light text-dark';
    }
  };

  // Icon mapping based on severity
  const getIcon = (severity) => {
    switch (severity) {
      case 'success':
        return 'bi-check-circle';
      case 'error':
        return 'bi-exclamation-circle';
      case 'warning':
        return 'bi-exclamation-triangle';
      case 'info':
        return 'bi-info-circle';
      default:
        return '';
    }
  };

  return (
    <ToastContainer  position="top-end"
    className="p-3"
    style={{
      position: 'fixed', 
      zIndex: 1050,
      top: '1rem',
      right: '1rem',
    }}>
      <Toast
        onClose={handleClose}
        show={props.open}
        delay={2000}
        autohide
        className={getBackgroundColor(props.severity)}
      >
        <Toast.Header>
          <i className={`me-2 bi ${getIcon(props.severity)}`} />
          <strong className="me-auto">{props.severity.toUpperCase()}</strong>
        </Toast.Header>
        <Toast.Body>{props.message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default MessagePopup;
