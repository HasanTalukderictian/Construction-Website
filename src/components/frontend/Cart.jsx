import { useContext, useState } from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { CartContext } from "./CartContext";
import { useNavigate } from "react-router-dom";

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
            <div className="container mt-5">
                <h2>Your Cart</h2>

                {cartItems.length === 0 ? (
                    <p>Your cart is empty</p>
                ) : (
                    <>
                        {cartItems.map(item => (
                            <div key={item.id} className="d-flex align-items-center justify-content-between mb-3 p-3 border rounded">
                                <div className="d-flex align-items-center">
                                    <img src={item.image_url} alt={item.product_name} style={{ width: "100px", height: "100px", objectFit: "cover", marginRight: "15px", borderRadius: "8px" }} />
                                    <div>
                                        <h5>{item.product_name}</h5>
                                        <p>Price: {item.price}৳</p>
                                    </div>
                                </div>

                                <div className="d-flex align-items-center justify-content-center" style={{ width: "200px" }}>
                                    <button className="btn btn-sm btn-danger me-2" onClick={() => decreaseQuantity(item.id)}>-</button>
                                    <span style={{ margin: "0 10px" }}>{item.quantity}</span>
                                    <button className="btn btn-sm btn-success ms-2" onClick={() => increaseQuantity(item.id)}>+</button>
                                </div>

                                <div>
                                    <p>Total: {item.price * item.quantity}৳</p>
                                    <button className="btn btn-outline-danger btn-sm" onClick={() => removeFromCart(item.id)}>Remove</button>
                                </div>
                            </div>
                        ))}

                        <div className="mt-4 p-4 border rounded" style={{ backgroundColor: "#84e1e3" }}>
                            <div className="row">
                                <div className="col-md-6 border-end">
                                    <h2>Delivery Charge</h2>
                                    <div className="form-check mt-2">
                                        <input type="radio" className="form-check-input" name="delivery" checked={selectedDelivery === "inside"} onChange={() => { setDeliveryCharge(80); setSelectedDelivery("inside"); }} />
                                        <label className="form-check-label"><h4>Inside Dhaka (80৳)</h4></label>
                                    </div>
                                    <div className="form-check mt-2">
                                        <input type="radio" className="form-check-input" name="delivery" checked={selectedDelivery === "outside"} onChange={() => { setDeliveryCharge(150); setSelectedDelivery("outside"); }} />
                                        <label className="form-check-label"><h4>Outside Dhaka (150৳)</h4></label>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <h5 className="text-end">Products Total: {totalPrice}৳</h5>
                                    <h5 className="text-end mt-2">Delivery Charge: {deliveryCharge}৳</h5>
                                    <h4 className="text-end mt-3 fw-bold">Final Total: {finalTotal}৳</h4>
                                    <div className="text-end mt-3">
                                        <button className="btn btn-primary" onClick={handleCheckout} disabled={!selectedDelivery}>Checkout</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
            <Footer />
        </>
    );
};

export default Cart;
