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

    // Load data from backend when component mounts
    useEffect(() => {
        const fetchCourier = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/couriers");
                const data = await response.json();
                if (response.ok && data.status && data.data.length > 0) {
                    // Fill form with first courier record
                    setFormData({
                        paperflyKey: data.data[0].paperflyKey || "",
                        Username: data.data[0].Username || "",
                        Password: data.data[0].Password || ""
                    });
                }
            } catch (error) {
                console.error("Error fetching courier settings:", error);
            }
        };

        fetchCourier();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://127.0.0.1:8000/api/couriers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            console.log("API response:", data);

            if (response.ok && data.status) {
                alert("Courier settings saved successfully!");
            } else {
                alert(data.message || "Failed to save settings.");
            }

        } catch (error) {
            console.error("Error submitting courier settings:", error);
            alert("An error occurred while submitting the settings.");
        }
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
                                <label htmlFor="paperflyKey" className="form-label">Paperfly Key</label>
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
                                <label htmlFor="Username" className="form-label">Username</label>
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
                                <label htmlFor="Password" className="form-label">Password</label>
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

                            <button type="submit" className="btn btn-success">Submit</button>
                        </form>
                    </div>

                    <Footer />
                </div>
            </div>
        </Layout>
    );
};

export default CourierSettings;