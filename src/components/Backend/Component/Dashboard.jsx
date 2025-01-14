import { useEffect, useState } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from "react-router-dom";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Dashboard = () => {
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState({
        blogs: 0,
        services: 0,
        projects: 0,
        testimonials: 0,
        teams: 0,
    });

    // Function to fetch dashboard data
    const fetchDashboardData = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/admin/admin-all", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setDashboardData({
                    blogs: data.blogs.length,
                    services: data.services.length,
                    projects: data.projects.length,
                    testimonials: data.testimonials.length,
                    teams: data.teams.length,
                });
            } else if (response.status === 401) {
                console.error("Unauthorized access. Redirecting to login...");
                localStorage.removeItem("authToken");
                localStorage.removeItem("isAdminLoggedIn");
                navigate("/admin");
            } else {
                console.error("Failed to fetch dashboard data. Please try again.");
            }
        } catch (error) {
            console.error("An error occurred while fetching dashboard data:", error);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Logout function
    const handleLogout = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/admin/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            });

            if (response.ok) {
                localStorage.removeItem("authToken");
                localStorage.removeItem("isAdminLoggedIn");
                navigate("/admin");
            } else {
                console.error("Logout failed. Please try again.");
            }
        } catch (error) {
            console.error("An error occurred during logout:", error);
        }
    };

    // Pie Chart Data
    const pieData = {
        labels: ["Blogs", "Services", "Projects", "Testimonials", "Teams"],
        datasets: [
            {
                label: "Dashboard Data",
                data: [
                    dashboardData.blogs,
                    dashboardData.services,
                    dashboardData.projects,
                    dashboardData.testimonials,
                    dashboardData.teams,
                ],
                backgroundColor: [
                    "rgba(255, 99, 132, 0.6)",
                    "rgba(54, 162, 235, 0.6)",
                    "rgba(255, 206, 86, 0.6)",
                    "rgba(75, 192, 192, 0.6)",
                    "rgba(153, 102, 255, 0.6)",
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)",
                ],
                borderWidth: 1,
            },
        ],
    };

    // Bar Chart Data
    const barData = {
        labels: ["Blogs", "Services", "Projects", "Testimonials", "Teams"],
        datasets: [
            {
                label: "Dashboard Data",
                data: [
                    dashboardData.blogs,
                    dashboardData.services,
                    dashboardData.projects,
                    dashboardData.testimonials,
                    dashboardData.teams,
                ],
                backgroundColor: [
                    "rgba(255, 99, 132, 0.6)",
                    "rgba(54, 162, 235, 0.6)",
                    "rgba(255, 206, 86, 0.6)",
                    "rgba(75, 192, 192, 0.6)",
                    "rgba(153, 102, 255, 0.6)",
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)",
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="container mt-1 border-2 bg-gradient-secondary">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Dashboard</h2>
                <button className="btn btn-danger" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right"></i> Logout
                </button>
            </div>

            <div className="row g-4">
                {/* Dashboard Cards */}
                <div className="col-lg-3 col-md-6">
                    <div className="card text-center bg-primary text-white">
                        <div className="card-body">
                            <h5 className="card-title ">Total Blogs</h5>
                            <p className="card-text text-white display-4">{dashboardData.blogs}</p>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6">
                    <div className="card text-center bg-success text-white">
                        <div className="card-body">
                            <h5 className="card-title">Total Services</h5>
                            <p className="card-text text-white display-4">{dashboardData.services}</p>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6">
                    <div className="card text-center bg-warning text-dark">
                        <div className="card-body">
                            <h5 className="card-title text-white">Total Projects</h5>
                            <p className="card-text text-white display-4">{dashboardData.projects}</p>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6">
                    <div className="card text-center bg-info text-white">
                        <div className="card-body">
                            <h5 className="card-title">Total Testimonials</h5>
                            <p className="card-text text-white display-4">{dashboardData.testimonials}</p>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6">
                    <div className="card text-center bg-secondary text-white">
                        <div className="card-body">
                            <h5 className="card-title">Total Teams</h5>
                            <p className="card-text text-white display-4">{dashboardData.teams}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="row g-4 mt-4">
                <div className="col-lg-6">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Pie Chart</h5>
                            <Pie data={pieData} />
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Bar Chart</h5>
                            <Bar data={barData} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
