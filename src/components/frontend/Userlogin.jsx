import { useState } from "react";
import "../../assets/css/userlogin.scss";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";

// Toastify imports
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useGoogleLogin } from "@react-oauth/google";


const Userlogin = () => {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const location = useLocation();
    const API_BASE = import.meta.env.VITE_API_BASE_URL;

    const handleLogin = async (e) => {
        e.preventDefault();

        // Validation toasts
        if (!phone || phone.length !== 11) {
            toast.error("Enter valid 11-digit phone number");
            return;
        }

        if (!password) {
            toast.error("Password is required");
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ phone, password }),
            });

            const data = await res.json();

            if (data.status) {
                // ১. সাকসেস টোস্ট দেখানো
                toast.success("Login Successful! Redirecting", {
                    position: "top-right",
                    autoClose: 1000,
                });

                // ২. ডাটা সেভ করা
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("user_id", data.user.id);

                // ৩. ২ সেকেন্ড পর রিডাইরেক্ট (যাতে ইউজার টোস্টটা দেখতে পায়)
                setTimeout(() => {
                    if (location.state?.redirectTo === "/checkout") {
                        navigate("/checkout", {
                            state: {
                                cartItems: location.state.cartItems,
                                deliveryCharge: location.state.deliveryCharge,
                                totalPrice: location.state.totalPrice,
                                selectedDelivery: location.state.selectedDelivery
                            }
                        });
                    } else {
                        navigate("/profile");
                    }
                }, 1000);
            } else {
                // লগইন ফেইল হলে এরর টোস্ট
                toast.error(data.message || "Invalid Credentials!");
            }

        } catch (error) {
            console.error(error);
            toast.error("Something went wrong. Please try again.");
        }
    };

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.access_token}`,
                    },
                });

                const profile = await res.json();

                const backendRes = await fetch(`${API_BASE}/social-login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        provider: "google",
                        provider_id: profile.sub,
                        email: profile.email,
                        name: profile.name,
                        avatar: profile.picture,
                    }),
                });

                const data = await backendRes.json();

                if (data.status) {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("user", JSON.stringify(data.user));

                    toast.success("Google Login Successful 🚀");

                    setTimeout(() => {
                        navigate("/profile");
                    }, 1000);
                } else {
                    toast.error("Login failed");
                }
            } catch (error) {
                toast.error("Google login error");
            }
        },
        onError: () => toast.error("Google Login Failed"),
    });







    return (
        <>
            <Header />

            {/* Toast Container - এটা সবার উপরে রাখা ভালো */}
            <ToastContainer
                position="top-right"
                autoClose={1500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />

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

                        <div style={{ display: "flex", gap: "5px", width: "100%" }}>




                            <button
                                onClick={() => googleLogin()}
                                className="google-btn"
                                style={{
                                    flex: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "8px"
                                }}
                            >
                                <FcGoogle size={18} />
                                Google
                            </button>

                            {/* Facebook */}
                            <button
                                className="facebook-btn"
                                style={{
                                    flex: 1,
                                    width: "80%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "8px"
                                }}
                            >
                                <FaFacebookF size={16} />
                                Facebook
                            </button>

                        </div>


                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default Userlogin;