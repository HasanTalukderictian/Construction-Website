

import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import { CartContext } from "../frontend/CartContext";
import "../../assets/css/header.scss";
import Logo from "../../assets/images/BDStall logo.png"; // fallback logo


export const API_BASE = import.meta.env.VITE_API_BASE_URL;

// ===============================
// Simple module-level cache
// ===============================
let headerCache = null;

const Header = () => {
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("MEN");
  const [categories, setCategories] = useState({});
  const [dynamicLogo, setDynamicLogo] = useState(headerCache?.image || null); // cache use

  const [user, setUser] = useState(null);

  // ===============================
  // Fetch categories from API
  // ===============================
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

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/userlogin");
  };

  // ===============================
  // Fetch dynamic logo from API (with cache)
  // ===============================
  useEffect(() => {
    if (!headerCache) {
      axios
        .get(`${API_BASE}/get-header"`)
        .then((res) => {
          if (res.data.status && res.data.data.length > 0) {
            setDynamicLogo(res.data.data[0].image);
            headerCache = res.data.data[0]; // store in cache
          }
        })
        .catch((err) => console.log("Header API Error:", err));
    }
  }, []);

  // Tabs list
  const tabs = Object.keys(categories);

  return (
    <>
      <header className="sticky-header">
        <div className="container py-3">
          <Navbar expand="lg">
            <Navbar.Brand onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
              <img
                src={dynamicLogo || Logo} // dynamic logo with fallback
                alt="BDStall Logo"
                style={{ maxHeight: "60px", width: "auto" }}
              />
            </Navbar.Brand>

            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto align-items-center">
                <Nav.Link onClick={() => navigate("/")}>Home</Nav.Link>
                <Nav.Link onClick={() => navigate("/about")}>About Us</Nav.Link>
                <Nav.Link onClick={() => setShowModal(true)}>Product</Nav.Link>
                <Nav.Link onClick={() => navigate("/cart")} className="position-relative">
                  <i className="bi bi-cart-fill me-2" style={{ color: "green" }}></i>
                  Cart
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
                      }}
                    >
                      {cartItems.length}
                    </span>
                  )}
                </Nav.Link>
                <Nav.Link onClick={() => navigate("/contact")}>Contact</Nav.Link>

                {user ? (
                  <Nav.Link onClick={() => navigate("/profile")} style={{  fontWeight: "600" }}>
                    My Profile
                  </Nav.Link>
                ) : (
                  <Nav.Link onClick={() => navigate("/userlogin")}>
                    Login
                  </Nav.Link>
                )}
              </Nav>
            </Navbar.Collapse>
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
            <div className="col-md-6 d-flex gap-5">
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