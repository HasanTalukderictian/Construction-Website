import { useContext, useState } from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { CartContext } from "./CartContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
    const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart } = useContext(CartContext);

    const [deliveryCharge, setDeliveryCharge] = useState(0);
    const [selectedDelivery, setSelectedDelivery] = useState(""); // track which option selected

    const navigate = useNavigate();

    const totalPrice = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const finalTotal = totalPrice + deliveryCharge;

    const handleCheckout = () => {
        if (!selectedDelivery) {
            alert("Please select a delivery option!");
            return;
        }

        navigate("/checkout", {
            state: {
                cartItems,
                deliveryCharge,
                totalPrice,
            },
        });
    };

    return (
        <>
            <Header />
            <div className="container mt-5">
                <h2>My Cart</h2>

                {cartItems.length === 0 ? (
                    <p>Your cart is empty</p>
                ) : (
                    <div className="cart-items">
                        {cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="d-flex align-items-center justify-content-between mb-3 p-3 border rounded"
                            >
                                <div className="d-flex align-items-center">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.productName}
                                        style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px", marginRight: "15px" }}
                                    />
                                    <div>
                                        <h5>{item.productName}</h5>
                                        <p>Price: {item.price}৳</p>
                                    </div>
                                </div>

                                <div className="d-flex align-items-center">
                                    <button
                                        className="btn btn-sm btn-danger me-2"
                                        onClick={() => decreaseQuantity(item.id)}
                                    >
                                        -
                                    </button>
                                    <span style={{ margin: "0 10px" }}>{item.quantity}</span>
                                    <button
                                        className="btn btn-sm btn-success ms-2"
                                        onClick={() => increaseQuantity(item.id)}
                                    >
                                        +
                                    </button>
                                </div>

                                <div>
                                    <p>Total: {item.price * item.quantity}৳</p>
                                    <button
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={() => removeFromCart(item.id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Delivery Charge Section */}
                        <div className="mt-4 p-3 border rounded">
                            <h5>Delivery Charge</h5>

                            <div className="form-check mt-2">
                                <input
                                    type="radio"
                                    className="form-check-input"
                                    name="delivery"
                                    checked={selectedDelivery === "inside"}
                                    onChange={() => {
                                        setDeliveryCharge(80);
                                        setSelectedDelivery("inside");
                                    }}
                                />
                                <label className="form-check-label">
                                    Inside Dhaka (80৳)
                                </label>
                            </div>

                            <div className="form-check mt-2">
                                <input
                                    type="radio"
                                    className="form-check-input"
                                    name="delivery"
                                    checked={selectedDelivery === "outside"}
                                    onChange={() => {
                                        setDeliveryCharge(150);
                                        setSelectedDelivery("outside");
                                    }}
                                />
                                <label className="form-check-label">
                                    Outside Dhaka (150৳)
                                </label>
                            </div>
                        </div>

                        {/* Total Section */}
                        <div className="mt-4 text-end mb-4">
                            <h5>Products Total: {totalPrice}৳</h5>
                            <h5>Delivery Charge: {deliveryCharge}৳</h5>
                            <h4 className="mt-2">Final Total: {finalTotal}৳</h4>

                            <button
                                className="btn btn-primary mt-3"
                                onClick={handleCheckout}
                                disabled={!selectedDelivery} // disable until delivery selected
                            >
                                Checkout
                            </button>
                        </div>

                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default Cart;
