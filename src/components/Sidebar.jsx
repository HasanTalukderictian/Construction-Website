import { useState } from "react";
import { NavLink } from "react-router-dom";

import '../../src/assets/css/Sidebar.scss';

const Sidebar = () => {
    const [isPageOpen, setIsPageOpen] = useState(true); // Default open the Page menu
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to manage sidebar visibility on mobile

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar on mobile

    return (
        <>
            {/* Button to toggle sidebar on mobile */}
            <button
                className="btn btn-dark d-lg-none position-fixed"
                style={{ top: "20px", left: "20px", zIndex: 1050 }}
                onClick={toggleSidebar}
            >
                ☰
            </button>

            <div
                className={`d-flex flex-column p-3 vh-100 border rounded position-fixed mx-2 bg-success text-white bg-opacity-75 ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"
                    }`}
                style={{
                    width: "250px",
                    transition: "all 0.3s ease",
                    border: "15px solid #ccc", // Increased border width for a bolder line
                    borderRadius: "10px", // Apply border-radius
                }}
            >
                <h2 className="mb-4">
                    <span className="text-warning">Gazi</span> Builders
                </h2>
                <ul className="nav nav-pills flex-column mb-auto">
                    <li className="nav-item">
                        <NavLink
                            to="/admin-home"
                            className={({ isActive }) =>
                                `nav-link ${isActive ? "active" : "text-white"}`
                            }
                            style={{ fontSize: "1.5rem" }}
                        >
                            <i className="bi bi-speedometer2 me-2 bi-xxl"></i> Dashboard
                        </NavLink>
                    </li>



                    <li className="nav-item">
                        <NavLink
                            to="/admin-orders"
                            className={({ isActive }) =>
                                `nav-link ${isActive ? "active" : "text-white"}`
                            }
                            style={{ fontSize: "1.5rem" }}
                        >
                            <i className="bi bi-receipt me-2"></i> Orders
                        </NavLink>
                    </li>




                    <li className="nav-item">
                        <NavLink
                            to="/admin-products"
                            className={({ isActive }) =>
                                `nav-link ${isActive ? "active" : "text-white"}`
                            }
                            style={{ fontSize: "1.5rem" }}
                        >
                            <i className="bi bi-receipt me-2"></i> Products
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink
                            to="/admin-store"
                            className={({ isActive }) =>
                                `nav-link ${isActive ? "active" : "text-white"}`
                            }
                            style={{ fontSize: "1.5rem" }}
                        >
                            <i className="bi bi-pencil-square me-2"></i> Store Settings
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink
                            to="/admin-couirer"
                            className={({ isActive }) =>
                                `nav-link ${isActive ? "active" : "text-white"}`
                            }
                            style={{ fontSize: "1.5rem" }}
                        >
                            <i className="bi bi-image me-2"></i> Couirer Settings
                        </NavLink>
                    </li>


                    <li className="nav-item">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `nav-link ${isActive ? "active" : "text-white"}`
                            }
                            style={{ fontSize: "1.5rem" }}
                        >
                            <i className="bi bi-image me-2"></i> Home
                        </NavLink>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default Sidebar;