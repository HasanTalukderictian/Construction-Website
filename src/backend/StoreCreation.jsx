import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import DashNav from "./DasNav";
import Footer from "./Footer";


export const API_BASE = import.meta.env.VITE_API_BASE_URL;

const StoreCreation = () => {
    const [formData, setFormData] = useState({
        full_name: "",
        phone_number: "",
        district_name: "",
        thana_name: "",
        address: "",
        label: "Home"
    });

    const [districts, setDistricts] = useState([]);
    const [thanas, setThanas] = useState([]);

    // Load districts from mapping.json
    useEffect(() => {
        fetch("/mapping.json")
            .then(res => res.json())
            .then(data => setDistricts(data))
            .catch(err => console.log("District Load Error", err));
    }, []);

    // Load existing store data from API
    useEffect(() => {
        const fetchStoreData = async () => {
            try {
                const response = await fetch(`${API_BASE}/stores`);
                const data = await response.json();

                // ✅ Take first store from the array
                if (response.ok && data.status && Array.isArray(data.data) && data.data.length > 0) {
                    const firstStore = data.data[0];
                    setFormData({
                        full_name: firstStore.full_name || "",
                        phone_number: firstStore.phone_number || "",
                        district_name: firstStore.district_name || "",
                        thana_name: firstStore.thana_name || "",
                        address: firstStore.address || "",
                        label: firstStore.label || "Home"
                    });
                }
            } catch (error) {
                console.error("Error fetching store data:", error);
            }
        };

        fetchStoreData();
    }, []);

    // Update thanas when district changes
    useEffect(() => {
        if (formData.district_name) {
            const selectedDistrict = districts.find(d => d.district === formData.district_name);
            if (selectedDistrict && Array.isArray(selectedDistrict.thana)) {
                setThanas(selectedDistrict.thana);
            } else {
                setThanas([]);
            }

            if (!selectedDistrict?.thana.includes(formData.thana_name)) {
                setFormData(prev => ({ ...prev, thana_name: "" }));
            }
        } else {
            setThanas([]);
            setFormData(prev => ({ ...prev, thana_name: "" }));
        }
    }, [formData.district_name, districts]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API_BASE}/stores`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            console.log("API response:", data);

            if (response.ok && data.status) {
                alert("Store saved successfully!");
            } else {
                alert(data.message || "Failed to save store.");
            }
        } catch (error) {
            console.error("Error submitting store:", error);
            alert("An error occurred while submitting the store.");
        }
    };

    return (
        <Layout>
            <div className="d-flex">
                <div className="flex-grow-1">
                    <DashNav />

                    <div className="container mt-4">
                        <h3 className="mb-4">Store Creation</h3>

                        <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
                            <div className="mb-3">
                                <label htmlFor="full_name" className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    id="full_name"
                                    name="full_name"
                                    className="form-control"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    placeholder="Enter Full Name"
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="phone_number" className="form-label">Phone Number</label>
                                <input
                                    type="text"
                                    id="phone_number"
                                    name="phone_number"
                                    className="form-control"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    placeholder="Enter Phone Number"
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="district_name" className="form-label">District</label>
                                <select
                                    id="district_name"
                                    name="district_name"
                                    className="form-select"
                                    value={formData.district_name}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select District</option>
                                    {districts.map((d, index) => (
                                        <option key={index} value={d.district}>{d.district}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="thana_name" className="form-label">Thana</label>
                                <select
                                    id="thana_name"
                                    name="thana_name"
                                    className="form-select"
                                    value={formData.thana_name}
                                    onChange={handleChange}
                                    required
                                    disabled={thanas.length === 0}
                                >
                                    <option value="">Select Thana</option>
                                    {thanas.map((t, index) => (
                                        <option key={index} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="address" className="form-label">Address</label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    className="form-control"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Enter Address"
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="label" className="form-label">Label</label>
                                <select
                                    id="label"
                                    name="label"
                                    className="form-select"
                                    value={formData.label}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="Home">Home</option>
                                    <option value="Shop">Shop</option>
                                </select>
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

export default StoreCreation;