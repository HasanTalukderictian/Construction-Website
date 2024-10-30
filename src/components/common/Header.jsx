import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

const Header = () => {
  return (
     <>
          <header>
              <div className='container py-3'>

                  <Navbar expand="lg">

                      <Navbar.Brand href="#home" className='logo'> <span>Gazi</span> Builders</Navbar.Brand>
                      <Navbar.Toggle aria-controls="basic-navbar-nav" />
                      <Navbar.Collapse id="basic-navbar-nav">
                          <Nav className="ms-auto">
                              <Nav.Link href="/" className='nav-link'>Home</Nav.Link>
                              <Nav.Link href="/about" className='nav-link'>About Us</Nav.Link>
                              <Nav.Link href="/projects" className='nav-link'>Projects</Nav.Link>
                              <Nav.Link href="/blogs" className='nav-link'>Blogs</Nav.Link>
                              <Nav.Link href="/service" className='nav-link'>Services</Nav.Link>
                              {/* <NavDropdown title="Services" id="basic-nav-dropdown">
                                  <NavDropdown.Item href="#action/3.1" className='nav-link'>Action</NavDropdown.Item>
                                  <NavDropdown.Item href="#action/3.2" className='nav-link'>
                                      Another action
                                  </NavDropdown.Item>
                                  <NavDropdown.Item href="#action/3.3" className='nav-link'>Something</NavDropdown.Item>
                                  <NavDropdown.Divider />
                                  <NavDropdown.Item href="#action/3.4" className='nav-link'>
                                      Separated link
                                  </NavDropdown.Item>
                              </NavDropdown> */}
                              <Nav.Link href="#home" className='nav-link'>Portfilo</Nav.Link>
                              <Nav.Link href="#link" className='nav-link'>Contact</Nav.Link>
                          </Nav>
                      </Navbar.Collapse>

                  </Navbar>
              </div>
          </header>
     </>
  )
}

export default Header
