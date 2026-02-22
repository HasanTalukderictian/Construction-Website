import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Modal from "react-bootstrap/Modal";
import "bootstrap-icons/font/bootstrap-icons.css";
import { CartContext } from "../frontend/CartContext";
import "../../assets/css/header.scss";
import Logo from "../../assets/images/BDStall logo.png";

const Header = () => {
    const { cartItems } = useContext(CartContext);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState("MEN");

    const categoryData = {
        MEN: {
            left1Title: "BOYS",
            left1: [
                ["T-shirt", "/products/boys/tshirt"],
                ["Shorts", "/products/boys/shorts"],
                ["Full Sleeve T-shirt", "/products/boys/full-sleeve"],
                ["Polo T-shirt", "/products/boys/polo"],
                ["Panjabi", "/products/boys/panjabi"],
            ],
            left2Title: "MEN ACCESSORIES",
            left2: [
                ["Belt", "/products/men/belt"],
                ["Cap", "/products/men/cap"],
                ["Wallet", "/products/men/wallet"],
                ["Watch", "/products/men/watch"],
            ],
        },

        WOMEN: {
            left1Title: "GIRLS",
            left1: [
                ["T-shirt", "/products/girls/tshirt"],
                ["Frock", "/products/girls/frock"],
                ["Hoodie", "/products/girls/hoodie"],
                ["Two Piece Set", "/products/girls/two-piece-set"],
            ],
            left2Title: "WOMEN",
            left2: [
                ["Saree", "/products/women/saree"],
                ["Three Piece", "/products/women/three-piece"],
                ["Kurti", "/products/women/kurti"],
                ["Bag", "/products/women/bag"],
            ],
        },

        TEENS: {
            left1Title: "TEEN BOYS",
            left1: [
                ["Graphic Tee", "/products/teen-boys/graphic-tee"],
                ["Joggers", "/products/teen-boys/joggers"],
                ["Hoodie", "/products/teen-boys/hoodie"],
            ],
            left2Title: "TEEN GIRLS",
            left2: [
                ["Crop Top", "/products/teen-girls/crop-top"],
                ["Skirt", "/products/teen-girls/skirt"],
                ["Denim Jacket", "/products/teen-girls/denim-jacket"],
            ],
        },

        KIDS: {
            left1Title: "BABY BOYS",
            left1: [
                ["Baby Romper", "/products/kids/baby-romper"],
                ["Baby Set", "/products/kids/baby-set"],
            ],
            left2Title: "BABY GIRLS",
            left2: [
                ["Baby Frock", "/products/kids/baby-frock"],
                ["Soft Toys", "/products/kids/soft-toys"],
            ],
        },

        SPORTS: {
            left1Title: "SPORTS MEN",
            left1: [
                ["Sports T-shirt", "/products/sports/men-tshirt"],
                ["Track Pant", "/products/sports/track-pant"],
            ],
            left2Title: "SPORTS WOMEN",
            left2: [
                ["Yoga Set", "/products/sports/yoga-set"],
                ["Gym Leggings", "/products/sports/leggings"],
            ],
        },
    };

    return (
        <>
            <header className="sticky-header">
                <div className="container py-3">
                    <Navbar expand="lg">
                        <Navbar.Brand
                            onClick={() => navigate("/")}
                            style={{ cursor: "pointer" }}
                        >
                            <img
                                src={Logo}
                                alt="BDStall Logo"
                                style={{ maxHeight: "60px", width: "auto" }}
                            />
                        </Navbar.Brand>

                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="ms-auto align-items-center">

                                <Nav.Link onClick={() => navigate("/")}>
                                    Home
                                </Nav.Link>

                                <Nav.Link onClick={() => navigate("/about")}>
                                    About Us
                                </Nav.Link>

                                {/* ✅ PRODUCT BUTTON OPENS MODAL */}
                                <Nav.Link onClick={() => setShowModal(true)}>
                                    Product
                                </Nav.Link>

                                <Nav.Link
                                    onClick={() => navigate("/cart")}
                                    className="position-relative"
                                >
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

                                <Nav.Link onClick={() => navigate("/contact")}>
                                    Contact
                                </Nav.Link>

                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </div>
            </header>

            {/* ✅ PRODUCT MODAL */}
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                size="xl"

            >
                <Modal.Body className="mega-modal">

                    {/* TOP CATEGORY MENU */}
                    <div className="mega-top-menu d-flex justify-content-center gap-5 mb-4">
                        {["MEN", "WOMEN", "TEENS", "KIDS", "SPORTS"].map((tab) => (
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

                        {/* LEFT SIDE CATEGORY LIST */}
                        <div className="col-md-6 d-flex gap-5">

                            <div>
                                <h6 className="mega-title">
                                    {categoryData[activeTab].left1Title}
                                </h6>
                                <ul className="mega-list">
                                    {categoryData[activeTab].left1.map(([name]) => (
                                        <li
                                            key={name}
                                            onClick={() => {
                                                navigate("/null"); // navigate to Nullpage
                                                setShowModal(false);
                                            }}
                                        >
                                            {name}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h6 className="mega-title text-success">
                                    {categoryData[activeTab].left2Title}
                                </h6>
                                <ul className="mega-list">
                                    {categoryData[activeTab].left2.map(([name]) => (
                                        <li
                                            key={name}
                                            onClick={() => {
                                                navigate("/null");
                                                setShowModal(false);
                                            }}
                                        >
                                            {name}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                        </div>

                        {/* RIGHT SIDE NEW ARRIVALS */}


                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Header;