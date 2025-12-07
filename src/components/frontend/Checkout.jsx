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
    const [orderSubmitted, setOrderSubmitted] = useState(false); // ✅ New state

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
        if (orderSubmitted) return; // ✅ prevent duplicate submission

        // Validation
        if (!customerName.trim()) {
            alert("Customer name is required!");
            return;
        }

        if (!phone.trim()) {
            alert("Phone number is required!");
            return;
        }

        if (phone.length !== 11) {
            alert("Phone number must be exactly 11 digits!");
            return;
        }

        if (!address.trim()) {
            alert("Full address is required!");
            return;
        }

        if (!selectedDistrict) {
            alert("Please select a district!");
            return;
        }

        if (!selectedThana) {
            alert("Please select a thana!");
            return;
        }


        const mappedCartItems = cartItems.map(item => ({
            id: item.id,
            product_name: item.productName,
            image_url: item.imageUrl || "",
            price: item.price,
            quantity: item.quantity,
            description: item.description || "",
        }));

        const orderData = {
            customerName,
            phone,
            address,
            district: selectedDistrict,
            thana: selectedThana,
            totalPrice,
            deliveryCharge,
            finalTotal,
            cartItems: mappedCartItems,
        };

        try {
            const response = await fetch("http://127.0.0.1:8000/api/order/store", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData),
            });

            const data = await response.json();

            if (data.status) {
                const trackingNumber = data.tracking_number;
                localStorage.setItem("trackingNumber", trackingNumber);
                localStorage.removeItem("cart");
                setShowToast(true);
                setOrderSubmitted(true); // ✅ mark order as submitted

                // Reset form
                setCustomerName("");
                setPhone("");
                setAddress("");
                setSelectedDistrict("");
                setSelectedThana("");

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
                        {/* Customer Info Inputs */}
                        <input type="text" className="form-control mb-3" style={{ height: "55px" }} placeholder="Customer Name" value={customerName} onChange={e => setCustomerName(e.target.value)} />
                        <input
                            type="text"
                            className="form-control mb-3"
                            style={{ height: "55px" }}
                            placeholder="Phone Number"
                            value={phone}
                            onChange={e => {
                                const val = e.target.value;
                                if (/^\d*$/.test(val)) {   // only numbers
                                    setPhone(val);
                                }
                            }}
                        />

                        <textarea className="form-control mb-3" placeholder="Full Address" value={address} onChange={e => setAddress(e.target.value)}></textarea>
                        <select className="form-select mb-3" value={selectedDistrict} style={{ height: "55px" }} onChange={e => setSelectedDistrict(e.target.value)}>
                            <option value="">Select District</option>
                            {districts.map((d, index) => <option key={index} value={d.district}>{d.district}</option>)}
                        </select>
                        <select className="form-select mb-4" value={selectedThana} style={{ height: "55px" }} onChange={e => setSelectedThana(e.target.value)} disabled={!selectedDistrict}>
                            <option value="">Select Thana</option>
                            {thanas.map((t, index) => <option key={index} value={t}>{t}</option>)}
                        </select>

                        {/* Confirm Order Button */}
                        <button
                            className="btn btn-success w-100"
                            onClick={handleConfirmOrder}
                            disabled={orderSubmitted} // ✅ disable button after submit
                        >
                            {orderSubmitted ? "Order Submitted" : "Confirm Order"}
                        </button>
                    </div>
                </div>

                {/* Toast Notification */}
                <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999 }}>
                    <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide bg="success">
                        <Toast.Header>
                            <strong className="me-auto">Order Status</strong>
                        </Toast.Header>
                        <Toast.Body className="text-white">Your order has been completed!</Toast.Body>
                    </Toast>
                </div>
            </div>
            <Footer />
        </>
    );
};


export default Checkout;
