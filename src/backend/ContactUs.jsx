import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Footer from "./Footer";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashNav from "./DasNav";

const ContactUs = () => {
    const [contact, setContact] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const [isEditing, setIsEditing] = useState(false); // true if editing existing contact

    // Fetch Contact
    const fetchContact = () => {
        setLoading(true);
        axios
            .get("http://127.0.0.1:8000/api/get-contact")
            .then((res) => {
                if (res.data.status && res.data.data) {
                    setContact(res.data.data);
                } else {
                    setContact(null);
                }
            })
            .catch((err) => {
                console.error(err);
                toast.error("Failed to fetch contact data.");
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchContact();
    }, []);

    // Image Handling
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const removePreview = () => {
        setImage(null);
        setPreview(isEditing && contact ? contact.image : null);
        const fileInput = document.getElementById("contactImageInput");
        if (fileInput) fileInput.value = "";
    };

    const resetForm = () => {
        if (isEditing && contact) {
            setAddress(contact.address);
            setPhone(contact.phone);
            setEmail(contact.email);
            setPreview(contact.image);
        } else {
            setAddress("");
            setPhone("");
            setEmail("");
            setImage(null);
            setPreview(null);
        }
    };

    // Add or Update Contact
    const submitContact = async () => {
        const formData = new FormData();
        formData.append("address", address);
        formData.append("phone", phone);
        formData.append("email", email);
        if (image) formData.append("image", image);

        try {
            let res;
            if (isEditing && contact) {
                // Update existing contact
                res = await axios.post(
                    `http://127.0.0.1:8000/api/edit-contact/${contact.id}`,
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );
            } else {
                // Add new contact
                res = await axios.post(
                    "http://127.0.0.1:8000/api/add-contact",
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );
            }

            if (res.data.status) {
                fetchContact();
                setShowModal(false);
                toast.success(
                    isEditing ? "Contact updated successfully!" : "Contact added successfully!"
                );
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to submit contact.");
        }
    };

    return (
        <Layout>
            <div className="d-flex">
                <div className="flex-grow-1">
                    <DashNav />

                    <div className="container mt-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h3>Contact Us</h3>
                            {/* Add Contact Button always blank */}
                            <button
                                className="btn btn-success"
                                onClick={() => {
                                    setIsEditing(false); // open blank modal
                                    resetForm();
                                    setShowModal(true);
                                }}
                            >
                                + Add Contact
                            </button>
                        </div>

                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>Address</th>
                                            <th>Phone</th>
                                            <th>Email</th>
                                            <th>Image</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {contact ? (
                                            <tr>
                                                <td>{contact.address}</td>
                                                <td>{contact.phone}</td>
                                                <td>{contact.email}</td>
                                                <td>
                                                    {contact.image && (
                                                        <img
                                                            src={contact.image}
                                                            width="60"
                                                            height="60"
                                                            style={{ objectFit: "cover" }}
                                                            alt="Contact"
                                                        />
                                                    )}
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-success btn-sm"
                                                        onClick={() => {
                                                            setIsEditing(true); // edit mode
                                                            resetForm();
                                                            setShowModal(true);
                                                        }}
                                                    >
                                                        <i className="bi bi-pencil"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="text-center">
                                                    No contact information found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <Footer />
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div
                    className="modal fade show"
                    style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{isEditing ? "Edit Contact" : "Add Contact"}</h5>
                                <button
                                    className="btn-close"
                                    onClick={() => {
                                        setShowModal(false);
                                        resetForm();
                                    }}
                                ></button>
                            </div>

                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Address</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Phone</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Image</label>
                                    <input
                                        id="contactImageInput"
                                        type="file"
                                        className="form-control"
                                        onChange={handleImageChange}
                                    />
                                    {preview && (
                                        <div className="position-relative mt-3 d-inline-block">
                                            <img
                                                src={preview}
                                                width="120"
                                                height="120"
                                                style={{
                                                    objectFit: "cover",
                                                    borderRadius: "8px",
                                                    border: "1px solid #ddd",
                                                }}
                                                alt="Preview"
                                            />
                                            <button
                                                type="button"
                                                onClick={removePreview}
                                                style={{
                                                    position: "absolute",
                                                    top: "-8px",
                                                    right: "-8px",
                                                    background: "red",
                                                    color: "#fff",
                                                    border: "none",
                                                    width: "22px",
                                                    height: "22px",
                                                    borderRadius: "50%",
                                                    cursor: "pointer",
                                                    fontSize: "14px",
                                                }}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button
                                    className="btn btn-warning"
                                    onClick={() => {
                                        setShowModal(false);
                                        resetForm();
                                    }}
                                >
                                    Close
                                </button>
                                <button className="btn btn-success" onClick={submitContact}>
                                    {isEditing ? "Save Changes" : "Add Contact"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer position="top-right" autoClose={3000} />
        </Layout>
    );
};

export default ContactUs;