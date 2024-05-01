import Navigation from '../components/navbar';
import { Plus } from 'react-bootstrap-icons';
import { useEffect, useState } from 'react';
import { Modal, Form, Button, InputGroup, Container, Toast, ToastContainer, Card, Row, Col } from 'react-bootstrap';
import axios from "axios"
import moment from 'moment';

function Rooms() {
  const [baseRooms, setBaseRooms] = useState([])
  const [roomCode, setRoomCode] = useState('');
  const [buildingCode, setBuildingCode] = useState('');
  const [ratePerMonth, setRatePerMonth] = useState('');
  const [maxTenantCapacity, setMaxTenantCapacity] = useState(1);
  const [numberOfBedrooms, setNumberOfBedrooms] = useState(0);
  const [numberOfFloors, setNumberOfFloors] = useState(1);
  const [hasKitchen, setHasKitchen] = useState(false)
  const [hasBathroomComfortRoom, setHasBathroomComfortRoom] = useState(false)
  const [showAdd, setShowAdd] = useState(false);
  const [show, setShow] = useState(false);
  const [showAPIError, setShowAPIError] = useState(false);
  const [APIError, setAPIError] = useState('')

  const handleShowAdd = () => {
    setShowAdd(true)
  }
  const handleCloseAdd = () => {
    setShowAdd(false)
  }

  const handleAddRoom = () => {
    const fields = [
      roomCode,
      buildingCode,
      ratePerMonth,
    ]
    for (const i in fields) {
      if (!fields[i] || !fields[i] === "") {
        setAPIError('incomplete form fields')
        setShowAPIError(true)
        return
      }
    }
    const data = {
      roomCode,
      buildingCode,
      ratePerMonth: parseFloat(ratePerMonth),
      maxTenantCapacity: parseInt(maxTenantCapacity),
      numberOfBedrooms: parseInt(numberOfBedrooms),
      numberOfFloors: parseInt(numberOfFloors),
      hasBathroomComfortRoom,
      hasKitchen,
    }
    axios.post(`${process.env.REACT_APP_API_HOST}/rooms`, data, {
      headers: {
        access_token: localStorage.getItem('access_token'),
      },
    })
    .then((response) => {
      setRoomCode('')
      setBuildingCode('')
      setRatePerMonth('')
      setShowAdd(false)
      setShow(true)
    })
    .catch((error) => {
      setAPIError(error.response.data.message)
      setShowAPIError(true)
    })
  }

  useEffect(() => {
    axios.get(
      `${process.env.REACT_APP_API_HOST}/rooms`,
      {
        headers: {
          access_token: localStorage.getItem('access_token'),
        }
      }
    )
      .then((response) => {
        setBaseRooms(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [show])

  return (
    <div className='Rooms'>
      <Navigation />
      <Container style={{marginTop: '40px'}}>
        <div className="d-flex justify-content-end mb-3">
          <Button 
            onClick={handleShowAdd} 
            variant="primary">
            <span>
              Add Room&nbsp;
              <Plus 
                style={{position: 'relative', bottom: '1px'}}
                className="text-light" size={25} />
            </span>
          </Button>
        </div>
          {!baseRooms.length ? (<div>
            <h2 className="text-secondary">There is nothing in here</h2>
            </div>) : null}
          {baseRooms.map(({
            id,
            roomCode,
            buildingCode,
            ratePerMonth,
            maxTenantCapacity,
            numberOfFloors,
            numberOfBedrooms,
            hasBathroomComfortRoom,
            hasKitchen,
            createdAt,
          }, i) => (
            <Card 
              bg={parseInt(i) % 2 === 0 ? 'dark' : 'light'}
              className={parseInt(i) % 2 === 0 ? 'text-white' : ''}
              style={{marginBottom: '20px'}} 
              key={id}>
              <Card.Body>
                <Row>
                  <Col sm={6} md={4}>
                    <span className='text-secondary'>Room Code:</span> {roomCode} <br />
                    <span className='text-secondary'>Building Code:</span> {buildingCode} <br />
                    <span className='text-secondary'>Rate Per Month:</span> PHP {ratePerMonth} <br />
                  </Col>
                  <Col sm={6} md={4}>
                    <span className='text-secondary'>Max Tenant Capacity:</span> {maxTenantCapacity} <br />
                    <span className='text-secondary'>Number of Floors:</span> {numberOfFloors} <br />
                    <span className='text-secondary'>Number of Bedrooms:</span> {numberOfBedrooms} <br />
                  </Col>
                  <Col sm={6} md={4}>
                    <span className='text-secondary'>Has Bathroom or CR?:</span> {hasBathroomComfortRoom ? 'Yes' : 'No'} <br />
                    <span className='text-secondary'>Has Kitchen?:</span> {hasKitchen ? 'Yes' : 'No'} <br />
                    <span className='text-secondary'>Date of Added: </span> {moment(createdAt).format('MMMM DD, YYYY h:mm A')} <br />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
      </Container>

      <Modal centered show={showAdd} onHide={handleCloseAdd} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Room</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="roomCode">
              <Form.Label>Room Code</Form.Label>
              <Form.Control 
                maxLength={100} 
                value={roomCode} onChange={e => setRoomCode(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="buildingCode">
              <Form.Label>Building Code</Form.Label>
              <Form.Control 
                maxLength={100} 
                value={buildingCode} onChange={e => setBuildingCode(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="ratePerMonth">
              <Form.Label>Rate Per Month</Form.Label>
              <InputGroup>
                <InputGroup.Text id="basic-addon1">PHP</InputGroup.Text>
                <Form.Control 
                  maxLength={10} 
                  type='number'
                  value={ratePerMonth} 
                  onChange={e => {setRatePerMonth(e.target.value)}}
                />
              </InputGroup>
            </Form.Group>
            <Form.Group className="mb-3" controlId="maxTenantCapacity">
              <Form.Label>Max Tenant Capacity</Form.Label>
              <InputGroup>
                <Form.Control 
                  maxLength={2} 
                  min={1}
                  type='number'
                  value={maxTenantCapacity} 
                  onChange={e => {setMaxTenantCapacity(e.target.value)}}
                />
              </InputGroup>
            </Form.Group>
            <Form.Group className="mb-3" controlId="numberOfFloors">
              <Form.Label>Number of Floors</Form.Label>
              <InputGroup>
                <Form.Control 
                  maxLength={2} 
                  min={1}
                  type='number'
                  value={numberOfFloors} 
                  onChange={e => {setNumberOfFloors(e.target.value)}}
                />
              </InputGroup>
            </Form.Group>
            <Form.Group className="mb-3" controlId="numberOfBedrooms">
              <Form.Label>Number of Bedrooms</Form.Label>
              <InputGroup>
                <Form.Control 
                  maxLength={2} 
                  type='number'
                  value={numberOfBedrooms} 
                  onChange={e => {setNumberOfBedrooms(e.target.value)}}
                />
              </InputGroup>
            </Form.Group>
            <Form.Group>
              <Form.Check
                defaultChecked={false}
                onChange={() => setHasBathroomComfortRoom((p) => !p)}
                type="switch"
                id="hasBathroomComfortRoom"
                label="Has Bathroom or Comfort Room?"
              />
            </Form.Group>
            <Form.Group>
              <Form.Check
                defaultChecked={false}
                onChange={() => setHasKitchen((p) => !p)}
                type="switch"
                id="hasKitchen"
                label="Has Kitchen?"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAdd}>
            Back
          </Button>
          <Button variant="success" onClick={handleAddRoom}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>

      
      <ToastContainer position='bottom-end' style={{position: 'fixed', padding: '20px'}}>
        <Toast bg="success" onClose={() => setShow(false)} show={show} delay={4000} autohide>
          <Toast.Header>
            <strong className="me-auto">Info</strong>
          </Toast.Header>
          <Toast.Body className="text-white">Room was added</Toast.Body>
        </Toast>
      </ToastContainer>   
      <ToastContainer position='bottom-end' style={{position: 'fixed', padding: '20px'}}>
        <Toast bg="danger" onClose={() => setShowAPIError(false)} show={showAPIError} delay={4000} autohide>
          <Toast.Header>
            <strong className="me-auto">Alert!</strong>
          </Toast.Header>
          <Toast.Body className="text-white">{APIError}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  )
}

export default Rooms