import axios from "axios";
import { useEffect, useState } from "react";
import { Form, Button, ToastContainer, Toast, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import authorize from "../utils/auth";

function Landing() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [APIError, setAPIError] = useState('')
  const [showHide, setShowHide] = useState('show')
  const [showAPIError, setShowAPIError] = useState(false);

  useEffect(() => {
    const auth = async () => {
      try {
        await authorize(localStorage.getItem('access_token'))
        navigate('/dashboard')
      } catch(e) {
        // pass
      }
    }
    auth()
  // eslint-disable-next-line
  }, [])
  
  const handleSignIn = () => {
    axios.post(
      `${process.env.REACT_APP_API_HOST}/staffs/sign-in`,
      { email, password }
    )
      .then((response) => {
        localStorage.setItem('access_token', response.data.user.accessToken)
        return navigate('/dashboard')
      })
      .catch((error) => {
        setAPIError(error.response.data.message)
        setShowAPIError(true)
      })
  }

  return (
    <div className="Landing">
      <div className="landing-container">
        <div className="left-pane">
        </div>
        <div className="right-pane">
          <div>
            <h3 style={{marginBottom: "30px"}}>APM Admin Login</h3>
            <Form>
              <Form.Group className="mb-3" controlId="username">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  maxLength={100}
                  value={email} onChange={e => setEmail(e.target.value)}
                />
              </Form.Group>
              <InputGroup className="mb-3">
                <Form.Control
                  maxLength={100}
                  type={showHide === 'show' ? 'password' : 'text'}
                  value={password} onChange={e => setPassword(e.target.value)}
                  aria-describedby="password"
                />
                <InputGroup.Text 
                  onClick={() => setShowHide(showHide === 'hide' ? 'show': 'hide')}
                  style={{cursor: 'pointer'}} 
                  id="password">{showHide}</InputGroup.Text>
              </InputGroup>
            </Form>
            <div className="d-flex justify-content-end">
              <Button onClick={handleSignIn} variant="primary">Sign In</Button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position='bottom-end' style={{position: 'fixed', padding: '20px'}}>
        <Toast bg="danger" onClose={() => setShowAPIError(false)} show={showAPIError} delay={4000} autohide>
          <Toast.Header>
            <strong className="me-auto">Alert!</strong>
          </Toast.Header>
          <Toast.Body className="text-white">{APIError}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}

export default Landing;
