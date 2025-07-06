import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';

function MyNav() {

  let driverSession;
  let riderSession;
  console.log(sessionStorage);

  if (sessionStorage.getItem("driver")) {
    driverSession = sessionStorage.getItem("driver");
  }
  if (sessionStorage.getItem("rider")) {
    riderSession = sessionStorage.getItem("rider");
  }
  
  return (
        <Navbar expand="lg" variant='light'>
            <Navbar.Brand as={Link} to="/">مشوار</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              { !riderSession && driverSession? (
                <Nav className="me-auto">
                    <Nav.Link as={Link} to="/logout">تسجيل الخروج</Nav.Link>
                </Nav>
              ) : 
                !driverSession && riderSession?
                (
                  <Nav className="me-auto">
                      <Nav.Link as={Link} to="/logout">تسجيل الخروج</Nav.Link>
                  </Nav>
                ): null}
            </Navbar.Collapse>
        </Navbar>
  );
}

export default MyNav;