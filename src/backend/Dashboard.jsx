import { useEffect, useState } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from "react-router-dom";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { Tour } from '@reactour/tour'; 
import '../../src/assets/css/dashboard.scss';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const steps = [
    { selector: ".dashboard-title", content: "Welcome to the Dashboard! Here you can see the overall data." },
    { selector: ".card-title-blogs", content: "This shows the total number of Blogs." },
    { selector: ".card-title-services", content: "This shows the total number of Services." },
    { selector: ".card-title-projects", content: "This shows the total number of Projects." },
    { selector: ".card-title-testimonials", content: "This shows the total number of Testimonials." },
    { selector: ".card-title-teams", content: "This shows the total number of Teams." },
    { selector: ".card-title-employee", content: "This shows the total number of Employees." },
    { selector: ".pie-chart canvas", content: "This pie chart shows a visual representation of the data." },
    { selector: ".bar-chart canvas", content: "This bar chart shows a comparison of the data." },
    { selector: ".logout-btn", content: "Click here to logout from the Dashboard." },
];

const Dashboard = () => {

    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const navigate = useNavigate();

    const [dashboardData, setDashboardData] = useState({
        blogs: 0,
        services: 0,
        projects: 0,
        testimonials: 0,
        teams: 0,
        employee: 0,
    });

    const [isTourOpen, setIsTourOpen] = useState(false);

    const fetchDashboardData = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/admin/admin-all`, {
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
                    employee: data.employee.length,
                });
                setIsTourOpen(true);
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

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleLogout = async () => {
        const token = localStorage.getItem("authToken");
        console.log("Logging out with token:", token);

        try {
            const response = await fetch(`${BASE_URL}/api/admin/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const result = await response.json();
            console.log("Logout response:", result);

            if (response.ok) {
                localStorage.removeItem("authToken");
                localStorage.removeItem("isAdminLoggedIn");
                navigate("/admin");
            } else {
                console.error("Logout failed. Status:", response.status);
            }
        } catch (error) {
            console.error("An error occurred during logout:", error);
        }
    };

    const pieData = {
        labels: ["Blogs", "Services", "Projects", "Testimonials", "Teams", "Employee"],
        datasets: [{
            label: "Dashboard Data",
            data: [
                dashboardData.blogs,
                dashboardData.services,
                dashboardData.projects,
                dashboardData.testimonials,
                dashboardData.teams,
                dashboardData.employee
            ],
            backgroundColor: [
                "rgba(255, 99, 132, 0.6)",
                "rgba(54, 162, 235, 0.6)",
                "rgba(255, 206, 86, 0.6)",
                "rgba(75, 192, 192, 0.6)",
                "rgba(153, 102, 255, 0.6)",
                "rgba(255, 159, 64, 0.6)",
            ],
            borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
            ],
            borderWidth: 1,
        }]
    };

    const barData = {
        labels: ["Blogs", "Services", "Projects", "Testimonials", "Teams", "Employee"],
        datasets: [{
            label: "Dashboard Data",
            data: [
                dashboardData.blogs,
                dashboardData.services,
                dashboardData.projects,
                dashboardData.testimonials,
                dashboardData.teams,
                dashboardData.employee
            ],
            backgroundColor: [
                "rgba(255, 99, 132, 0.6)",
                "rgba(54, 162, 235, 0.6)",
                "rgba(255, 206, 86, 0.6)",
                "rgba(75, 192, 192, 0.6)",
                "rgba(153, 102, 255, 0.6)",
                "rgba(255, 159, 64, 0.6)",
            ],
            borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
            ],
            borderWidth: 1,
        }]
    };

    const cards = [
        { title: "Total Blogs", value: dashboardData.blogs, className: "card-title-blogs", color: "bg-primary", url: "/admin/blogs" },
        { title: "Total Services", value: dashboardData.services, className: "card-title-services", color: "bg-success", url: "/admin/page/services" },
        { title: "Total Projects", value: dashboardData.projects, className: "card-title-projects", color: "bg-warning text-dark", url: "/admin/page/projects" },
        { title: "Total Testimonials", value: dashboardData.testimonials, className: "card-title-testimonials", color: "bg-info", url: "/admin/page/testominal" },
        { title: "Total Teams", value: dashboardData.teams, className: "card-title-teams", color: "bg-secondary", url: "/admin/page/banner" },
        { title: "Total Employee", value: dashboardData.employee, className: "card-title-employee", color: "bg-success", url: "/admin/employee" },
    ];

    return (
        <div className="container mt-1 border-2 bg-gradient-secondary">
            <Tour
                steps={steps}
                isOpen={isTourOpen}
                onRequestClose={() => setIsTourOpen(false)}
                className="custom-tour"
            />

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="dashboard-title">Dashboard</h2>
                <button
                    className="btn btn-danger rounded-pill px-4 py-2 logout-btn"
                    onClick={handleLogout}
                    style={{ fontSize: "1.5rem", marginLeft: '2px' }}
                >
                    <FontAwesomeIcon icon={faRightFromBracket} /> Logout
                </button>
            </div>

            <div className="row g-4">
                {cards.map((card, index) => (
                    <div className="col-lg-3 col-md-6" key={index}>
                        <div
                            className={`card text-center ${card.color} text-white`}
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate(card.url)}
                        >
                            <div className="card-body">
                                <h5 className={card.className}>{card.title}</h5>
                                <p className="card-text text-white display-4">{card.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row g-4 mt-4">
                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-body">
                            <h5 className="card-title">Pie Chart</h5>
                            <div className="pie-chart" style={{ marginTop: '5px', width: '400px', height: '300px', margin: '0 auto' }}>
                                <Pie
                                    data={pieData}
                                    options={{
                                        maintainAspectRatio: false,
                                        responsive: true,
                                        plugins: { legend: { position: 'top' } },
                                        layout: { padding: 2 },
                                        radius: '100%',
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-body">
                            <h5 className="card-title">Bar Chart</h5>
                            <div className="bar-chart" style={{ marginTop: '5px', width: '100%', height: '300px' }}>
                                <Bar
                                    data={barData}
                                    options={{
                                        maintainAspectRatio: false,
                                        responsive: true,
                                        plugins: { legend: { display: false } },
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;