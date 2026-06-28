import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import { CartContext } from "../frontend/CartContext";
import "../../assets/css/header.scss";
import Logo from "../../assets/images/BDStall logo.png";

export const API_BASE = import.meta.env.VITE_API_BASE_URL;

let headerCache = null;

const Header = () => {
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("MEN");
  const [categories, setCategories] = useState({});
  const [dynamicLogo, setDynamicLogo] = useState(headerCache?.image || null);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get(`${API_BASE}/all-category`)
      .then((res) => {
        if (res.data.success) {
          const catData = {};
          res.data.data.forEach((parent) => {
            const key = parent.name.toUpperCase();
            catData[key] = {
              left1Title: parent.name,
              left1: parent.sub_categories.map((sub) => [
                sub.name,
                `/products/${parent.name.toLowerCase()}/${sub.name.toLowerCase().replace(/\s+/g, "-")}`,
              ]),
              left2Title: "",
              left2: [],
            };
          });
          setCategories(catData);
          const firstTab = Object.keys(catData)[0];
          if (firstTab) setActiveTab(firstTab);
        }
      })
      .catch((err) => console.log("API Error: ", err));
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (!headerCache) {
      axios
        .get(`${API_BASE}/get-header`)
        .then((res) => {
          if (res.data.status && res.data.data.length > 0) {
            setDynamicLogo(res.data.data[0].image);
            headerCache = res.data.data[0];
          }
        })
        .catch((err) => console.log("Header API Error:", err));
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/category/${searchTerm.trim()}`);
      setSearchTerm("");
    }
  };

  const tabs = Object.keys(categories);

  const subHeaderStyle = {
    background: "linear-gradient(90deg, #1c8b41, #385486)",
    color: "#fff",
    padding: "10px 0",
    overflow: "hidden",
    whiteSpace: "nowrap",
    fontSize: "14px",
    fontWeight: "500",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    display: "flex",
    alignItems: "center"
  };

  const customCSS = `
    @keyframes marquee {
      0% { transform: translateX(100%); }
      100% { transform: translateX(-150%); } 
    }
    .marquee-container { width: 100%; overflow: hidden; }
    .marquee-text { display: inline-block; padding-left: 100%; animation: marquee 200s linear infinite; }
    .marquee-text:hover { animation-play-state: paused; cursor: pointer; }
    
    .search-container {
      max-width: 400px;
      margin: 0 15px;
      width: 100%;
    }
    .search-input-group {
      background: #f1f3f4;
      border-radius: 50px;
      padding: 2px 15px;
      border: 1px solid transparent;
      transition: all 0.3s ease;
    }
    .search-input-group:focus-within {
      background: #fff;
      border-color: #1c8b41;
      box-shadow: 0 0 8px rgba(28, 139, 65, 0.2);
    }
    .search-field {
      border: none !important;
      background: transparent !important;
      box-shadow: none !important;
      padding: 8px 10px;
      font-size: 14px;
    }
    .search-icon-btn {
      background: transparent;
      border: none;
      color: #666;
      transition: color 0.3s;
    }
    .search-icon-btn:hover { color: #1c8b41; }

    /* FIX: Always show login button */
    .login-btn-container {
      display: flex;
      align-items: center;
      margin-left: 15px;
    }
    
    .login-btn-container .btn-login {
      background-color: #1c8b41;
      color: white !important;
      padding: 8px 20px;
      border-radius: 50px;
      font-weight: 600;
      font-size: 14px;
      border: none;
      transition: all 0.3s ease;
      text-decoration: none;
      display: inline-block;
    }
    
    .login-btn-container .btn-login:hover {
      background-color: #146a32;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(28, 139, 65, 0.3);
      color: white !important;
    }

    .profile-link {
      font-weight: 600;
      color: #1c8b41;
      text-decoration: none;
      padding: 8px 15px;
      border-radius: 50px;
      transition: all 0.3s ease;
    }
    
    .profile-link:hover {
      background-color: #f0f0f0;
      color: #146a32;
    }

    @media (max-width: 991px) {
      .search-container { 
        margin: 10px 0; 
        max-width: 100%; 
      }
      .login-btn-container {
        margin-left: 0;
        margin-top: 10px;
        width: 100%;
      }
      .login-btn-container .btn-login {
        width: 100%;
        text-align: center;
      }
    }

    /* Fix navbar collapse issues */
    .navbar-collapse {
      flex-grow: 0 !important;
    }
    
    @media (max-width: 991px) {
      .navbar-collapse {
        flex-grow: 1 !important;
      }
    }
  `;

  const scrollingMessage = `Welcome to BDStall! Enjoy our exclusive Eid Special Offer with up to 50% discount on all premium electronics, fashion, and home appliances. Happy shopping!`;

  return (
    <>
      <style>{customCSS}</style>

      {/* SUB HEADER */}
      <div style={subHeaderStyle}>
        <div className="marquee-container">
          <div className="marquee-text">
            <i className="bi bi-megaphone-fill me-2" style={{ color: '#ffc107' }}></i>
            {scrollingMessage}
            &nbsp;&nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;&nbsp;
            <i className="bi bi-stars me-2" style={{ color: '#ffc107' }}></i>
            Get Extra 5% Discount on Pre-payment!
          </div>
        </div>
      </div>

      <header className="sticky-header shadow-sm bg-white">
        <div className="container py-2">
          <Navbar expand="lg" className="p-0">
            {/* LOGO */}
            <Navbar.Brand onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
              <img
                src={dynamicLogo || Logo}
                alt="BDStall Logo"
                style={{ maxHeight: "50px", width: "auto" }}
              />
            </Navbar.Brand>

            {/* SEARCH BOX - Desktop */}
            <div className="search-container d-none d-lg-block">
              <Form onSubmit={handleSearch}>
                <InputGroup className="search-input-group">
                  <Form.Control
                    placeholder="Search for Gadget, Fashion..."
                    className="search-field"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button type="submit" className="search-icon-btn">
                    <i className="bi bi-search"></i>
                  </button>
                </InputGroup>
              </Form>
            </div>

            {/* LOGIN BUTTON - ALWAYS VISIBLE */}
           

            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto align-items-center">
                <Nav.Link onClick={() => navigate("/")}>Home</Nav.Link>
                <Nav.Link onClick={() => setShowModal(true)}>Product</Nav.Link>
                <Nav.Link onClick={() => navigate("/about")}>About Us</Nav.Link>
                <Nav.Link onClick={() => navigate("/cart")} className="position-relative">
                  <i className="bi bi-cart3 fs-5 me-1" style={{ color: "#1c8b41" }}></i>
                  {cartItems.length > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: "-2px",
                        right: "-5px",
                        background: "red",
                        color: "#fff",
                        borderRadius: "50%",
                        padding: "2px 6px",
                        fontSize: "10px",
                      }}
                    >
                      {cartItems.length}
                    </span>
                  )}
                </Nav.Link>
                <Nav.Link onClick={() => navigate("/contact")}>Contact</Nav.Link>

                {/* Mobile Login Button - Visible in collapse */}
                <div className="login-btn-container d-lg-none w-100">
                  {user ? (
                    <Nav.Link 
                      onClick={() => navigate("/profile")} 
                      className="profile-link"
                      style={{ padding: "8px 15px", width: "100%", textAlign: "center" }}
                    >
                      <i className="bi bi-person-circle me-1"></i>
                      My Profile
                    </Nav.Link>
                  ) : (
                    <button 
                      onClick={() => navigate("/userlogin")} 
                      className="btn-login"
                      style={{ width: "100%", textAlign: "center" }}
                    >
                      <i className="bi bi-box-arrow-in-right me-1"></i>
                      Login
                    </button>
                  )}
                </div>
              </Nav>
              
              {/* SEARCH BOX - Mobile */}
              <div className="search-container d-lg-none">
                <Form onSubmit={handleSearch}>
                  <InputGroup className="search-input-group">
                    <Form.Control
                      placeholder="Search..."
                      className="search-field"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit" className="search-icon-btn">
                      <i className="bi bi-search"></i>
                    </button>
                  </InputGroup>
                </Form>
              </div>
            </Navbar.Collapse>
             <div className="login-btn-container ms-auto d-none d-lg-flex">
              {user ? (
                <Nav.Link 
                  onClick={() => navigate("/profile")} 
                  className="profile-link"
                  style={{ padding: "8px 15px" }}
                >
                  <i className="bi bi-person-circle me-1"></i>
                  My Profile
                </Nav.Link>
              ) : (
                <button 
                  onClick={() => navigate("/userlogin")} 
                  className="btn-login"
                >
                                
                  Login
                </button>
              )}
            </div>
          </Navbar>
        </div>
      </header>

      {/* PRODUCT MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
        <Modal.Body className="mega-modal">
          <div className="mega-top-menu d-flex justify-content-center gap-5 mb-4">
            {tabs.map((tab) => (
              <span
                key={tab}
                className={activeTab === tab ? "active-tab" : ""}
                onClick={() => setActiveTab(tab)}
                style={{ cursor: "pointer" }}
              >
                {tab}
              </span>
            ))}
          </div>

          <div className="row">
            <div className="col-md-12 d-flex gap-5">
              {categories[activeTab] && (
                <>
                  <div>
                    <h6 className="mega-title">{categories[activeTab].left1Title}</h6>
                    <ul className="mega-list">
                      {categories[activeTab].left1.map(([name, path]) => (
                        <li
                          key={name}
                          onClick={() => {
                            navigate(path || "/null");
                            setShowModal(false);
                          }}
                        >
                          {name}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {categories[activeTab].left2 && categories[activeTab].left2.length > 0 && (
                    <div>
                      <h6 className="mega-title text-success">{categories[activeTab].left2Title}</h6>
                      <ul className="mega-list">
                        {categories[activeTab].left2.map(([name, path]) => (
                          <li
                            key={name}
                            onClick={() => {
                              navigate(path || "/null");
                              setShowModal(false);
                            }}
                          >
                            {name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Header;