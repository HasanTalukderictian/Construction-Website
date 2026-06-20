import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import DashNav from "./DasNav";
import Footer from "./Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BsShop, BsPerson, BsTelephone, BsGeoAlt, BsMap, BsHouse, BsSave } from "react-icons/bs";

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
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    // Load districts from mapping.json
    useEffect(() => {
        fetch("/mapping.json")
            .then(res => res.json())
            .then(data => setDistricts(data))
            .catch(err => {
                console.log("District Load Error", err);
                toast.error("Failed to load districts");
            });
    }, []);

    // Load existing store data from API
    useEffect(() => {
        const fetchStoreData = async () => {
            try {
                const response = await fetch(`${API_BASE}/stores`);
                const data = await response.json();

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
            } finally {
                setFetching(false);
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

            if (!selectedDistrict?.thana?.includes(formData.thana_name)) {
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
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE}/stores`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok && data.status) {
                toast.success("Store saved successfully!");
            } else {
                toast.error(data.message || "Failed to save store.");
            }
        } catch (error) {
            console.error("Error submitting store:", error);
            toast.error("An error occurred while submitting the store.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <Layout>
                <div className="d-flex">
                    <div className="flex-grow-1">
                        <DashNav />
                        <div className="container mt-4 text-center py-5">
                            <div className="spinner-border text-success" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                        <Footer />
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="d-flex">
                <div className="flex-grow-1">
                    <DashNav />

                    <div className="container-fluid px-4 py-4">
                        {/* Header */}
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h3 className="mb-1 fw-bold" style={{ color: "#2c3e50" }}>
                                    <BsShop className="me-2 text-success" /> Store Creation
                                </h3>
                                <p className="text-muted mb-0">Configure your store information</p>
                            </div>
                        </div>

                        {/* Form Card */}
                        <div className="row justify-content-center">
                            <div className="col-lg-8">
                                <div className="card border-0 shadow-sm">
                                    <div className="card-header bg-white border-0 pt-4 pb-0">
                                        <h5 className="mb-0 fw-semibold">Store Information</h5>
                                        <p className="text-muted small">Fill in the details below to create or update your store</p>
                                    </div>
                                    <div className="card-body p-4">
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                <div className="col-md-6 mb-3">
                                                    <label htmlFor="full_name" className="form-label fw-semibold">
                                                        <BsPerson className="me-1 text-success" /> Full Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="full_name"
                                                        name="full_name"
                                                        className="form-control"
                                                        value={formData.full_name}
                                                        onChange={handleChange}
                                                        placeholder="Enter full name"
                                                        required
                                                    />
                                                </div>

                                                <div className="col-md-6 mb-3">
                                                    <label htmlFor="phone_number" className="form-label fw-semibold">
                                                        <BsTelephone className="me-1 text-success" /> Phone Number
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        id="phone_number"
                                                        name="phone_number"
                                                        className="form-control"
                                                        value={formData.phone_number}
                                                        onChange={handleChange}
                                                        placeholder="Enter phone number"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-md-6 mb-3">
                                                    <label htmlFor="district_name" className="form-label fw-semibold">
                                                        <BsGeoAlt className="me-1 text-success" /> District
                                                    </label>
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

                                                <div className="col-md-6 mb-3">
                                                    <label htmlFor="thana_name" className="form-label fw-semibold">
                                                        <BsMap className="me-1 text-success" /> Thana / Upazila
                                                    </label>
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
                                                    {thanas.length === 0 && formData.district_name && (
                                                        <small className="text-warning">No thanas found for selected district</small>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="address" className="form-label fw-semibold">
                                                    <BsGeoAlt className="me-1 text-success" /> Detailed Address
                                                </label>
                                                <textarea
                                                    id="address"
                                                    name="address"
                                                    className="form-control"
                                                    rows="3"
                                                    value={formData.address}
                                                    onChange={handleChange}
                                                    placeholder="Enter complete address (house no, road, area, etc.)"
                                                    required
                                                ></textarea>
                                            </div>

                                            <div className="mb-4">
                                                <label htmlFor="label" className="form-label fw-semibold">
                                                    <BsHouse className="me-1 text-success" /> Store Label
                                                </label>
                                                <select
                                                    id="label"
                                                    name="label"
                                                    className="form-select"
                                                    value={formData.label}
                                                    onChange={handleChange}
                                                    required
                                                >
                                                    <option value="Home">🏠 Home</option>
                                                    <option value="Shop">🏪 Shop</option>
                                                </select>
                                                <small className="text-muted">Select where this store is located</small>
                                            </div>

                                            <hr className="my-4" />

                                            <div className="d-flex gap-3">
                                                <button 
                                                    type="submit" 
                                                    className="btn btn-success px-4 py-2"
                                                    disabled={loading}
                                                >
                                                    {loading ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                                            Saving...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <BsSave className="me-2" /> Save Store
                                                        </>
                                                    )}
                                                </button>
                                                <button 
                                                    type="button" 
                                                    className="btn btn-outline-secondary px-4 py-2"
                                                    onClick={() => {
                                                        setFormData({
                                                            full_name: "",
                                                            phone_number: "",
                                                            district_name: "",
                                                            thana_name: "",
                                                            address: "",
                                                            label: "Home"
                                                        });
                                                    }}
                                                >
                                                    Clear Form
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>

                                {/* Info Card */}
                                <div className="card border-0 bg-light mt-4">
                                    <div className="card-body">
                                        <h6 className="fw-semibold mb-2">
                                            <i className="bi bi-info-circle-fill text-success me-2"></i>
                                            Information
                                        </h6>
                                        <p className="small text-muted mb-0">
                                            This store information will be used for order processing and delivery management. 
                                            Please ensure all details are accurate before saving.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Footer />
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
        </Layout>
    );
};

export default StoreCreation;