import { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaArrowLeft } from "react-icons/fa";

import * as bootstrap from "bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";

const Usersign = () => {
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [timeLeft, setTimeLeft] = useState(300);

    const [isVerified, setIsVerified] = useState(false);
    const API_BASE = import.meta.env.VITE_API_BASE_URL;



    const navigate = useNavigate();

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    // ⏱ Timer
    useEffect(() => {
        let timer;

        if (timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        }

        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = () => {
        const min = Math.floor(timeLeft / 60);
        const sec = timeLeft % 60;
        return `${min}:${sec < 10 ? "0" : ""}${sec}`;
    };

    // ✅ FIXED: OTP SEND (same button use, logic same)
    const handleLogin = async (e) => {
        e?.preventDefault();

        if (phone.length !== 11) {
            alert("Enter valid phone number");
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/send-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ phone }),
            });

            const data = await res.json();

            if (data.status) {
                const modal = new bootstrap.Modal(
                    document.getElementById("otpModal")
                );
                modal.show();
            } else {
                alert(data.message || "OTP send failed");
            }
        } catch (err) {
            console.log(err);
            alert("Something went wrong");
        }
    };

    // ❌ REMOVED wrong Navigate useEffect (important fix)

    const handleOtpChange = (value, index) => {
        if (!/^[0-9]?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 3) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleVerifyOtp = async () => {
        const finalOtp = otp.join("");

        if (finalOtp.length !== 4) {
            alert("Enter 4 digit OTP");
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/verify-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    phone,
                    otp: finalOtp,
                }),
            });

            const data = await res.json();

            if (data.status) {
                setIsVerified(true);

                const modalElement = document.getElementById("otpModal");
                const modalInstance =
                    bootstrap.Modal.getInstance(modalElement);
                modalInstance?.hide();
            } else {
                alert(data.message || "Invalid OTP");
            }
        } catch (err) {
            console.log(err);
            alert("OTP verification failed");
        }
    };

    const handleSubmit = async () => {
        if (form.password !== form.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    firstName: form.firstName,
                    lastName: form.lastName,
                    email: form.email,
                    phone: phone,
                    password: form.password,
                }),
            });

            const data = await res.json();

            if (data.status) {
                alert("Registration Successful ✅");

                localStorage.setItem("user", JSON.stringify(data.user));

                // ✅ optional redirect
                navigate("/");
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.log(err);
            alert("Something went wrong");
        }
    };

    return (
        <>
            <Header />
            <div className="login-container">
                {!isVerified && (
                    <div className="login-box">
                        <h3>Welcome to BDStall!</h3>
                        <p>Please login.</p>

                        <button className="login-btn" onClick={handleLogin}>
                            Sign Up / Login
                        </button>

                        <div className="divider">Or</div>

                        <input
                            type="text"
                            placeholder="Phone Number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            maxLength={11}
                        />

                        <button className="login-btn" onClick={handleLogin}>
                            Sign Up / Login
                        </button>
                        <p>
                            Already have an Account?{" "}
                            <span
                                onClick={() => navigate("/userlogin")}
                                style={{ color: "#007bff", cursor: "pointer", fontWeight: "500" }}
                            >
                                Login
                            </span>
                        </p>

                        <div className="social-login">
                            <button className="google-btn">
                                <FcGoogle size={20} /> Google
                            </button>

                            <button className="facebook-btn">
                                <FaFacebookF size={18} /> Facebook
                            </button>
                        </div>
                    </div>
                )}

                {isVerified && (
                    <div className="login-box">
                        <h4 className="mb-4 d-flex align-items-center gap-2">
                            <span
                                onClick={() => setIsVerified(false)}
                                style={{
                                    width: "35px",
                                    height: "35px",
                                    border: "1px solid #ccc",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    marginRight: "10px",
                                }}
                            >
                                <FaArrowLeft size={14} />
                            </span>

                            <span className="flex-grow-1 text-center">
                                Enter Your Details and Password
                            </span>
                        </h4>

                        <div className="mb-2">
                            <input
                                name="firstName"
                                placeholder="First Name"
                                className="form-control"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-2">
                            <input
                                name="lastName"
                                placeholder="Last Name"
                                className="form-control"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-2">
                            <input
                                name="email"
                                placeholder="Email"
                                className="form-control"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-2">
                            <input
                                name="phone"
                                value={phone}
                                className="form-control"
                                disabled
                            />
                        </div>

                        <div className="mb-2">
                            <input
                                name="password"
                                type="password"
                                placeholder="Password"
                                className="form-control"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-3">
                            <input
                                name="confirmPassword"
                                type="password"
                                placeholder="Confirm Password"
                                className="form-control"
                                onChange={handleChange}
                            />
                        </div>

                        <button
                            className="btn btn-success w-100 mb-3"
                            onClick={handleSubmit}
                        >
                            Create Account
                        </button>

                        <p className="small text-center">
                            By continuing, I accept the{" "}
                            <span style={{ color: "#4287f5", cursor: "pointer" }}>
                                Terms and Condition
                            </span>{" "}
                            and the{" "}
                            <span style={{ color: "#4287f5", cursor: "pointer" }}>
                                Privacy Policy
                            </span>
                        </p>

                        <div className="divider my-3 text-center">
                            Or Login With
                        </div>

                        <div className="social-login d-flex gap-2 justify-content-center">
                            <button className="google-btn">
                                <FcGoogle size={20} /> Google
                            </button>

                            <button className="facebook-btn">
                                <FaFacebookF size={18} /> Facebook
                            </button>
                        </div>
                    </div>
                )}

                <div className="modal fade" id="otpModal" tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered modal-sm">
                        <div className="modal-content p-3 text-center">
                            <h3>Enter OTP</h3>

                            <div className="otp-inputs d-flex justify-content-center gap-2 my-3">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`otp-${index}`}
                                        type="text"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) =>
                                            handleOtpChange(
                                                e.target.value,
                                                index
                                            )
                                        }
                                        className="form-control text-center"
                                        style={{ width: "45px", height: "45px" }}
                                    />
                                ))}
                            </div>

                            <p>OTP expires in: {formatTime()}</p>

                            <button
                                className="btn btn-success w-100"
                                onClick={handleVerifyOtp}
                            >
                                Verify OTP
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default Usersign;