import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Admin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (submittedData) {
      const { email, password } = submittedData;

      const login = async () => {
        try {
          const response = await fetch("http://127.0.0.1:8000/api/admin/login", {
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
    <div className="container mt-5">
      <h2 className="text-center mb-4">Admin Login</h2>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form
            className="p-4 shadow rounded"
            onSubmit={handleSubmit}
            style={{ background: "#f8f9fa" }}
          >
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
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

      {/* Logout Button - Only visible after successful login */}
     
    </div>
  );
};

export default Admin;
