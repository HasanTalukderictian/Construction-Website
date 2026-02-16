import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import DashNav from "./DasNav";
import Footer from "./Footer";

const CourierSettings = () => {
    const [formData, setFormData] = useState({
        paperflyKey: "",
        Username: "",
        Password: ""
    });

    // Load data from localStorage when component mounts
    useEffect(() => {
        const savedData = localStorage.getItem("courierSettings");
        if (savedData) {
            setFormData(JSON.parse(savedData));
        }
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Save data to localStorage
        localStorage.setItem("courierSettings", JSON.stringify(formData));
        alert("Settings saved!");
        console.log("Form submitted:", formData);
    };

    return (
        <Layout>
            <div className="d-flex">
                <div className="flex-grow-1">
                    <DashNav />

                    <div className="container mt-4">
                        <h3 className="mb-4">Courier Settings</h3>

                        <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
                            <div className="mb-3">
                                <label htmlFor="paperflyKey" className="form-label">
                                    Paperfly Key
                                </label>
                                <input
                                    type="text"
                                    id="paperflyKey"
                                    name="paperflyKey"
                                    className="form-control"
                                    value={formData.paperflyKey}
                                    onChange={handleChange}
                                    placeholder="Enter Paperfly Key"
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="Username" className="form-label">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    id="Username"
                                    name="Username"
                                    className="form-control"
                                    value={formData.Username}
                                    onChange={handleChange}
                                    placeholder="Enter Username"
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="Password" className="form-label">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="Password"
                                    name="Password"
                                    className="form-control"
                                    value={formData.Password}
                                    onChange={handleChange}
                                    placeholder="Enter Password"
                                    required
                                />
                            </div>

                            <button type="submit" className="btn btn-success">
                                Submit
                            </button>
                        </form>
                    </div>

                    <Footer />
                </div>
            </div>
        </Layout>
    );
};

export default CourierSettings;
