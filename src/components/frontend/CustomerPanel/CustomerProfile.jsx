import { useState, useEffect } from 'react';
import axios from 'axios'; // Ensure axios is installed: npm install axios
import Header from '../../common/Header';
import Footer from '../../common/Footer';
import '../../../assets/css/customerprofile.scss';

const CustomerProfile = () => {

    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);

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

    const sidebarItems = [
        { icon: "bi-person", label: "Account Information", active: true },
        { icon: "bi-box-seam", label: "My Orders" },
        { icon: "bi-star", label: "My Product Reviews" },
        { icon: "bi-chat-left-dots", label: "Support Tickets" },
        { icon: "bi-gem", label: "Pickaboo Club" },
        { icon: "bi-share", label: "Share & Earn" },
        { icon: "bi-geo-alt", label: "Manage Addresses" },
        { icon: "bi-credit-card", label: "Saved Payment Methods" },
        { icon: "bi-question-circle", label: "Help & Knowledge Base" },
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
                                            className={`list-group-item list-group-item-action border-0 d-flex align-items-center py-3 ${item.active ? 'active-menu' : ''}`}
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
                                            {/* Dynamic Data from backend */}
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
                                            <p className="text-muted small mb-0">{customer?.email || 'Enter your birthday'}</p>
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
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default CustomerProfile;