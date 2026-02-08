import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const navigate = useNavigate();  // ⬅️ Redirect function

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const response = await fetch("http://127.0.0.1:8000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.status) {
                setSuccess(data.message);

                // store user info
                localStorage.setItem("adminUser", JSON.stringify(data.data));

                // ⬅️ auto redirect here
                setTimeout(() => {
                    navigate("/admin-home");
                }, 600); // small delay (optional)
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
            console.error(err);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card shadow p-4" style={{ width: "420px", borderRadius: "18px" }}>
                <h3 className="text-center mb-4 fw-bold text-primary">Welcome Back</h3>
                <p className="text-center text-muted mb-4" style={{ marginTop: "-15px" }}>
                    Sign in to continue
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Email Address</label>
                        <input
                            type="email"
                            className="form-control p-2"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Password</label>
                        <input
                            type="password"
                            className="form-control p-2"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100 mt-2 py-2 fw-semibold">
                        Login
                    </button>
                </form>

                {error && <p className="text-danger mt-3 text-center">{error}</p>}
                {success && <p className="text-success mt-3 text-center">{success}</p>}
            </div>
        </div>
    );
}
