import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import icon from '../../assets/images/Logo Icon.png';

const Admin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State to toggle password visibility
  const navigate = useNavigate();

  useEffect(() => {
    if (submittedData) {
      const { email, password } = submittedData;

      const login = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/api/admin/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();
          console.log(data);

          if (response.ok) {
            const token = data.token; // Get the token from response
            setResponseMessage(data.message || "Login successful!");
            localStorage.setItem("authToken", token); // Save token to localStorage
            localStorage.setItem("isAdminLoggedIn", true); // Optional: To track login status
            setShowModal(true);
            setTimeout(() => {
              setShowModal(false);
              navigate("/admin-home"); // Redirect to admin home after 2 seconds
            }, 1000);
          } else {
            setResponseMessage(data.error || "Login failed! Please check your credentials.");
            setShowModal(true);
          }
        } catch (error) {
          setResponseMessage("An error occurred. Please try again later.");
          setShowModal(true);
          console.error("Error during login:", error);
        }
      };

      login();
    }
  }, [submittedData, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedData({ email, password }); // Triggers useEffect for login
  };

  return (
    <div 
      className="container mt-5 bg-success p-2 text-dark bg-opacity-100"
      style={{
        border: '5px solid rgb(223, 236, 228)',
        width: '500px',
        height: '600px',
        margin: '0 auto',
        padding: '20px',
        borderRadius: '15px',
      }}
    >
      <div className="row justify-content-center">
        <div 
          className="col-md-6"
          style={{
            width: '800px',
            height: '900px',
            padding: '50px',
          }}
        >
          <form
            className="p-4 shadow rounded"
            onSubmit={handleSubmit}
            style={{ background: "#f8f9fa" }}
          >  
            {/* Centered Circular Image */}
            <div className="d-flex justify-content-center">
              <img src={icon} alt="Icon" className="rounded-circle" style={{ width: '100px' }} />
            </div>

            <h2 className="text-center mb-4">Gazi Builders</h2>
            
            {/* Email Input */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-envelope-fill"></i>
                </span>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="input-group">
                <span
                  className="input-group-text"
                  style={{ cursor: "pointer" }}
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)} // Toggle password visibility
                >
                  <i className={`bi ${isPasswordVisible ? "bi-unlock-fill" : "bi-lock-fill"}`}></i>
                </span>
                <input
                  type={isPasswordVisible ? "text" : "password"} // Toggle input type
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
          </form>
        </div>
      </div>
    
      {/* Modal */}
      <div
        className={`modal fade ${showModal ? "show" : ""}`}
        style={{ display: showModal ? "block" : "none" }}
        tabIndex="-1"
        aria-hidden={!showModal}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Notification</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>{responseMessage}</p>
            </div>
          </div>
        </div>
      </div>
    
      {/* Backdrop */}
      {showModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default Admin;
