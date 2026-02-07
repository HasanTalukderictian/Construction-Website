import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import '../../src/assets/css/Sidebar.scss';

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
            {/* Toggle button for mobile */}
            <button
                className="btn btn-dark d-lg-none position-fixed p-2"
                style={{ top: "20px", left: "20px", zIndex: 1050, fontSize: "1.5rem" }}
                onClick={toggleSidebar}
            >
                ☰
            </button>

            <div
                className={`d-flex flex-column p-3 vh-100 position-fixed mx-2 sidebar-bg text-white ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}
                style={{
                    width: "250px",
                    transition: "all 0.3s ease",
                    borderRadius: "15px",
                    boxShadow: "2px 2px 15px rgba(0,0,0,0.3)",
                }}
            >
                <h2 className="mb-4 text-center fw-bold" style={{ fontFamily: "'Gilroy', sans-serif" }}>
                    <span className="text-warning">Gazi</span> Builders
                </h2>

                <ul className="nav nav-pills flex-column mb-auto">
                    {[
                        { to: "/admin-home", icon: "bi-speedometer2", label: "Dashboard" },
                        { to: "/admin-orders", icon: "bi-receipt", label: "Orders" },
                        { to: "/admin-products", icon: "bi-box-seam", label: "Products" },
                        { to: "/admin-store", icon: "bi-pencil-square", label: "Store Settings" },
                        { to: "/admin-couirer", icon: "bi-truck", label: "Courier Settings" },
                        { to: "/admin-users", icon: "bi-people", label: "User Settings" }
                    ].map((item, index) => (
                        <li className="nav-item mb-2" key={index}>
                            <NavLink
                                to={item.to}
                                className={({ isActive }) =>
                                    `nav-link d-flex align-items-center gap-2 py-2 px-3 rounded ${isActive ? "active-sidebar" : "text-white"}`
                                }
                            >
                                <i className={`bi ${item.icon} fs-5`}></i>
                                <span className="fw-semibold">{item.label}</span>
                            </NavLink>
                        </li>
                    ))}

                    {/* Logout */}
                    <li className="nav-item mt-3">
                        <button
                            onClick={handleLogout}
                            className="nav-link text-white w-100 d-flex align-items-center gap-2 py-2 px-3 rounded logout-btn"
                            style={{ background: "none", border: "none" }}
                        >
                            <i className="bi bi-box-arrow-right fs-5"></i>
                            <span className="fw-semibold">Logout</span>
                        </button>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default Sidebar;
