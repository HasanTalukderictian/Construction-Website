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
          <h2 style={{ fontSize: "20px", margin: 0, color: 'white' }}>{header?.Companyname}</h2>
        </div>

        <ul className="nav flex-column">
          {[
            { to: "/admin-home", icon: "bi-grid-1x2-fill", label: "Dashboard" }, // Modern Grid Look
            { to: "/admin-orders", icon: "bi-cart-check", label: "Orders" },     // Sales focused
            { to: "/admin-category", icon: "bi-layers", label: "Category" },     // Layers for hierarchy
            { to: "/admin-products", icon: "bi-bag-plus", label: "Products" },    // E-commerce specific
            { to: "/admin-store", icon: "bi-shop", label: "Store Settings" },    // Real shop icon
            { to: "/admin-couirer", icon: "bi-bicycle", label: "Courier Settings" }, // Fast delivery feel
            { to: "/admin-users", icon: "bi-shield-lock", label: "User Settings" }, // Security/Admin feel
            { to: "/admin-testo", icon: "bi-chat-heart", label: "Testimonial" },   // Customer love/review
            { to: "/admin-banner", icon: "bi-images", label: "Banner" },           // Visual/Slideshow feel
            { to: "/admin-contact", icon: "bi-headset", label: "Contact" },        // Support feel
            { to: "/admin-team", icon: "bi-people-fill", label: "Team" },          // Professional group
            { to: "/admin-header", icon: "bi-layout-text-sidebar-reverse", label: "Header" }, // Header layout
            { to: "/admin-about", icon: "bi-info-square", label: "About Page" },   // Info specific
            { to: "/admin-ecommerce", icon: "bi-info-square", label: "Ecommerce Page" }    // EcommerceInfo specific
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
          <button onClick={handleLogout} className="nav-link logout-btn">
           <i className="bi bi-power me-2"></i>
            Logout
          </button>

        </ul>
      </div>
    </>
  );
};

export default Sidebar;