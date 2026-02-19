import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { CartContext } from '../frontend/CartContext';
import '../../assets/css/header.scss';

import Logo from '../../assets/images/BDStall logo.png';

const Header = () => {
    const { cartItems } = useContext(CartContext);
    const navigate = useNavigate();

    const handleProductClick = () => {
        navigate("/", { state: { scrollTo: "items" } });
    };

    return (
        <header className="sticky-header">
            <div className="container py-3">
                <Navbar expand="lg">
                    <Navbar.Brand href="/" className="logo d-flex align-items-center">
                        <img 
                            src={Logo} 
                            alt="BDStall Logo" 
                            style={{ 
                                maxHeight: "60px", // desktop size
                                width: "auto",
                            }} 
                            className="img-fluid"
                        />
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto align-items-center">
                            <Nav.Link href="/" className="nav-link">Home</Nav.Link>
                            <Nav.Link href="/about" className="nav-link">About Us</Nav.Link>

                            {/* ✅ Product scroll */}
                            <Nav.Link 
                                onClick={handleProductClick} 
                                className="nav-link"
                                style={{ cursor: "pointer" }}
                            >
                                Product
                            </Nav.Link>

                            <Nav.Link href="/cart" className="nav-link position-relative">
                                <i className="bi bi-cart-fill me-2" style={{ color: "green" }}></i> Cart
                                {cartItems.length > 0 && (
                                    <span
                                        style={{
                                            position: "absolute",
                                            top: "-5px",
                                            right: "-10px",
                                            background: "red",
                                            color: "#fff",
                                            borderRadius: "50%",
                                            padding: "2px 6px",
                                            fontSize: "12px",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        {cartItems.length}
                                    </span>
                                )}
                            </Nav.Link>

                            <Nav.Link href="/contact" className="nav-link">Contact</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        </header>
    );
}

export default Header;
