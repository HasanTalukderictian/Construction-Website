import { useContext, useState } from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { CartContext } from "./CartContext";
import { useNavigate } from "react-router-dom";

import '../../assets/css/cart.scss';
import emptyCartImage from '../../assets/images/empry-cart.png';

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

        const user = localStorage.getItem("user");

        if (!user) {
            navigate("/userlogin", {
                state: {
                    redirectTo: "/checkout",
                    cartItems,
                    deliveryCharge,
                    totalPrice,
                    selectedDelivery
                }
            });
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
            state: {
                cartItems: mappedCartItems,
                deliveryCharge,
                totalPrice,
                selectedDelivery
            },
        });
    };

    return (
        <>
            <Header />
            <div className="container mt-5 mb-5 p-0">
                <h2 className="mb-4 fw-bold text-dark"><i className="bi bi-cart3 me-2 text-success"></i>My Shopping Cart</h2>

                {cartItems.length === 0 ? (
                    <div className="text-center py-5 rounded shadow-sm bg-white border">
                        <img
                            src={emptyCartImage}
                            alt="Empty Cart"
                            className="img-fluid mb-3"
                            style={{ maxWidth: "300px", opacity: "0.8" }}
                        />
                        <h4 className="text-muted">Your cart feels a bit light!</h4>
                        <button className="btn btn-success rounded-pill mt-3 px-4" onClick={() => navigate("/")}>Go Shopping</button>
                    </div>
                ) : (
                    <div className="row g-4">
                        {/* Cart Items List */}
                        <div className="col-lg-8">
                            {cartItems.map(item => (
                                <div
                                    key={item.id}
                                    className="d-flex align-items-center mb-3 p-3 rounded-4 shadow-sm bg-white border cart-item-card"
                                >
                                    <div className="flex-shrink-0">
                                        <img
                                            src={item.image_url}
                                            alt={item.product_name}
                                            className="rounded-3 border cart-item-img"
                                        />
                                    </div>
                                    
                                    <div className="flex-grow-1 ms-3">
                                        <h6 className="mb-1 fw-bold text-dark">{item.product_name}</h6>
                                        <p className="mb-0 text-muted small">Price: {item.price}৳</p>
                                        
                                        {/* Mobile Quantity Control */}
                                        <div className="d-flex d-md-none align-items-center mt-2">
                                            <button className="btn btn-sm btn-outline-secondary rounded-circle" style={{width: '28px', height: '28px', padding: 0}} onClick={() => decreaseQuantity(item.id)}>-</button>
                                            <span className="mx-2 fw-bold">{item.quantity}</span>
                                            <button className="btn btn-sm btn-outline-success rounded-circle" style={{width: '28px', height: '28px', padding: 0}} onClick={() => increaseQuantity(item.id)}>+</button>
                                        </div>
                                    </div>

                                    {/* Desktop Controls */}
                                    <div className="d-none d-md-flex align-items-center px-4">
                                        <button className="btn btn-sm btn-light border-secondary-subtle px-2" onClick={() => decreaseQuantity(item.id)}>-</button>
                                        <span className="mx-3 fw-bold">{item.quantity}</span>
                                        <button className="btn btn-sm btn-light border-secondary-subtle px-2" onClick={() => increaseQuantity(item.id)}>+</button>
                                    </div>

                                    <div className="text-end ms-2">
                                        <p className="mb-1 fw-bold text-success">{item.price * item.quantity}৳</p>
                                        <button className="btn text-danger p-0 small border-0 bg-transparent" onClick={() => removeFromCart(item.id)}>
                                            <i className="bi bi-trash3 me-1"></i>Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary Panel */}
                        <div className="col-lg-4">
                            <div className="p-4 rounded-4 shadow-lg sticky-top border-0 summary-panel" 
                                style={{ 
                                    top: "100px", 
                                    background: "#ffffff",
                                    border: "1px solid #eee"
                                }}>
                                <h5 className="fw-bold mb-4 border-bottom pb-2">Order Summary</h5>
                                
                                <div className="mb-4">
                                    <p className="small fw-bold text-muted mb-2 text-uppercase">Select Delivery Area</p>
                                    <div className={`delivery-box p-2 mb-2 rounded-3 border ${selectedDelivery === 'inside' ? 'selected' : ''}`} 
                                         onClick={() => { setDeliveryCharge(80); setSelectedDelivery("inside"); }}>
                                        <div className="form-check m-0">
                                            <input type="radio" className="form-check-input" name="delivery" checked={selectedDelivery === "inside"} readOnly />
                                            <label className="form-check-label d-flex justify-content-between w-100">
                                                <span>Inside Dhaka</span> <strong>80৳</strong>
                                            </label>
                                        </div>
                                    </div>
                                    <div className={`delivery-box p-2 rounded-3 border ${selectedDelivery === 'outside' ? 'selected' : ''}`}
                                         onClick={() => { setDeliveryCharge(150); setSelectedDelivery("outside"); }}>
                                        <div className="form-check m-0">
                                            <input type="radio" className="form-check-input" name="delivery" checked={selectedDelivery === "outside"} readOnly />
                                            <label className="form-check-label d-flex justify-content-between w-100">
                                                <span>Outside Dhaka</span> <strong>150৳</strong>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Subtotal</span>
                                    <span>{totalPrice}৳</span>
                                </div>
                                <div className="d-flex justify-content-between mb-3 pb-3 border-bottom">
                                    <span className="text-muted">Delivery</span>
                                    <span>{deliveryCharge}৳</span>
                                </div>
                                <div className="d-flex justify-content-between mb-4">
                                    <h5 className="fw-bold">Total</h5>
                                    <h5 className="fw-bold text-success">{finalTotal}৳</h5>
                                </div>

                                <button
                                    className="btn btn-success w-100 rounded-pill py-3 fw-bold shadow-sm checkout-btn"
                                    onClick={handleCheckout}
                                    disabled={!selectedDelivery}
                                >
                                    Proceed to Checkout
                                </button>
                                <p className="text-center small text-muted mt-3 mb-0">Secure SSL Encrypted Payment</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />

            <style>{`
                body { background-color: #f8f9fa; }
                
                .cart-item-card {
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                .cart-item-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.05) !important;
                }

                .cart-item-img {
                    width: 80px;
                    height: 80px;
                    object-fit: contain;
                    padding: 5px;
                    background: #fff;
                }

                .delivery-box {
                    cursor: pointer;
                    transition: all 0.3s ease;
                    background: #fdfdfd;
                }
                .delivery-box:hover { background: #f1f3f5; }
                .delivery-box.selected {
                    border-color: #198754 !important;
                    background: #f0fdf4;
                }

                .checkout-btn {
                    background: linear-gradient(135deg, #198754, #2bb16c);
                    border: none;
                    transition: transform 0.2s ease;
                }
                .checkout-btn:hover:not(:disabled) {
                    transform: scale(1.02);
                    box-shadow: 0 5px 15px rgba(25, 135, 84, 0.3) !important;
                }
                .checkout-btn:disabled { opacity: 0.7; cursor: not-allowed; }

                @media (max-width: 768px) {
                    .cart-item-img { width: 60px; height: 60px; }
                    h2 { font-size: 20px; }
                }
            `}</style>
        </>
    );
};

export default Cart;