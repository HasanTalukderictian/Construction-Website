import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../src/assets/css/Sidebar.scss";

export const API_BASE = import.meta.env.VITE_API_BASE_URL;

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [header, setHeader] = useState(null); // API data
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/admin");
  };

  // Fetch Header from API
  const fetchHeader = async () => {
    try {
      const res = await axios.get(`${API_BASE}/get-header`);
      if (res.data.status && res.data.data.length > 0) {
        setHeader(res.data.data[0]);
      }
    } catch (err) {
      console.error("Failed to fetch header:", err);
    }
  };

  useEffect(() => {
    fetchHeader();
  }, []);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button className="menu-btn d-lg-none" onClick={toggleSidebar}>
        ☰
      </button>

      {/* Overlay */}
      {isSidebarOpen && (
        <div className="sidebar-overlay d-lg-none" onClick={toggleSidebar}></div>
      )}

      {/* Sidebar */}
      <div className={`sidebar-container ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header d-flex align-items-center mb-3">
          {header?.image && (
            <img
              src={header.image}
              alt="Company Logo"
              style={{
                width: "40px",
                height: "40px",
                objectFit: "cover",
                borderRadius: "4px",
                marginRight: "8px",
              }}
            />
          )}
          <h2 style={{ fontSize: "20px", margin: 0 , color : 'white'}}>{header?.Companyname}</h2>
        </div>

        <ul className="nav flex-column">
          {[
            { to: "/admin-home", icon: "bi-speedometer2", label: "Dashboard" },
            { to: "/admin-orders", icon: "bi-receipt", label: "Orders" },
            { to: "/admin-category", icon: "bi-tags", label: "Category" },
            { to: "/admin-products", icon: "bi-box-seam", label: "Products" },
            { to: "/admin-store", icon: "bi-pencil-square", label: "Store Settings" },
            { to: "/admin-couirer", icon: "bi-truck", label: "Courier Settings" },
            { to: "/admin-users", icon: "bi-people", label: "User Settings" },
            { to: "/admin-testo", icon: "bi-star-fill", label: "Testimonial" },
            { to: "/admin-banner", icon: "bi-megaphone-fill", label: "Banner" },
            { to: "/admin-contact", icon: "bi-person-lines-fill", label: "Contact" },
            { to: "/admin-team", icon: "bi-person", label: "Team" },
            { to: "/admin-header", icon: "bi-sliders", label: "Header" },
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