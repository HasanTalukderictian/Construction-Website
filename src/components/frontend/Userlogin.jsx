import { useState } from "react";
import "../../assets/css/userlogin.scss";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Userlogin = () => {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const API_BASE = import.meta.env.VITE_API_BASE_URL;

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!phone || phone.length !== 11) {
            alert("Enter valid phone number");
            return;
        }

        if (!password) {
            alert("Password is required");
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    phone,
                    password,
                }),
            });

            const data = await res.json();

            if (data.status) {
                localStorage.setItem("user", JSON.stringify(data.user));

                alert("Login successful ✅");

                navigate("/");
            } else {
                alert(data.message || "Login failed");
            }

        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">

                <h3>Welcome to BDStall!</h3>
                <p>Please login.</p>

                <button className="phone-login-btn">
                    <FaPhoneAlt style={{ marginRight: "8px" }} />
                    Login with Phone Number
                </button>

                <div className="divider">Or</div>

                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button type="submit" className="login-btn">
                        Login
                    </button>
                </form>

                <p className="forgot">Forgot Your Password?</p>

                <p>
                    Do you have account?{" "}
                    <span
                        style={{ color: "#4287f5", cursor: "pointer" }}
                        onClick={() => navigate("/usersign")}
                    >
                        Create Account
                    </span>
                </p>

                <div className="social-login">
                    <button className="google-btn">
                        <FcGoogle size={20} style={{ marginRight: "8px" }} />
                        Google
                    </button>

                    <button className="facebook-btn">
                        <FaFacebookF size={18} style={{ marginRight: "8px" }} />
                        Facebook
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Userlogin;