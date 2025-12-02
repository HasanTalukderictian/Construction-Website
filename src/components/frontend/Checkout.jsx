import { useEffect, useState } from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import Toast from "react-bootstrap/Toast";
import { useLocation } from "react-router-dom";

const Checkout = () => {
    const location = useLocation();
    const { cartItems, deliveryCharge, totalPrice } = location.state || {};

    const [districts, setDistricts] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [thanas, setThanas] = useState([]);
    const [selectedThana, setSelectedThana] = useState("");

    const [customerName, setCustomerName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [showToast, setShowToast] = useState(false);

    const finalTotal = totalPrice + deliveryCharge;

    useEffect(() => {
        fetch("../../../public/mapping.json")
            .then(res => res.json())
            .then(data => setDistricts(data))
            .catch(err => console.log("District Load Error", err));
    }, []);

    useEffect(() => {
        if (selectedDistrict) {
            const districtObj = districts.find(d => d.district === selectedDistrict);
            setThanas(districtObj ? districtObj.thana : []);
            setSelectedThana("");
        }
    }, [selectedDistrict, districts]);

   const handleConfirmOrder = async () => {
    if (!customerName || !phone || !address || !selectedDistrict || !selectedThana) {
        alert("Please fill all the fields!");
        return;
    }

    const orderData = {
        customerName,
        phone,
        address,
        district: selectedDistrict,
        thana: selectedThana,
        cartItems,
        deliveryCharge,
        totalPrice,
        finalTotal
    };

    try {
        const response = await fetch("http://127.0.0.1:8000/api/order/store", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(orderData),
        });

        const data = await response.json();
        console.log("API Response:", data);

        if (data.status) {

            // 🔥 SUCCESS — CLEAR CART FROM LOCAL STORAGE
            localStorage.removeItem("cart");

            setShowToast(true);

            // Reset all form fields
            setCustomerName("");
            setPhone("");
            setAddress("");
            setSelectedDistrict("");
            setSelectedThana("");

            // Hide Toast
            setTimeout(() => setShowToast(false), 5000);

        } else {
            alert(data.message);
        }

    } catch (error) {
        console.error("Order Submit Error:", error);
        alert("Something went wrong. Try again!");
    }
};



    return (
        <>
            <Header />
            <div className="container my-5">
                <h2>Checkout</h2>

                <div className="row mt-4">
                    <div className="col-md-6 mx-auto">

                        <label className="form-label">Customer Name</label>
                        <input
                            type="text"
                            className="form-control mb-3"
                            value={customerName}
                            onChange={e => setCustomerName(e.target.value)}
                        />

                        <label className="form-label">Phone Number</label>
                        <input
                            type="text"
                            className="form-control mb-3"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                        />

                        <label className="form-label">Full Address</label>
                        <textarea
                            className="form-control mb-3"
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                        ></textarea>

                        {/* District Dropdown */}
                        <label className="form-label">District</label>
                        <select
                            className="form-select mb-3"
                            value={selectedDistrict}
                            onChange={(e) => setSelectedDistrict(e.target.value)}
                        >
                            <option value="">Select District</option>
                            {districts.map((d, index) => (
                                <option key={index} value={d.district}>
                                    {d.district}
                                </option>
                            ))}
                        </select>

                        {/* Thana Dropdown */}
                        <label className="form-label">Thana</label>
                        <select
                            className="form-select mb-4"
                            value={selectedThana}
                            onChange={(e) => setSelectedThana(e.target.value)}
                            disabled={!selectedDistrict}
                        >
                            <option value="">Select Thana</option>
                            {thanas.map((t, index) => (
                                <option key={index} value={t}>
                                    {t}
                                </option>
                            ))}
                        </select>

                        <button
                            className="btn btn-success w-100"
                            onClick={handleConfirmOrder}
                        >
                            Confirm Order
                        </button>
                    </div>
                </div>

                {/* Toast */}
                <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999 }}>
                    <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide bg="success">
                        <Toast.Header>
                            <strong className="me-auto">Order Status</strong>
                        </Toast.Header>
                        <Toast.Body className="text-white">
                            Your order has been completed!
                        </Toast.Body>
                    </Toast>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Checkout;
