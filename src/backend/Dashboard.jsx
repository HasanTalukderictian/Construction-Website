import { useEffect, useState } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from "react-router-dom";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
import { FaShoppingCart, FaBox, FaUsers, FaStar } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const API_BASE = import.meta.env.VITE_API_BASE_URL;

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Dashboard = () => {
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState({
        orders: 0,
        products: 0,
        users: 0,
        review: 0
    });
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch(`${API_BASE}/dashboard-data`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setDashboardData({
                    orders: data.orders?.length || 0,
                    products: data.products?.length || 0,
                    users: data.users?.length || 0,
                    review: data.review?.length || 0,
                });
            } else if (response.status === 401) {
                localStorage.removeItem("authToken");
                localStorage.removeItem("isAdminLoggedIn");
                toast.error("Session expired. Please login again.");
                navigate("/admin");
            } else {
                toast.error("Failed to fetch dashboard data.");
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            toast.error("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const chartData = {
        labels: ["Orders", "Products", "Users", "Reviews"],
        datasets: [{
            label: "Total Count",
            data: [
                dashboardData.orders,
                dashboardData.products,
                dashboardData.users,
                dashboardData.review
            ],
            backgroundColor: [
                "rgba(255, 99, 132, 0.7)",
                "rgba(54, 162, 235, 0.7)",
                "rgba(255, 206, 86, 0.7)",
                "rgba(155, 89, 182, 0.7)"
            ],
            borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(155, 89, 182, 1)"
            ],
            borderWidth: 1,
        }]
    };

    const barChartData = {
        labels: ["Orders", "Products", "Users", "Reviews"],
        datasets: [{
            label: "Dashboard Statistics",
            data: [
                dashboardData.orders,
                dashboardData.products,
                dashboardData.users,
                dashboardData.review
            ],
            backgroundColor: "rgba(54, 162, 235, 0.7)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
            borderRadius: 8,
        }]
    };

    const chartOptions = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: { font: { size: 12 } }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `${context.label}: ${context.raw} items`;
                    }
                }
            }
        }
    };

    const barChartOptions = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `Total: ${context.raw} items`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { stepSize: 1 }
            }
        }
    };

    const cards = [
        {
            title: "Total Orders",
            value: dashboardData.orders,
            icon: <FaShoppingCart size={28} />,
            color: "primary",
            bgClass: "bg-primary",
            url: "/admin-orders/"
        },
        {
            title: "Total Products",
            value: dashboardData.products,
            icon: <FaBox size={28} />,
            color: "success",
            bgClass: "bg-success",
            url: "/admin-products"
        },
        {
            title: "Total Users",
            value: dashboardData.users,
            icon: <FaUsers size={28} />,
            color: "warning",
            bgClass: "bg-warning",
            url: "/admin-users"
        },
        {
            title: "Total Reviews",
            value: dashboardData.review,
            icon: <FaStar size={28} />,
            color: "info",
            bgClass: "bg-info",
            url: "/admin-testo"
        }
    ];

    return (
        <div className="container-fluid px-4 py-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-1 fw-bold" style={{ color: "#2c3e50" }}>Dashboard</h2>
                    <p className="text-muted mb-0">Welcome back! Here's what's happening today.</p>
                </div>
                <div className="text-muted">
                    <i className="bi bi-calendar3 me-1"></i>
                    {new Date().toLocaleDateString()}
                </div>
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted">Loading dashboard data...</p>
                </div>
            ) : (
                <>
                    {/* Stats Cards */}
                    <div className="row g-4 mb-4">
                        {cards.map((card, index) => (
                            <div className="col-xl-3 col-md-6" key={index}>
                                <div 
                                    className="card border-0 shadow-sm h-100"
                                    style={{ cursor: "pointer", borderRadius: "12px", overflow: "hidden" }}
                                    onClick={() => navigate(card.url)}
                                >
                                    <div className={`${card.bgClass} text-white p-3 h-100`}>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <h6 className="mb-1 opacity-75">{card.title}</h6>
                                                <h2 className="mb-0 fw-bold">{card.value}</h2>
                                            </div>
                                            <div className="bg-white bg-opacity-25 rounded-circle p-3">
                                                {card.icon}
                                            </div>
                                        </div>
                                        <div className="mt-3 small">
                                            <i className="bi bi-arrow-right-circle"></i> Click to view details
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Charts Section */}
                    <div className="row g-4">
                        <div className="col-lg-6">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-header bg-white border-0 pt-3">
                                    <h5 className="card-title mb-0 fw-semibold">
                                        <i className="bi bi-pie-chart me-2 text-primary"></i>
                                        Distribution Overview
                                    </h5>
                                </div>
                                <div className="card-body">
                                    <div style={{ height: "350px", width: "100%" }}>
                                        <Pie data={chartData} options={chartOptions} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-header bg-white border-0 pt-3">
                                    <h5 className="card-title mb-0 fw-semibold">
                                        <i className="bi bi-bar-chart-steps me-2 text-success"></i>
                                        Statistics Comparison
                                    </h5>
                                </div>
                                <div className="card-body">
                                    <div style={{ height: "350px", width: "100%" }}>
                                        <Bar data={barChartData} options={barChartOptions} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="row mt-4">
                        <div className="col-12">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body">
                                    <h6 className="fw-semibold mb-3">Quick Actions</h6>
                                    <div className="d-flex gap-3 flex-wrap">
                                        <button className="btn btn-outline-primary" onClick={() => navigate("/admin-products")}>
                                            <i className="bi bi-plus-circle me-1"></i> Add Product
                                        </button>
                                        <button className="btn btn-outline-success" onClick={() => navigate("/admin-orders/")}>
                                            <i className="bi bi-eye me-1"></i> View Orders
                                        </button>
                                        <button className="btn btn-outline-warning" onClick={() => navigate("/admin-users")}>
                                            <i className="bi bi-people me-1"></i> Manage Users
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default Dashboard;