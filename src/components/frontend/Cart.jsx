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

        // map cart items to match backend structure
        const mappedCartItems = cartItems.map(item => ({
            id: item.id,
            productName: item.productName,
            imageUrl: item.imageUrl,
            price: item.price,
            quantity: item.quantity,
        }));

        navigate("/checkout", {
            state: {
                cartItems: mappedCartItems,
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
                                        src={item.image_urls?.length > 0 ? item.image_urls[0] : '/placeholder.png'}
                                        alt={item.name}
                                        style={{
                                            width: "100px",
                                            height: "100px",
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                            marginRight: "15px",
                                        }}
                                    />
                                    <div>
                                        <h5>{item.name}</h5>
                                        <p>Price: {item.price}৳</p>
                                    </div>

                                
                                </div>

                                {/* <div className="d-flex align-items-center">
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
                                </div> */}

                                <div
                                    className="d-flex align-items-center justify-content-center"
                                    style={{ width: "200px" }}
                                >
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

                        {/* Combined Box for Delivery + Price Calculation */}
                        <div className="mt-4 p-4 border rounded " style={{ backgroundColor: "#84e1e3", marginBottom: "5px" }}>
                            <div className="row">

                                {/* LEFT: Delivery Charge */}
                                <div className="col-md-6 border-end">
                                    <h2>Delivery Charge</h2>

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
                                            <h4> Inside Dhaka (80৳)</h4>
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
                                            <h4> Outside Dhaka (150৳)</h4>
                                        </label>
                                    </div>
                                </div>

                                {/* RIGHT: Totals */}
                                <div className="col-md-6">
                                    <h5 className="text-end">Products Total: {totalPrice}৳</h5>
                                    <h5 className="text-end mt-2">Delivery Charge: {deliveryCharge}৳</h5>
                                    <h4 className="text-end mt-3 fw-bold">Final Total: {finalTotal}৳</h4>

                                    <div className="text-end mt-3">
                                        <button
                                            className="btn btn-primary"
                                            onClick={handleCheckout}
                                            disabled={!selectedDelivery}
                                        >
                                            Checkout
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>


                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default Cart;
