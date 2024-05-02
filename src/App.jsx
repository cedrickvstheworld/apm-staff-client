import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Tenants from './pages/tenants';
import Landing from './pages/landing';
import Rooms from './pages/rooms';
import Dashboard from './pages/dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tenants" element={<Tenants />} />
        <Route path="/rooms" element={<Rooms />} />
      </Routes>
    </Router>
  );
}

export default App;
