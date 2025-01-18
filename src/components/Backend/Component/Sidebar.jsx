import { useState } from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const [isPageOpen, setIsPageOpen] = useState(false); // State to manage sub-links visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to manage sidebar visibility on mobile

  const togglePageLinks = () => setIsPageOpen(!isPageOpen);
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
    className={`d-flex flex-column bg-light p-3 vh-100 border rounded position-fixed mx-2 ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}
    style={{
        width: "250px",
        transition: "all 0.3s ease",
        border: "15px solid #ccc", // Increased border width for a bolder line
        borderRadius: "10px", // Apply border-radius
    }}
>
    <h2 className="mb-4">Gazi Builders</h2>
    <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
            <NavLink
                to="/admin-home"
                className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : "text-dark"}`
                }
            >
                Dashboard
            </NavLink>
        </li>
        <li className="nav-item">
            <NavLink
                to="/admin/orders"
                className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : "text-dark"}`
                }
            >
                Invoice
            </NavLink>
        </li>
        <li className="nav-item">
            <NavLink
                to="/admin/blogs"
                className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : "text-dark"}`
                }
            >
                Blogs
            </NavLink>
        </li>
        <li className="nav-item">
            <NavLink
                to="/admin/portfilo"
                className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : "text-dark"}`
                }
            >
                Portfolio
            </NavLink>
        </li>
        {/* Page Menu with Sub-links */}
        <li className="nav-item">
            <div
                className="nav-link text-dark d-flex justify-content-between align-items-center"
                onClick={togglePageLinks}
                style={{ cursor: "pointer" }}
            >
                Page
                <span>{isPageOpen ? "▼" : "▶"}</span> {/* Arrow toggle indicator */}
            </div>
            {isPageOpen && (
                <ul className="nav flex-column ms-3">
                    <li className="nav-item">
                        <NavLink
                            to="/admin/page/banner"
                            className={({ isActive }) =>
                                `nav-link ${isActive ? "active" : "text-dark"}`
                            }
                            style={{ transition: "color 0.2s ease" }}
                        >
                            Banner
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink
                            to="/admin/page/about"
                            className={({ isActive }) =>
                                `nav-link ${isActive ? "active" : "text-dark"}`
                            }
                            style={{ transition: "color 0.2s ease" }}
                        >
                            About Us
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink
                            to="/admin/page/services"
                            className={({ isActive }) =>
                                `nav-link ${isActive ? "active" : "text-dark"}`
                            }
                            style={{ transition: "color 0.2s ease" }}
                        >
                            Service
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink
                            to="/admin/page/projects"
                            className={({ isActive }) =>
                                `nav-link ${isActive ? "active" : "text-dark"}`
                            }
                            style={{ transition: "color 0.2s ease" }}
                        >
                            Projects
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink
                            to="/admin/page/testominal"
                            className={({ isActive }) =>
                                `nav-link ${isActive ? "active" : "text-dark"}`
                            }
                            style={{ transition: "color 0.2s ease" }}
                        >
                            Testimonial
                        </NavLink>
                    </li>
                </ul>
            )}
        </li>
    </ul>
</div>



    </>
  );
};

export default Sidebar;
