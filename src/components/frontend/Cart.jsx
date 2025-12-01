import { useContext } from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { CartContext } from "./CartContext";

const Cart = () => {
    const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart } = useContext(CartContext);

    const totalPrice = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

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

                        <div className="mt-4 text-end">
                            <h4>Total Price: {totalPrice}৳</h4>
                            <button className="btn btn-primary mt-2">Checkout</button>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default Cart;
