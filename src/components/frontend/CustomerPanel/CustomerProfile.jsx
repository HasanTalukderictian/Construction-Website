import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../common/Header';
import Footer from '../../common/Footer';
import { useNavigate } from "react-router-dom";
import '../../../assets/css/customerprofile.scss';

const CustomerProfile = () => {
    const [customer, setCustomer] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("Account Information");
    const [visibleOrders, setVisibleOrders] = useState(2);

    const [ticketForm, setTicketForm] = useState({
        subject: '',
        category: 'Delivery Issue',
        priority: 'Medium',
        message: ''
    });

    const [loadingTicket, setLoadingTicket] = useState(false);

    // সাপোর্ট টিকিটের জন্য নতুন স্টেট
    const [tickets, setTickets] = useState([]);
    const [showTicketForm, setShowTicketForm] = useState(false);

    const [user, setUser] = useState(null);
    const navigate = useNavigate();


    const handleTicketChange = (e) => {
        setTicketForm({
            ...ticketForm,
            [e.target.name]: e.target.value
        });
    };

    const fetchTickets = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/support-tickets`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setTickets(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (activeTab === "Support Tickets") {
            fetchTickets();
        }
    }, [activeTab]);

    const submitTicket = async () => {
        try {
            setLoadingTicket(true);

            const token = localStorage.getItem("token");

            await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/support-tickets`,
                ticketForm,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Ticket created successfully");

            setTicketForm({
                subject: '',
                category: 'Delivery Issue',
                priority: 'Medium',
                message: ''
            });

            setShowTicketForm(false);
            fetchTickets();

        } catch (error) {
            console.log(error);
        } finally {
            setLoadingTicket(false);
        }
    };

    useEffect(() => {
        const fetchCustomerData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    window.location.href = "/userlogin";
                    return;
                }
                const response = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/profile`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setCustomer(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching customer data", error);
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/userlogin";
                setLoading(false);
            }
        };
        fetchCustomerData();
    }, []);

    useEffect(() => {
        if (activeTab === "My Orders") {
            const fetchOrders = async () => {
                try {
                    const token = localStorage.getItem("token");
                    const response = await axios.get(
                        `${import.meta.env.VITE_API_BASE_URL}/customer-orders/${customer?.id}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    setOrders(response.data.data);
                } catch (error) {
                    console.error("Orders fetch failed", error);
                }
            };
            if (customer?.id) fetchOrders();
        }

        // সাপোর্ট টিকিট ফেচ করার লজিক (প্রয়োজন হলে এখানে API কল করতে পারেন)
        if (activeTab === "Support Tickets") {
            // fetchTickets(); 
        }
    }, [activeTab, customer?.id]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/userlogin");
    };

    const handleViewMore = () => {
        setVisibleOrders((prevValue) => prevValue + 2);
    };

    const sidebarItems = [
        { icon: "bi-person", label: "Account Information" },
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
                                                    handleLogout();
                                                } else {
                                                    setActiveTab(item.label);
                                                    setVisibleOrders(2);
                                                    setShowTicketForm(false); // ট্যাব চেঞ্জ করলে ফর্ম বন্ধ হয়ে যাবে
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

                            {/* Default Under Development View */}
                            {!["Account Information", "My Orders", "Support Tickets"].includes(activeTab) && (
                                <div className="card border-0 shadow-sm rounded-4 p-4 text-center">
                                    <h5 className="fw-bold mb-3">{activeTab}</h5>
                                    <p className="text-muted">🚧 Under Development</p>
                                </div>
                            )}

                            {/* Account Information Tab */}
                            {activeTab === "Account Information" && (
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
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* My Orders Tab */}
                            {activeTab === "My Orders" && (
                                <div className="card border-0 shadow-sm rounded-4 p-4">
                                    <h5 className="fw-bold mb-4">Order History</h5>
                                    {orders.length > 0 ? (
                                        <>
                                            {orders.slice(0, visibleOrders).map((order) => (
                                                <div key={order.order_id} className="border rounded p-3 mb-3 shadow-sm bg-white">
                                                    <div className="d-flex justify-content-between">
                                                        <h6 className="fw-bold text-primary">Order #{order.order_id}</h6>
                                                        <span className="badge bg-success">{order.final_total} BDT</span>
                                                    </div>
                                                    <hr className="my-2 text-muted" />
                                                    {order.products.map((p, i) => (
                                                        <div key={i} className="d-flex align-items-center mb-2">
                                                            <img src={p.image_url} width="40" height="40" className="me-3 rounded border" alt="" />
                                                            <small className="fw-medium">{p.product_name} (x{p.quantity})</small>
                                                        </div>
                                                    ))}
                                                    <div className="mt-2 text-end">
                                                        <small className="text-muted">Date: {new Date(order.created_at).toLocaleDateString()}</small>
                                                    </div>
                                                </div>
                                            ))}
                                            {orders.length > visibleOrders && (
                                                <div className="text-center mt-4">
                                                    <button onClick={handleViewMore} className="btn btn-primary rounded-pill px-5 py-2 shadow-sm">View More</button>
                                                </div>
                                            )}
                                        </>
                                    ) : <p className="text-center text-muted py-4">No orders found.</p>}
                                </div>
                            )}

                            {/* Support Tickets Tab */}
                            {activeTab === "Support Tickets" && (
                                <div className="card border-0 shadow-sm rounded-4 p-4">

                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <h5 className="fw-bold mb-0">Support Tickets</h5>

                                        <button
                                            className="btn btn-primary btn-sm rounded-pill px-3"
                                            onClick={() => setShowTicketForm(!showTicketForm)}
                                        >
                                            {showTicketForm ? "View Tickets" : "+ Create Ticket"}
                                        </button>
                                    </div>

                                    {/* ================= FORM ================= */}
                                    {showTicketForm ? (
                                        <div className="ticket-form row g-3">

                                            <div className="col-12">
                                                <label className="form-label small fw-bold">Subject</label>
                                                <input
                                                    type="text"
                                                    name="subject"
                                                    value={ticketForm.subject}
                                                    onChange={handleTicketChange}
                                                    className="form-control rounded-3"
                                                    placeholder="Briefly describe the issue"
                                                />
                                            </div>

                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold">Category</label>
                                                <select
                                                    name="category"
                                                    value={ticketForm.category}
                                                    onChange={handleTicketChange}
                                                    className="form-select rounded-3"
                                                >
                                                    <option>Delivery Issue</option>
                                                    <option>Payment Problem</option>
                                                    <option>Product Quality</option>
                                                    <option>Others</option>
                                                </select>
                                            </div>

                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold">Priority</label>
                                                <select
                                                    name="priority"
                                                    value={ticketForm.priority}
                                                    onChange={handleTicketChange}
                                                    className="form-select rounded-3"
                                                >
                                                    <option>Low</option>
                                                    <option>Medium</option>
                                                    <option>High</option>
                                                </select>
                                            </div>

                                            <div className="col-12">
                                                <label className="form-label small fw-bold">Message</label>
                                                <textarea
                                                    name="message"
                                                    value={ticketForm.message}
                                                    onChange={handleTicketChange}
                                                    rows="4"
                                                    className="form-control rounded-3"
                                                    placeholder="Write your message here..."
                                                ></textarea>
                                            </div>

                                            <div className="col-12">
                                                <button
                                                    onClick={submitTicket}
                                                    disabled={loadingTicket}
                                                    className="btn btn-primary px-4 rounded-pill"
                                                >
                                                    {loadingTicket ? "Submitting..." : "Submit Ticket"}
                                                </button>
                                            </div>

                                        </div>
                                    ) : (

                                        /* ================= TABLE ================= */
                                        <div className="table-responsive">

                                            <table className="table table-hover align-middle border-top">

                                                <thead className="small text-muted">
                                                    <tr>
                                                        <th>Ticket ID</th>
                                                        <th>Subject</th>
                                                        <th>Status</th>
                                                        <th>Date</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {tickets.length > 0 ? (
                                                        tickets.map((ticket) => (
                                                            <tr key={ticket.id}>
                                                                <td className="fw-bold">
                                                                    #TK-{ticket.ticket_no || ticket.id}
                                                                </td>

                                                                <td>{ticket.subject}</td>

                                                                <td>
                                                                    <span className={`badge rounded-pill
                                            ${ticket.status === "Pending" && "bg-warning"}
                                            ${ticket.status === "Resolved" && "bg-success"}
                                            ${ticket.status === "In Progress" && "bg-primary"}
                                            ${ticket.status === "Closed" && "bg-dark"}
                                        `}>
                                                                        {ticket.status}
                                                                    </span>
                                                                </td>

                                                                <td className="text-muted small">
                                                                    {new Date(ticket.created_at).toLocaleDateString()}
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="4" className="text-center py-5 text-muted">
                                                                <i className="bi bi-chat-left-text fs-1 d-block mb-2 opacity-25"></i>
                                                                No tickets found. Create your first ticket.
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>

                                            </table>

                                        </div>
                                    )}

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