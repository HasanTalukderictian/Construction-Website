import { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";


import * as bootstrap from "bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Usersign = () => {
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [timeLeft, setTimeLeft] = useState(300);

    const [isVerified, setIsVerified] = useState(false);

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

    

    const handleLogin = () => {
        if (phone.length !== 11 || !/^01[0-9]{9}$/.test(phone)) {
            alert("Enter valid 11 digit number");
            return;
        }

        const modalElement = document.getElementById("otpModal");
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    };

    const handleOtpChange = (value, index) => {
        if (!/^[0-9]?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 3) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }

        // ✅ AUTO SWITCH TO SIGNUP PAGE
        if (newOtp.join("").length === 4 && !newOtp.includes("")) {
            setIsVerified(true);

            // close modal
            const modalElement = document.getElementById("otpModal");
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            modalInstance?.hide();
        }
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = () => {
        if (form.password !== form.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        // 🔴 duplicate check
        const existingUsers = JSON.parse(localStorage.getItem("users")) || [];

        const isDuplicate = existingUsers.some(
            (user) => user.phone === phone
        );

        if (isDuplicate) {
            alert("This phone number is already registered!");
            return;
        }

        // ✅ save user
        const newUser = {
            ...form,
            phone: phone,
        };

        existingUsers.push(newUser);
        localStorage.setItem("users", JSON.stringify(existingUsers));

        console.log("Signup Data:", newUser);
        alert("Signup successful (frontend only)");
    };

    return (
        <div className="login-container">

            {/* ================= LOGIN UI ================= */}
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

            {/* ================= SIGNUP UI ================= */}
            {isVerified && (
                <div className="login-box">
                    <h4 className="mb-4 d-flex align-items-center gap-2">

                        {/* Back Icon */}
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
                                marginRight: "10px"
                            }}
                        >
                            <FaArrowLeft size={14} />
                        </span>

                        {/* Title */}
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

                    <div className="divider my-3 text-center">Or Login With</div>

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

            {/* ================= OTP MODAL ================= */}
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
                                        handleOtpChange(e.target.value, index)
                                    }
                                    className="form-control text-center"
                                    style={{ width: "45px", height: "45px" }}
                                />
                            ))}
                        </div>

                        <p>OTP expires in: {formatTime()}</p>

                        <button className="btn btn-secondary w-100">
                            Enter 4 digit OTP
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Usersign;