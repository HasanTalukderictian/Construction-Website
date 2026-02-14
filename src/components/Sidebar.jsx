import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../../src/assets/css/Sidebar.scss";

const Sidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        navigate("/admin");
    };

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                className="menu-btn d-lg-none"
                onClick={toggleSidebar}
            >
                ☰
            </button>

            {/* Overlay */}
            {isSidebarOpen && (
                <div
                    className="sidebar-overlay d-lg-none"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Sidebar */}
            <div className={`sidebar-container ${isSidebarOpen ? "open" : ""}`}>
                <h4 className="brand-title">
                    <span>Gazi</span> Builders
                </h4>

                <ul className="nav flex-column">
                    {[
                        { to: "/admin-home", icon: "bi-speedometer2", label: "Dashboard" },
                        { to: "/admin-orders", icon: "bi-receipt", label: "Orders" },
                        { to: "/admin-products", icon: "bi-box-seam", label: "Products" },
                        { to: "/admin-store", icon: "bi-pencil-square", label: "Store Settings" },
                        { to: "/admin-couirer", icon: "bi-truck", label: "Courier Settings" },
                        { to: "/admin-users", icon: "bi-people", label: "User Settings" }
                    ].map((item, index) => (
                        <li key={index} className="nav-item">
                            <NavLink
                                to={item.to}
                                onClick={() => setIsSidebarOpen(false)}
                                className={({ isActive }) =>
                                    `nav-link ${isActive ? "active-sidebar" : ""}`
                                }
                            >
                                <i className={`bi ${item.icon}`}></i>
                                {item.label}
                            </NavLink>
                        </li>
                    ))}

                    <li className="nav-item mt-3">
                        <button onClick={handleLogout} className="nav-link logout-btn">
                            <i className="bi bi-box-arrow-right"></i>
                            Logout
                        </button>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default Sidebar;
