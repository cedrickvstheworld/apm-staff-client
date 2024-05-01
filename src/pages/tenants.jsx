
import { Button, Card, Col, Container, Modal, Row, Tab, Tabs, Toast, ToastContainer } from 'react-bootstrap';
import Navigation from '../components/navbar';
import { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { CheckCircleFill, Trash } from 'react-bootstrap-icons';

function Tenants() {
  const [key, setKey] = useState('verified');
  const [baseVerified, setBaseVerified] = useState([])
  const [baseNonVerified, setBaseNonVerified] = useState([])

  const [tenantToVerify, setTenantToVerify] = useState(null)
  const [showV, setShowV] = useState(false)
  const [showSuccessV, setShowSuccessV] = useState(false);

  const [tenantToSuspend, setTenantToSuspend] = useState(null)
  const [showS, setShowS] = useState(false)
  const [showSuccessS, setShowSuccessS] = useState(false);

  const handleCloseV = () => {
    setTenantToVerify(null)
    setShowV(false)
  }
  const handleShowV = (tenant) => {
    setTenantToVerify(tenant)
    setShowV(true)
  }

  const handleCloseS = () => {
    setTenantToSuspend(null)
    setShowS(false)
  }
  const handleShowS = (tenant) => {
    setTenantToSuspend(tenant)
    setShowS(true)
  }

  useEffect(() => {
    axios.get(
      `${process.env.REACT_APP_API_HOST}/tenants?isVerified=false`,
      {
        headers: {
          access_token: localStorage.getItem('access_token'),
        }
      }
    )
      .then((response) => {
        setBaseNonVerified(response.data)
      })
      .catch((error) => {
        console.log(error)
      })

    axios.get(
      `${process.env.REACT_APP_API_HOST}/tenants?isVerified=true`,
      {
        headers: {
          access_token: localStorage.getItem('access_token'),
        }
      }
    )
      .then((response) => {
        setBaseVerified(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [showSuccessV, showSuccessS])

  const handleVerify = () => {
    axios.patch(`${process.env.REACT_APP_API_HOST}/tenants/verify/${tenantToVerify.id}`, {
      headers: {
        access_token: localStorage.getItem('access_token'),
      }})
    .then((response) => {
      handleCloseV()
      setShowSuccessV(true)
      return
    })
    .catch((error) => {
      handleCloseV()
      return
    })
  }

  const handleSuspend = () => {
    axios.patch(`${process.env.REACT_APP_API_HOST}/tenants/suspend/${tenantToSuspend.id}`, 
    {isSuspended: tenantToSuspend.isSuspended},
    {
      headers: {
        access_token: localStorage.getItem('access_token'),
      }})
    .then((response) => {
      handleCloseS()
      setShowSuccessS(true)
      return
    })
    .catch((error) => {
      handleCloseS()
      return
    })
  }

  return (
    <div className="Tenants">
      <Navigation />
      <Container style={{marginTop: '40px'}}>
        <Tabs
          id="controlled-tab-example"
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className="mb-3"
        >
          <Tab eventKey="verified" title="Verified">
            {!baseVerified.length ? (<div>
              <h2 className="text-secondary">There is nothing in here</h2>
            </div>) : null}
            {baseVerified.map(({
              id,
              email,
              firstName,
              middleName,
              lastName,
              contact,
              gender,
              createdAt,
              updatedAt,
              isSuspended,
            }, i) => (
              <Card 
                bg={parseInt(i) % 2 === 0 ? 'dark' : 'light'}
                className={parseInt(i) % 2 === 0 ? 'text-white' : ''}
                style={{marginBottom: '20px'}} 
                key={id}>
                <Card.Body>
                  <Row>
                    <Col sm={5} md={4}>
                      <span className='text-secondary'>First Name:</span> {firstName} <br />
                      <span className='text-secondary'>Middle Name:</span> {middleName ? middleName : 'N/A'} <br />
                      <span className='text-secondary'>Last Name:</span> {lastName}
                    </Col>
                    <Col sm={7} md={4}>
                      <span className='text-secondary'>Email Address:</span> {email} <br />
                      <span className='text-secondary'>Contact No.:</span> {contact} <br />
                      <span className='text-secondary'>Gender:</span> {gender}
                    </Col>
                    <Col sm={5} md={2}>
                      <span className='text-secondary'>Date of Sign-up: </span> {moment(createdAt).format('MMMM DD, YYYY h:mm A')} <br />
                      {updatedAt ? 
                      (<><span className='text-secondary'>Last Updated:</span> {moment(updatedAt).format('MMMM DD, YYYY h:mm A')} <br /></>) 
                      : <br />}
                    </Col>
                    <Col sm={12} md={2}>
                      <div className="d-flex justify-content-end card-icon-controls">
                        <Button 
                          onClick={() => handleShowS({
                            id,
                            firstName,
                            lastName,
                            middleName,
                            isSuspended: !isSuspended,
                          })}
                          variant={isSuspended ? 'success' : 'danger'}
                        >
                          {isSuspended ? 'Unsuspend' : 'Suspend'}
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
          </Tab>

          <Tab eventKey="profile" title="Non-Verified">
            {!baseNonVerified.length ? (<div>
              <h2 className="text-secondary">There is nothing in here</h2>
            </div>) : null}
          {baseNonVerified.map(({
            id,
            email,
            firstName,
            middleName,
            lastName,
            contact,
            gender,
            createdAt,
            updatedAt,
          }, i) => (
            <Card 
              bg={parseInt(i) % 2 === 0 ? 'dark' : 'light'}
              className={parseInt(i) % 2 === 0 ? 'text-white' : ''}
              style={{marginBottom: '20px'}} 
              key={id}>
              <Card.Body>
                <Row>
                  <Col sm={5} md={4}>
                    <span className='text-secondary'>First Name:</span> {firstName} <br />
                    <span className='text-secondary'>Middle Name:</span> {middleName ? middleName : 'N/A'} <br />
                    <span className='text-secondary'>Last Name:</span> {lastName}
                  </Col>
                  <Col sm={7} md={4}>
                    <span className='text-secondary'>Email Address:</span> {email} <br />
                    <span className='text-secondary'>Contact No.:</span> {contact} <br />
                    <span className='text-secondary'>Gender:</span> {gender}
                  </Col>
                  <Col sm={5} md={2}>
                    <span className='text-secondary'>Date of Sign-up: </span> {moment(createdAt).format('MMMM DD, YYYY h:mm A')} <br />
                    {updatedAt ? 
                    (<><span className='text-secondary'>Last Updated:</span> {moment(updatedAt).format('MMMM DD, YYYY h:mm A')} <br /></>) 
                    : <br />}
                  </Col>
                  <Col sm={12} md={2}>
                    <div className="d-flex justify-content-end card-icon-controls">
                      <Trash
                        style={{cursor: 'pointer', marginRight: '10px'}}
                        // onClick={() => handleShowV({id})}
                        className="text-danger" size={45} />
                      <CheckCircleFill
                        style={{cursor: 'pointer'}}
                        onClick={() => handleShowV({id, firstName, lastName, middleName})}
                        className="text-success" size={45} />
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
          </Tab>

        </Tabs>
      </Container>

      <Modal centered show={showV} onHide={handleCloseV} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Verification</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {tenantToVerify ? (<span className="text-primary">{`${tenantToVerify.lastName}, ${tenantToVerify.firstName} ${tenantToVerify.middleName}`} <br /></span>) : null}
          Verify this person as a tenant?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseV}>
            Close
          </Button>
          <Button variant="success" onClick={handleVerify}>
            Proceed
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer position='bottom-end' style={{position: 'fixed', padding: '20px'}}>
        <Toast bg="success" onClose={() => setShowSuccessV(false)} show={showSuccessV} delay={4000} autohide>
          <Toast.Header>
            <strong className="me-auto">Info</strong>
          </Toast.Header>
          <Toast.Body className="text-white">Tenant was verified</Toast.Body>
        </Toast>
      </ToastContainer>

      <Modal centered show={showS} onHide={handleCloseS} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Attention!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {tenantToSuspend ? (<span className="text-primary">{`${tenantToSuspend.lastName}, ${tenantToSuspend.firstName} ${tenantToSuspend.middleName}`} <br /></span>) : null}
          {tenantToSuspend && tenantToSuspend.isSuspended ? 'Suspend' : 'Unsuspend'} this tenant?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseS}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSuspend}>
            Proceed
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer position='bottom-end' style={{position: 'fixed', padding: '20px'}}>
        <Toast bg="success" onClose={() => setShowSuccessS(false)} show={showSuccessS} delay={4000} autohide>
          <Toast.Header>
            <strong className="me-auto">Info</strong>
          </Toast.Header>
          <Toast.Body className="text-white">Tenant status was updated</Toast.Body>
        </Toast>
      </ToastContainer>

    </div>
  );
}

export default Tenants;
