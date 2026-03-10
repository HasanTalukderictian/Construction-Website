

import { useContext, useEffect, useState } from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import Toast from "react-bootstrap/Toast";
import { useLocation } from "react-router-dom";
import { CartContext } from "./CartContext";

export const API_BASE = import.meta.env.VITE_API_BASE_URL;

const Checkout = () => {

  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [thanas, setThanas] = useState([]);
  const [selectedThana, setSelectedThana] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(""); // optional
  const [showToast, setShowToast] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const { clearCart } = useContext(CartContext);
  const [showPaymentToast, setShowPaymentToast] = useState(false);

  const location = useLocation();
  const { cartItems, deliveryCharge, totalPrice, selectedDelivery } = location.state || {};

  const finalTotal = totalPrice + deliveryCharge;

  // Load districts
  useEffect(() => {
    fetch("/mapping.json")
      .then(res => res.json())
      .then(data => {

        if (selectedDelivery === "inside") {

          // include all Dhaka related districts
          const filtered = data.filter(d =>
            d.district.toLowerCase().includes("dhaka") ||
            d.district.toLowerCase().includes("savar") ||
            d.district.toLowerCase().includes("keraniganj") ||
            d.district.toLowerCase().includes("dhamrai")
          );

          setDistricts(filtered);

        } else if (selectedDelivery === "outside") {

          // exclude Dhaka related districts
          const filtered = data.filter(d =>
            !d.district.toLowerCase().includes("dhaka") &&
            !d.district.toLowerCase().includes("savar") &&
            !d.district.toLowerCase().includes("keraniganj") &&
            !d.district.toLowerCase().includes("dhamrai")
          );

          setDistricts(filtered);

        } else {
          setDistricts(data);
        }

      })
      .catch(err => console.log("District Load Error", err));
  }, [selectedDelivery]);

  useEffect(() => {
    if (selectedDistrict) {
      const districtObj = districts.find(d => d.district === selectedDistrict);
      setThanas(districtObj ? districtObj.thana : []);
      setSelectedThana("");
    }
  }, [selectedDistrict, districts]);

  // Submit Order
  const handleConfirmOrder = async () => {
    if (orderSubmitted) return;

    if (!customerName.trim()) { alert("Customer name is required!"); return; }
    if (!phone.trim() || phone.length !== 11) { alert("Valid phone number is required!"); return; }
    if (!address.trim()) { alert("Full address is required!"); return; }
    if (!selectedDistrict) { alert("Please select a district!"); return; }
    if (!selectedThana) { alert("Please select a thana!"); return; }

    const mappedCartItems = cartItems.map(item => ({
      id: item.id,
      product_name: item.product_name,
      image_url: item.image_url,
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
      paymentMethod,
    };

    // try {
    //   // Online Payment Flow
    //   if (paymentMethod === "bkash" || paymentMethod === "rocket") {

    //     const response = await fetch(`${API_BASE}/api/payment/initiate`, {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify(orderData),
    //     });

    //     const data = await response.json();

    //     if (data.status && data.payment_url) {
    //       // Redirect user to payment gateway
    //       window.location.href = data.payment_url;
    //     } else {
    //       alert("Payment initialization failed!");
    //     }
    //     return;
    //   }

    try {
      // Online Payment Flow (Temporarily Disabled)
      if (paymentMethod === "bkash" || paymentMethod === "rocket") {
        setShowPaymentToast(true);
        setTimeout(() => setShowPaymentToast(false), 4000);
        return;
      }



      // COD or no payment selected
      const response = await fetch(`${API_BASE}/order/store`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (data.status) {
        const trackingNumber = data.tracking_number;
        localStorage.setItem("trackingNumber", trackingNumber);
        clearCart();
        setShowToast(true);
        setOrderSubmitted(true);

        setCustomerName(""); setPhone(""); setAddress(""); setSelectedDistrict(""); setSelectedThana("");
        setPaymentMethod("");
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
        <h2 className="text-center mb-4" style={{ color: "#2D5B78", fontWeight: "700" }}>Checkout</h2>

        <div className="row justify-content-center gap-4">
          {/* Customer Form */}
          <div className="col-md-6">
            <div className="p-4 shadow-lg rounded-4" style={{ background: "#f9f9f9" }}>
              <h5 className="mb-4 text-primary fw-bold">Your Information</h5>

              <input type="text" className="form-control mb-3 rounded-3" placeholder="Customer Name" value={customerName} onChange={e => setCustomerName(e.target.value)} />
              <input type="text" className="form-control mb-3 rounded-3" placeholder="Phone Number" value={phone} onChange={e => { const val = e.target.value; if (/^\d*$/.test(val)) setPhone(val); }} />
              <textarea className="form-control mb-3 rounded-3" placeholder="Full Address" value={address} onChange={e => setAddress(e.target.value)}></textarea>

              <select className="form-select mb-3 rounded-3" value={selectedDistrict} onChange={e => setSelectedDistrict(e.target.value)}>
                <option value="">Select District</option>
                {districts.map((d, i) => <option key={i} value={d.district}>{d.district}</option>)}
              </select>

              <select className="form-select mb-3 rounded-3" value={selectedThana} onChange={e => setSelectedThana(e.target.value)} disabled={!selectedDistrict}>
                <option value="">Select Thana</option>
                {thanas.map((t, i) => <option key={i} value={t}>{t}</option>)}
              </select>

              {/* Payment Option */}
              <h6 className="mb-2 fw-bold">Payment Method (optional)</h6>
              <select className="form-select mb-4 rounded-3" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                <option value="">Select Payment Method</option>
                <option value="cod">Cash on Delivery</option>
                <option value="bkash">bKash</option>
                <option value="rocket">Rocket</option>
              </select>

              <button className={`btn w-100 text-white fw-bold ${orderSubmitted ? "btn-secondary" : "btn-success"}`} onClick={handleConfirmOrder} disabled={orderSubmitted}>
                {orderSubmitted ? "Order Submitted" : "Confirm Order"}
              </button>
            </div>
          </div>

          {/* Order Summary */}
          {!orderSubmitted && (
            <div className="col-md-5">
              <div className="p-4 shadow-lg rounded-4" style={{ background: "#fff7e6" }}>
                <h5 className="mb-4 text-warning fw-bold">Order Summary</h5>
                {cartItems?.map((item, idx) => (
                  <div key={idx} className="d-flex align-items-center mb-3 p-2 rounded-3" style={{ background: "#ffffff", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                    <img src={item.image_url} alt={item.product_name} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px" }} />
                    <div className="ms-3 flex-grow-1">
                      <p className="mb-1 fw-bold" style={{ fontSize: "14px" }}>{item.product_name}</p>
                      <p className="mb-0 text-muted" style={{ fontSize: "13px" }}>Qty: {item.quantity}</p>
                    </div>
                    <p className="fw-bold mb-0">{item.price * item.quantity} ৳</p>
                  </div>
                ))}

                <hr />
                <div className="d-flex justify-content-between fw-bold mb-2"><span>Subtotal</span><span>{totalPrice} ৳</span></div>
                <div className="d-flex justify-content-between fw-bold mb-2"><span>Delivery Charge</span><span>{deliveryCharge} ৳</span></div>
                <div className="d-flex justify-content-between fw-bold fs-5 text-success"><span>Total</span><span>{finalTotal} ৳</span></div>
              </div>
            </div>
          )}
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

          <Toast
            show={showPaymentToast}
            onClose={() => setShowPaymentToast(false)}
            delay={4000}
            autohide
            bg="warning"
          >
            <Toast.Header>
              <strong className="me-auto">Payment Notice</strong>
            </Toast.Header>
            <Toast.Body className="text-dark">
              bKash / Rocket payment is under development. Please select Cash on Delivery.
            </Toast.Body>
          </Toast>

        </div>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;