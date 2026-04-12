import { useState, useEffect } from 'react';
import axios from 'axios'; // Ensure axios is installed: npm install axios
import Header from '../../common/Header';
import Footer from '../../common/Footer';
import { useNavigate } from "react-router-dom";
import '../../../assets/css/customerprofile.scss';

const CustomerProfile = () => {

    const [customer, setCustomer] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("Account Information");

    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCustomerData = async () => {
            try {
                const token = localStorage.getItem("token"); // ✅ correct way

                if (!token) {
                    console.log("No token found");
                    window.location.href = "/userlogin"; // ✅ redirect if not login
                    return;
                }

                const response = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/profile`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                // ✅ backend returns { status, data }
                setCustomer(response.data.data);
                setLoading(false);

            } catch (error) {
                console.error("Error fetching customer data", error);

                // ❗ token invalid হলে logout
                localStorage.removeItem("token");
                localStorage.removeItem("user");

                window.location.href = "/userlogin";

                setLoading(false);
            }
        };

        fetchCustomerData();
    }, []);



    // ২. অর্ডার ডেটা ফেচ করা (যখন My Orders ট্যাবে ক্লিক করা হবে)
    useEffect(() => {
        if (activeTab === "My Orders") {
            const fetchOrders = async () => {
                try {
                    const token = localStorage.getItem("token"); // ✅ ADD THIS

                    const response = await axios.get(
                        `${import.meta.env.VITE_API_BASE_URL}/customer-orders/${customer?.id}`,
                        {
                            headers: { Authorization: `Bearer ${token}` }
                        }
                    );

                    setOrders(response.data.data);

                } catch (error) {
                    console.error("Orders fetch failed", error);
                }
            };

            if (customer?.id) fetchOrders();
        }
    }, [activeTab, customer?.id]);

    const handleLogout = () => {
        localStorage.removeItem("token");   // ✅ token remove
        localStorage.removeItem("user");    // ✅ user remove
        setUser(null);

        navigate("/userlogin");             // ✅ redirect
    };


    const sidebarItems = [
        { icon: "bi-person", label: "Account Information", active: true },
        { icon: "bi-box-seam", label: "My Orders" },
        { icon: "bi-star", label: "My Product Reviews" },
        { icon: "bi-chat-left-dots", label: "Support Tickets" },
        { icon: "bi-gem", label: "Ecommerce Club" },
        { icon: "bi-share", label: "Share & Earn" },
        { icon: "bi-geo-alt", label: "Manage Addresses" },
        { icon: "bi-credit-card", label: "Saved Payment Methods" },
        { icon: "bi-question-circle", label: "Logout" },
    ];

    if (loading) return <div className="text-center py-5">Loading...</div>;

    return (
        <>
            <Header />
            <div className="container-fluid bg-light py-4 min-vh-100">
                <div className="container">
                    <div className="row g-4">
                        {/* LEFT SIDEBAR */}
                        <div className="col-lg-4 col-xl-3">
                            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                                <div className="p-3 border-bottom">
                                    <h5 className="mb-0 fw-bold">My Account</h5>
                                </div>
                                <div className="list-group list-group-flush sidebar-menu">
                                    {sidebarItems.map((item, index) => (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                if (item.label === "Logout") {
                                                    handleLogout();   // ✅ logout call
                                                } else {
                                                    setActiveTab(item.label);
                                                }
                                            }}
                                            className={`list-group-item list-group-item-action border-0 d-flex align-items-center py-3 
        ${activeTab === item.label ? 'active-menu' : ''}`}
                                        >
                                            <i className={`bi ${item.icon} me-3 fs-5`}></i>
                                            <span className="small fw-medium">{item.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT CONTENT AREA */}
                        <div className="col-lg-8 col-xl-9">


                            {!["Account Information", "My Orders"].includes(activeTab) && (
                                <div className="card border-0 shadow-sm rounded-4 p-4 text-center">
                                    <h5 className="fw-bold mb-3">{activeTab}</h5>
                                    <p className="text-muted">🚧 Under Development</p>
                                </div>
                            )}

                            {activeTab === "Account Information" && (
                                <>
                                    {/* Account Information Card */}
                                    <div className="card border-0 shadow-sm rounded-4 mb-4">
                                        <div className="card-body p-4">
                                            <div className="d-flex justify-content-between align-items-center mb-4">
                                                <h5 className="mb-0 fw-bold">Account Information</h5>
                                                <button className="btn btn-outline-primary btn-sm px-4 rounded-pill">Edit</button>
                                            </div>

                                            <div className="row g-4">
                                                <div className="col-md-6">
                                                    <label className="text-muted small d-block mb-1">First Name</label>
                                                    <p className="fw-semibold mb-0">{customer?.first_name || 'N/A'}</p>
                                                </div>

                                                <div className="col-md-6">
                                                    <label className="text-muted small d-block mb-1">Last Name</label>
                                                    <p className="fw-semibold mb-0">{customer?.last_name || 'N/A'}</p>
                                                </div>

                                                <div className="col-md-6 border-top pt-3">
                                                    <label className="text-muted small d-block mb-1">Contact Number</label>
                                                    <p className="fw-semibold mb-0">{customer?.phone || 'N/A'}</p>
                                                </div>

                                                <div className="col-md-6 border-top pt-3">
                                                    <label className="text-muted small d-block mb-1">Email</label>
                                                    <p className="text-muted small mb-0">{customer?.email || 'N/A'}</p>
                                                </div>

                                                <div className="col-md-6 border-top pt-3">
                                                    <label className="text-muted small d-block mb-1">Gender</label>
                                                    <p className="fw-semibold mb-0">{customer?.gender || 'None'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Account Security Card */}
                                    <div className="card border-0 shadow-sm rounded-4">
                                        <div className="card-body p-4">
                                            <h5 className="mb-4 fw-bold">Account Security</h5>
                                            <div className="row g-4">
                                                <div className="col-md-6">
                                                    <label className="text-muted small d-block mb-1">Email</label>
                                                    <p className="fw-semibold mb-1">{customer?.email}</p>
                                                    <a href="#" className="small text-decoration-none">Change email address</a>
                                                </div>

                                                <div className="col-md-6">
                                                    <label className="text-muted small d-block mb-1">Password</label>
                                                    <p className="fw-semibold mb-1">********</p>
                                                    <a href="#" className="small text-decoration-none">Change password</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}


                            {activeTab === "My Orders" && (
                                <div className="card border-0 shadow-sm rounded-4 p-4">
                                    <h5 className="fw-bold mb-4">Order History</h5>
                                    {orders.length > 0 ? (
                                        orders.map((order) => (
                                            <div key={order.order_id} className="border rounded p-3 mb-3">
                                                <div className="d-flex justify-content-between">
                                                    <h6>Order #{order.order_id}</h6>
                                                    <span className="badge bg-success">{order.final_total} BDT</span>
                                                </div>
                                                <hr />
                                                {order.products.map((p, i) => (
                                                    <div key={i} className="d-flex align-items-center mb-2">
                                                        <img src={p.image_url} width="40" className="me-2 rounded" alt="" />
                                                        <small>{p.product_name} (x{p.quantity})</small>
                                                    </div>
                                                ))}
                                                <small className="text-muted">Date: {new Date(order.created_at).toLocaleDateString()}</small>
                                            </div>
                                        ))
                                    ) : <p>No orders found.</p>}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default CustomerProfile;