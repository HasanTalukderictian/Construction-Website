import { useNavigate } from "react-router-dom";
import Footer from "../common/Footer";
import Header from "../common/Header";
import { useLocation } from "react-router-dom";

const Thankyou = () => {


    const navigate = useNavigate();
    const location = useLocation();
    const orderId = location.state?.orderId;



    return (
        <>
            <Header />

            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "70vh" }}>

                <div
                    className="container p-4 p-md-5 text-center shadow-lg"
                    style={{
                        maxWidth: "500px",
                        borderRadius: "20px",
                        background: "linear-gradient(135deg, #f3f5f7, #ffffff)"
                    }}
                >
                    {/* Icon */}
                    <div
                        className="mb-3 mx-auto d-flex align-items-center justify-content-center"
                        style={{
                            width: "70px",
                            height: "70px",
                            borderRadius: "50%",
                            background: "#28a745",
                            color: "#fff",
                            fontSize: "30px"
                        }}
                    >
                        ✓
                    </div>

                    {/* Title */}
                    <h3 className="mb-3">Thank You for Your Purchase 🎉</h3>

                    {/* Message */}
                    <p className="text-muted mb-3">
                        Your order has been successfully placed.
                    </p>

                    {/* Order Number */}
                    <div
                        className="p-3 mb-4"
                        style={{
                            background: "#f8f9fa",
                            borderRadius: "10px",
                            fontWeight: "500"
                        }}
                    >
                        Order Number: <span style={{ color: "#4287f5", fontWeight: "bold" }}>
                            #{orderId}
                        </span>
                    </div>

                    {/* Button */}
                    <button
                        className="btn btn-success w-100 mb-2"
                        onClick={() => navigate("/")}
                    >
                        Continue Shopping
                    </button>

                    <button className="btn btn-outline-primary w-100"
                     onClick={() => navigate("/profile")}>
                        View Order
                    </button>
                </div>

            </div>

            <Footer />
        </>
    );
};

export default Thankyou;