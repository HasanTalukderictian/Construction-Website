// import { useEffect, useState } from "react";
// import 'bootstrap-icons/font/bootstrap-icons.css';
// import { useNavigate } from "react-router-dom";
// import { Pie, Bar } from "react-chartjs-2";

// import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

// import Tour from "reactour";
// import '../../../assets/css/dashboard.scss';

// ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// const steps = [
//     {
//         selector: ".dashboard-title",
//         content: "Welcome to the Dashboard! Here you can see the overall data.",
//     },
//     {
//         selector: ".card-title",
//         content: "These cards show the total counts for Blogs, Services, Projects, etc.",
//     },
//     {
//         selector: ".pie-chart",
//         content: "This pie chart shows a visual representation of the data.",
//     },
//     {
//         selector: ".bar-chart",
//         content: "This bar chart shows a comparison of the data.",
//     },
//     {
//         selector: ".logout-btn",
//         content: "Click here to logout from the Dashboard.",
//     },
// ];

// const Dashboard = () => {
//     const navigate = useNavigate();
//     const [dashboardData, setDashboardData] = useState({
//         blogs: 0,
//         services: 0,
//         projects: 0,
//         testimonials: 0,
//         teams: 0,
//     });

//     const [isTourOpen, setIsTourOpen] = useState(false);

//     const fetchDashboardData = async () => {
//         try {
//             const response = await fetch("http://127.0.0.1:8000/api/admin/admin-all", {
//                 method: "GET",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//                 },
//             });

//             if (response.ok) {
//                 const data = await response.json();
//                 setDashboardData({
//                     blogs: data.blogs.length,
//                     services: data.services.length,
//                     projects: data.projects.length,
//                     testimonials: data.testimonials.length,
//                     teams: data.teams.length,
//                 });
//                 setIsTourOpen(true); // Start the tour after data is fetched
//             } else if (response.status === 401) {
//                 console.error("Unauthorized access. Redirecting to login...");
//                 localStorage.removeItem("authToken");
//                 localStorage.removeItem("isAdminLoggedIn");
//                 navigate("/admin");
//             } else {
//                 console.error("Failed to fetch dashboard data. Please try again.");
//             }
//         } catch (error) {
//             console.error("An error occurred while fetching dashboard data:", error);
//         }
//     };

//     useEffect(() => {
//         fetchDashboardData();
//     }, []);

//     const handleLogout = async () => {
//         const token = localStorage.getItem("authToken");
//         console.log("Logging out with token:", token);
    
//         try {
//             const response = await fetch("http://127.0.0.1:8000/api/admin/logout", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
    
//             const result = await response.json();
//             console.log("Logout response:", result);
    
//             if (response.ok) {
//                 localStorage.removeItem("authToken");
//                 localStorage.removeItem("isAdminLoggedIn");
//                 navigate("/admin");
//             } else {
//                 console.error("Logout failed. Status:", response.status);
//             }
//         } catch (error) {
//             console.error("An error occurred during logout:", error);
//         }
//     };
    

//     const pieData = {
//         labels: ["Blogs", "Services", "Projects", "Testimonials", "Teams"],
//         datasets: [
//             {
//                 label: "Dashboard Data",
//                 data: [
//                     dashboardData.blogs,
//                     dashboardData.services,
//                     dashboardData.projects,
//                     dashboardData.testimonials,
//                     dashboardData.teams,
//                 ],
//                 backgroundColor: [
//                     "rgba(255, 99, 132, 0.6)",
//                     "rgba(54, 162, 235, 0.6)",
//                     "rgba(255, 206, 86, 0.6)",
//                     "rgba(75, 192, 192, 0.6)",
//                     "rgba(153, 102, 255, 0.6)",
//                 ],
//                 borderColor: [
//                     "rgba(255, 99, 132, 1)",
//                     "rgba(54, 162, 235, 1)",
//                     "rgba(255, 206, 86, 1)",
//                     "rgba(75, 192, 192, 1)",
//                     "rgba(153, 102, 255, 1)",
//                 ],
//                 borderWidth: 1,
//             },
//         ],
//     };

//     const barData = {
//         labels: ["Blogs", "Services", "Projects", "Testimonials", "Teams"],
//         datasets: [
//             {
//                 label: "Dashboard Data",
//                 data: [
//                     dashboardData.blogs,
//                     dashboardData.services,
//                     dashboardData.projects,
//                     dashboardData.testimonials,
//                     dashboardData.teams,
//                 ],
//                 backgroundColor: [
//                     "rgba(255, 99, 132, 0.6)",
//                     "rgba(54, 162, 235, 0.6)",
//                     "rgba(255, 206, 86, 0.6)",
//                     "rgba(75, 192, 192, 0.6)",
//                     "rgba(153, 102, 255, 0.6)",
//                 ],
//                 borderColor: [
//                     "rgba(255, 99, 132, 1)",
//                     "rgba(54, 162, 235, 1)",
//                     "rgba(255, 206, 86, 1)",
//                     "rgba(75, 192, 192, 1)",
//                     "rgba(153, 102, 255, 1)",
//                 ],
//                 borderWidth: 1,
//             },
//         ],
//     };

//     return (
//         <div className="container mt-1 border-2 bg-gradient-secondary">
//             <Tour
//                 steps={steps}
//                 isOpen={isTourOpen}
//                 onRequestClose={() => setIsTourOpen(false)}
//                 className="custom-tour"
//             />
//             <div className="d-flex justify-content-between align-items-center mb-4">
//                 <h2 className="dashboard-title">Dashboard</h2>
//                 <button
//                     className="btn btn-danger rounded-pill px-4 py-2 logout-btn"
//                     onClick={handleLogout}
//                     style={{ fontSize: "1.50rem", marginLeft: '2px' }}
//                 >
//                     <FontAwesomeIcon icon={faRightFromBracket} />
//                     Logout
//                 </button>
//             </div>

//             <div className="row g-4">
//                 <div className="col-lg-3 col-md-6">
//                     <div className="card text-center bg-primary text-white">
//                         <div className="card-body">
//                             <h5 className="card-title">Total Blogs</h5>
//                             <p className="card-text text-white display-4">{dashboardData.blogs}</p>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="col-lg-3 col-md-6">
//                     <div className="card text-center bg-success text-white">
//                         <div className="card-body">
//                             <h5 className="card-title">Total Services</h5>
//                             <p className="card-text text-white display-4">{dashboardData.services}</p>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="col-lg-3 col-md-6">
//                     <div className="card text-center bg-warning text-dark">
//                         <div className="card-body">
//                             <h5 className="card-title text-white">Total Projects</h5>
//                             <p className="card-text text-white display-4">{dashboardData.projects}</p>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="col-lg-3 col-md-6">
//                     <div className="card text-center bg-info text-white">
//                         <div className="card-body">
//                             <h5 className="card-title">Total Testimonials</h5>
//                             <p className="card-text text-white display-4">{dashboardData.testimonials}</p>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="col-lg-3 col-md-6">
//                     <div className="card text-center bg-secondary text-white">
//                         <div className="card-body">
//                             <h5 className="card-title">Total Teams</h5>
//                             <p className="card-text text-white display-4">{dashboardData.teams}</p>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div className="row g-4 mt-4">
//                 <div className="col-lg-6">
//                     <div className="card">
//                         <div className="card-body">
//                             <h5 className="card-title">Pie Chart</h5>
//                             <div className="pie-chart">
//                                 <Pie data={pieData} />
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="col-lg-6">
//                     <div className="card">
//                         <div className="card-body">
//                             <h5 className="card-title">Bar Chart</h5>
//                             <div className="bar-chart">
//                                 <Bar data={barData} />
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Dashboard;




import { useEffect, useState } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from "react-router-dom";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import Tour from "reactour";
import '../../../assets/css/dashboard.scss';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// Updated steps with UNIQUE selectors
const steps = [
    {
        selector: ".dashboard-title",
        content: "Welcome to the Dashboard! Here you can see the overall data.",
    },
    {
        selector: ".card-title-blogs",
        content: "This shows the total number of Blogs.",
    },
    {
        selector: ".card-title-services",
        content: "This shows the total number of Services.",
    },
    {
        selector: ".card-title-projects",
        content: "This shows the total number of Projects.",
    },
    {
        selector: ".card-title-testimonials",
        content: "This shows the total number of Testimonials.",
    },
    {
        selector: ".card-title-teams",
        content: "This shows the total number of Teams.",
    },
    {
        selector: ".card-title-employee",
        content: "This shows the total number of Teams.",
    },
    {
        selector: ".pie-chart",
        content: "This pie chart shows a visual representation of the data.",
    },
    {
        selector: ".bar-chart",
        content: "This bar chart shows a comparison of the data.",
    },
    {
        selector: ".logout-btn",
        content: "Click here to logout from the Dashboard.",
    },
];

const Dashboard = () => {
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState({
        blogs: 0,
        services: 0,
        projects: 0,
        testimonials: 0,
        teams: 0,
    });


    const [isTourOpen, setIsTourOpen] = useState(false);

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
            const response = await fetch("http://127.0.0.1:8000/api/admin/logout", {
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
        labels: ["Blogs", "Services", "Projects", "Testimonials", "Teams"],
        datasets: [{
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
        }],
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
            ],
            borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
            ],
            borderWidth: 1,
        }],
    };

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
                    style={{ fontSize: "1.50rem", marginLeft: '2px' }}
                >
                    <FontAwesomeIcon icon={faRightFromBracket} />
                    Logout
                </button>
            </div>

            <div className="row g-4">
                <div className="col-lg-3 col-md-6">
                    <div className="card text-center bg-primary text-white">
                        <div className="card-body">
                            <h5 className="card-title-blogs">Total Blogs</h5>
                            <p className="card-text text-white display-4">{dashboardData.blogs}</p>
                        </div>
                    </div>
                </div>

                <div className="col-lg-3 col-md-6">
                    <div className="card text-center bg-success text-white">
                        <div className="card-body">
                            <h5 className="card-title-services">Total Services</h5>
                            <p className="card-text text-white display-4">{dashboardData.services}</p>
                        </div>
                    </div>
                </div>

                <div className="col-lg-3 col-md-6">
                    <div className="card text-center bg-warning text-dark">
                        <div className="card-body">
                            <h5 className="card-title-projects text-white">Total Projects</h5>
                            <p className="card-text text-white display-4">{dashboardData.projects}</p>
                        </div>
                    </div>
                </div>

                <div className="col-lg-3 col-md-6">
                    <div className="card text-center bg-info text-white">
                        <div className="card-body">
                            <h5 className="card-title-testimonials">Total Testimonials</h5>
                            <p className="card-text text-white display-4">{dashboardData.testimonials}</p>
                        </div>
                    </div>
                </div>

                <div className="col-lg-3 col-md-6">
                    <div className="card text-center bg-secondary text-white">
                        <div className="card-body">
                            <h5 className="card-title-teams">Total Teams</h5>
                            <p className="card-text text-white display-4">{dashboardData.teams}</p>
                        </div>
                    </div>
                </div>

                <div className="col-lg-3 col-md-6">
                    <div className="card text-center bg-success text-white">
                        <div className="card-body">
                            <h5 className="card-title-teams">Total Employee</h5>
                            <p className="card-text text-white display-4">{dashboardData.employee}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4 mt-4">
                <div className="col-lg-6">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Pie Chart</h5>
                            <div className="pie-chart">
                                <Pie data={pieData} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Bar Chart</h5>
                            <div className="bar-chart">
                                <Bar data={barData} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
