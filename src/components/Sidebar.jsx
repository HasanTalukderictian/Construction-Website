// Sidebar.jsx
import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

export const API_BASE = import.meta.env.VITE_API_BASE_URL;

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [header, setHeader] = useState(null);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/admin");
  };

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

  const menuItems = [
    { to: "/admin-home", icon: "bi-grid-1x2-fill", label: "Dashboard" },
    { to: "/admin-orders", icon: "bi-cart-check", label: "Orders" },
    { to: "/admin-category", icon: "bi-layers", label: "Category" },
    { to: "/admin-products", icon: "bi-bag-plus", label: "Products" },
    { to: "/admin-store", icon: "bi-shop", label: "Store" },
    { to: "/admin-couirer", icon: "bi-bicycle", label: "Courier" },
    { to: "/admin-users", icon: "bi-shield-lock", label: "Users" },
    { to: "/admin-testo", icon: "bi-chat-heart", label: "Testimonials" },
    { to: "/admin-banner", icon: "bi-images", label: "Banner" },
    { to: "/admin-contact", icon: "bi-headset", label: "Contact" },
    { to: "/admin-team", icon: "bi-people-fill", label: "Team" },
    { to: "/admin-header", icon: "bi-layout-text-sidebar-reverse", label: "Header" },
    { to: "/admin-about", icon: "bi-info-square", label: "About" },
    { to: "/admin-ecommerce", icon: "bi-cart4", label: "Ecommerce" }
  ];

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
          {menuItems.map((item, index) => (
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

      <style>{`
        .sidebar-container {
          position: fixed;
          top: 0;
          left: -280px;
          width: 280px;
          height: 100vh;
          background: linear-gradient(180deg, #1e1e2f 0%, #1a1a2e 100%);
          transition: left 0.3s ease;
          z-index: 1000;
          padding: 20px;
          overflow-y: auto;
        }

        @media (min-width: 992px) {
          .sidebar-container {
            left: 0;
          }
        }

        .sidebar-container.open {
          left: 0;
        }

        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          z-index: 999;
        }

        .menu-btn {
          position: fixed;
          top: 15px;
          left: 15px;
          z-index: 1001;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          color: white;
          width: 45px;
          height: 45px;
          border-radius: 12px;
          font-size: 24px;
          cursor: pointer;
        }

        .sidebar-header h2 {
          font-size: 18px;
          margin: 0;
          color: white;
        }

        .nav {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .nav-item {
          margin-bottom: 8px;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          color: #cbd5e1;
          text-decoration: none;
          transition: all 0.3s ease;
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
          font-size: 14px;
        }

        .nav-link:hover {
          background: rgba(255,255,255,0.05);
          color: white;
        }

        .active-sidebar {
          background: rgba(102, 126, 234, 0.15);
          color: white;
        }

        .nav-link i {
          font-size: 18px;
          width: 24px;
        }

        .logout-btn {
          margin-top: 20px;
          color: #f87171;
        }

        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.15);
          color: #f87171;
        }
      `}</style>
    </>
  );
};

export default Sidebar;