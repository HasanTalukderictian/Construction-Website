import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

const Header = () => {
  return (
    <>
      <header>
        <div className="container py-3">
          {/* Sticky navbar using sticky-top class */}
          <Navbar expand="lg" className="sticky-top bg-light">
            <Navbar.Brand href="#home" className="logo">
              <span>Gazi</span> Builders
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                <Nav.Link href="/" className="nav-link">Home</Nav.Link>
                <Nav.Link href="/about" className="nav-link">About Us</Nav.Link>
                <Nav.Link href="/projects" className="nav-link">Projects</Nav.Link>
                <Nav.Link href="/blogs" className="nav-link">Blogs</Nav.Link>
                <Nav.Link href="/service" className="nav-link">Services</Nav.Link>
                <Nav.Link href="/protfilo" className="nav-link">Portfilo</Nav.Link>
                <Nav.Link href="/contact" className="nav-link">Contact</Nav.Link>
                <Nav.Link href="/login" className="nav-link">Login</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </div>
      </header>
    </>
  );
};

export default Header;
