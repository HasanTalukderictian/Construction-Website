import { useContext, useState } from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { CartContext } from "./CartContext";
import { useNavigate } from "react-router-dom";

import '../../assets/css/cart.scss';

const Cart = () => {
    const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart } = useContext(CartContext);
    const [deliveryCharge, setDeliveryCharge] = useState(0);
    const [selectedDelivery, setSelectedDelivery] = useState("");
    const navigate = useNavigate();

    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const finalTotal = totalPrice + deliveryCharge;

    const handleCheckout = () => {
        if (!selectedDelivery) {
            alert("Please select a delivery option!");
            return;
        }

        const mappedCartItems = cartItems.map(item => ({
            id: item.id,
            product_name: item.product_name,
            image_url: item.image_url,
            price: item.price,
            quantity: item.quantity,
        }));

        navigate("/checkout", {
            state: { cartItems: mappedCartItems, deliveryCharge, totalPrice },
        });
    };

    return (
        <>
            <Header />
            <div 
                className="container mt-4 p-3 p-md-4 rounded shadow-lg mb-5"
                style={{ 
                    background: "linear-gradient(135deg, #f3f5f7, #fcfcfc)", 
                    borderRadius: "20px"
                }}
            >
                <h2 className="mb-4 text-center" style={{ color: "#1e3c72" }}>Your Cart</h2>

                {cartItems.length === 0 ? (
                    <p className="text-center" style={{ fontSize: "18px" }}>Your cart is empty</p>
                ) : (
                    <>
                        {cartItems.map(item => (
                            <div 
                                key={item.id} 
                                className="d-flex flex-column flex-md-row align-items-center justify-content-between mb-3 p-3 rounded shadow-sm cart-item"
                                style={{ 
                                    backgroundColor: "#ffffffcc",
                                    transition: "transform 0.2s, box-shadow 0.2s",
                                    cursor: "pointer"
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = "scale(1.03)";
                                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.25)";
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = "scale(1)";
                                    e.currentTarget.style.boxShadow = "0 3px 10px rgba(0,0,0,0.1)";
                                }}
                            >
                                <div className="d-flex align-items-center mb-2 mb-md-0 w-100">
                                    <img 
                                        src={item.image_url} 
                                        alt={item.product_name} 
                                        className="cart-item-img"
                                    />
                                    <div className="ms-2">
                                        <h5 className="mb-1">{item.product_name}</h5>
                                        <p className="mb-0">Price: {item.price}৳</p>
                                    </div>
                                </div>

                                <div className="d-flex align-items-center justify-content-start justify-content-md-center my-2 my-md-0 w-100 quantity-control">
                                    <button className="btn btn-sm btn-danger me-2" onClick={() => decreaseQuantity(item.id)}>-</button>
                                    <span className="mx-2">{item.quantity}</span>
                                    <button className="btn btn-sm btn-success ms-2" onClick={() => increaseQuantity(item.id)}>+</button>
                                </div>

                                <div className="text-end w-100 mt-2 mt-md-0">
                                    <p className="mb-1 fw-bold">Total: {item.price * item.quantity}৳</p>
                                    <button className="btn btn-outline-danger btn-sm" onClick={() => removeFromCart(item.id)}>Remove</button>
                                </div>
                            </div>
                        ))}

                        {/* Summary Panel */}
                        <div 
                            className="mt-4 p-3 p-md-4 rounded shadow-lg summary-panel"
                            style={{ 
                                background: "linear-gradient(135deg, #ffecd2, #fcb69f)",
                                borderRadius: "20px"
                            }}
                        >
                            <div className="row g-3">
                                {/* Delivery Options */}
                                <div className="col-12 col-md-6 border-md-end">
                                    <h4 style={{ color: "#8b4513" }}>Delivery Charge</h4>
                                    <div className="form-check mt-2">
                                        <input 
                                            type="radio" 
                                            className="form-check-input" 
                                            name="delivery" 
                                            checked={selectedDelivery === "inside"} 
                                            onChange={() => { setDeliveryCharge(80); setSelectedDelivery("inside"); }} 
                                        />
                                        <label className="form-check-label"><h6 className="mb-0">Inside Dhaka (80৳)</h6></label>
                                    </div>
                                    <div className="form-check mt-2">
                                        <input 
                                            type="radio" 
                                            className="form-check-input" 
                                            name="delivery" 
                                            checked={selectedDelivery === "outside"} 
                                            onChange={() => { setDeliveryCharge(150); setSelectedDelivery("outside"); }} 
                                        />
                                        <label className="form-check-label"><h6 className="mb-0">Outside Dhaka (150৳)</h6></label>
                                    </div>
                                </div>

                                {/* Totals */}
                                <div className="col-12 col-md-6 text-md-end">
                                    <h6 className="mb-1">Products Total: {totalPrice}৳</h6>
                                    <h6 className="mb-1 mt-2">Delivery Charge: {deliveryCharge}৳</h6>
                                    <h5 className="fw-bold mt-3">Final Total: {finalTotal}৳</h5>
                                    <div className="mt-3">
                                        <button 
                                            className="btn btn-primary btn-sm  w-md-auto"
                                            onClick={handleCheckout} 
                                            disabled={!selectedDelivery}
                                            style={{ 
                                                padding: "10px 25px", 
                                                fontSize: "16px",
                                                background: "linear-gradient(135deg, #667eea, #764ba2)",
                                                border: "none",
                                                boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
                                            }}
                                        >
                                            Checkout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
            <Footer />

            {/* Custom CSS */}
            <style jsx>{`
                .cart-item-img {
                    width: 80px;
                    height: 80px;
                    object-fit: cover;
                    border-radius: 12px;
                    border: 1px solid #ccc;
                }

                @media (max-width: 767px) {
                    .cart-item {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .quantity-control {
                        justify-content: flex-start !important;
                    }

                    .summary-panel {
                        padding: 15px !important;
                    }

                    .cart-item-img {
                        width: 70px;
                        height: 70px;
                    }

                    h2 {
                        font-size: 24px;
                    }

                    h5, h6 {
                        font-size: 14px;
                    }

                    .btn-lg {
                        font-size: 14px;
                        padding: 8px 20px;
                    }
                }
            `}</style>
        </>
    );
};

export default Cart;
