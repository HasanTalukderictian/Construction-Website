import { useEffect, useState } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from "react-router-dom";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js"

import { Tour } from '@reactour/tour'; 
import '../../src/assets/css/dashboard.scss';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const steps = [
    { selector: ".dashboard-title", content: "Welcome to the Dashboard!" },
    { selector: ".card-title-orders", content: "This shows the total number of Orders." },
    { selector: ".card-title-products", content: "This shows the total number of Products." },
    { selector: ".card-title-users", content: "This shows the total number of Users." },
    { selector: ".pie-chart canvas", content: "Pie chart visualization of data." },
    { selector: ".bar-chart canvas", content: "Bar chart comparison of data." },
];

const Dashboard = () => {

    const navigate = useNavigate();

    const [dashboardData, setDashboardData] = useState({
        orders: 0,
        products: 0,
        users: 0
    });

    const [isTourOpen, setIsTourOpen] = useState(false);

    const fetchDashboardData = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/dashboard-data`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            });

            if (response.ok) {
                const data = await response.json();

                setDashboardData({
                    orders: data.orders.length,
                    products: data.products.length,
                    users: data.users.length
                });

                setIsTourOpen(true);

            } else if (response.status === 401) {
                console.error("Unauthorized access. Redirecting to login...");
                localStorage.removeItem("authToken");
                localStorage.removeItem("isAdminLoggedIn");
                navigate("/admin");
            } else {
                console.error("Failed to fetch dashboard data.");
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const pieData = {
        labels: ["Orders", "Products", "Users"],
        datasets: [{
            label: "Dashboard Data",
            data: [
                dashboardData.orders,
                dashboardData.products,
                dashboardData.users
            ],
            backgroundColor: [
                "rgba(255, 99, 132, 0.6)",
                "rgba(54, 162, 235, 0.6)",
                "rgba(255, 206, 86, 0.6)"
            ],
            borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)"
            ],
            borderWidth: 1,
        }]
    };

    const barData = {
        labels: ["Orders", "Products", "Users"],
        datasets: [{
            label: "Dashboard Data",
            data: [
                dashboardData.orders,
                dashboardData.products,
                dashboardData.users
            ],
            backgroundColor: [
                "rgba(255, 99, 132, 0.6)",
                "rgba(54, 162, 235, 0.6)",
                "rgba(255, 206, 86, 0.6)"
            ],
            borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)"
            ],
            borderWidth: 1,
        }]
    };

    const cards = [
        {
            title: "Total Orders",
            value: dashboardData.orders,
            className: "card-title-orders",
            color: "bg-primary",
            url: "/admin-orders/"
        },
        {
            title: "Total Products",
            value: dashboardData.products,
            className: "card-title-products",
            color: "bg-success",
            url: "/admin-products"
        },
        {
            title: "Total Users",
            value: dashboardData.users,
            className: "card-title-users",
            color: "bg-warning text-dark",
            url: "/admin-users"
        }
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
            </div>

            <div className="row g-4">
                {cards.map((card, index) => (
                    <div className="col-lg-4 col-md-6" key={index}>
                        <div
                            className={`card text-center ${card.color} text-white`}
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate(card.url)}
                        >
                            <div className="card-body">
                                <h5 className={card.className}>{card.title}</h5>
                                <p className="card-text text-white display-4">
                                    {card.value}
                                </p>
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
                            <div
                                className="pie-chart"
                                style={{
                                    marginTop: '5px',
                                    width: '400px',
                                    height: '300px',
                                    margin: '0 auto'
                                }}
                            >
                                <Pie
                                    data={pieData}
                                    options={{
                                        maintainAspectRatio: false,
                                        responsive: true,
                                        plugins: { legend: { position: 'top' } },
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
                            <div
                                className="bar-chart"
                                style={{
                                    marginTop: '5px',
                                    width: '100%',
                                    height: '300px'
                                }}
                            >
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
