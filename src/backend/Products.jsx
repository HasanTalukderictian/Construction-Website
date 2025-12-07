import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import DashNav from "./DasNav";
import Footer from "./Footer";
import axios from "axios";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);

    // Form States
    const [productName, setProductName] = useState("");
    const [price, setPrice] = useState("");
    const [rating, setRating] = useState("");
    const [quantity, setQuantity] = useState("");
    const [description, setDescription] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);

    // Load Product List
    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/products")
            .then((res) => res.json())
            .then((data) => setProducts(data))
            .catch((err) => console.log("Error:", err));
    }, []);

    // Handle Image Change and Preview
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImageFile(file);
        setPreview(URL.createObjectURL(file));
    };

    // Remove preview
    const removePreview = () => {
        setImageFile(null);
        setPreview(null);
    };

    // Submit Product to Laravel API
    const submitProduct = async () => {
        if (!productName || !price || !quantity) {
            alert("Please fill required fields!");
            return;
        }

        const formData = new FormData();
        formData.append("name", productName);
        formData.append("price", price);
        formData.append("rating", rating || "");
        formData.append("quantity", quantity);
        formData.append("description", description || "");
        if (imageFile) formData.append("image", imageFile);

        try {
            const res = await axios.post(
                "http://127.0.0.1:8000/api/products-add",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            console.log("Product saved:", res.data);
            alert("Product saved successfully!");

            // Reset form
            setProductName("");
            setPrice("");
            setRating("");
            setQuantity("");
            setDescription("");
            removePreview();
            setShowModal(false);

        } catch (err) {
            console.error("Network error:", err.response?.data || err);
            alert("Network error or validation failed!");
        }
    };

    return (
        <Layout>
            <div className="d-flex">
                <div className="flex-grow-1">
                    <DashNav />

                    <div className="container mt-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h2>Product List</h2>
                            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                                Upload Product
                            </button>
                        </div>

                        <table className="table table-bordered table-striped" style={{ tableLayout: "fixed", width: "100%" }}>
                            <thead className="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Rating</th>
                                    <th>Quantity</th>
                                </tr>
                            </thead>

                            <tbody>
                                {products.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center">Loading...</td>
                                    </tr>
                                ) : (
                                    products.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.id}</td>
                                            <td>
                                                {item.image_url ? (
                                                    <img
                                                        src={item.image_url}
                                                        width="60"
                                                        height="60"
                                                        style={{ objectFit: "cover", borderRadius: "5px" }}
                                                        alt={item.name}
                                                    />
                                                ) : (
                                                    "No Image"
                                                )}
                                            </td>
                                            <td>{item.name}</td>
                                            <td>{item.price}৳</td>
                                            <td>{item.rating}</td>
                                            <td>{item.quantity}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>

                        </table>
                    </div>

                    <Footer />
                </div>
            </div>

            {/* Upload Product Modal */}
            {showModal && (
                <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Upload New Product</h5>
                                <button className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>

                            <div className="modal-body">
                                {/* 2 Inputs per row */}
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Product Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={productName}
                                            onChange={(e) => setProductName(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Price</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Rating</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={rating}
                                            onChange={(e) => setRating(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Quantity</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={quantity}
                                            onChange={(e) => setQuantity(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Description Full Width */}
                                <div className="mb-3">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        className="form-control"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    ></textarea>
                                </div>

                                {/* Image Upload */}
                                <div className="mb-3">
                                    <label className="form-label">Product Image</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        onChange={handleImageChange}
                                    />
                                </div>

                                {/* Preview with X Close */}
                                {preview && (
                                    <div className="position-relative d-inline-block">
                                        <img
                                            src={preview}
                                            width="140"
                                            height="140"
                                            style={{
                                                objectFit: "cover",
                                                borderRadius: "10px",
                                                border: "1px solid #ccc"
                                            }}
                                        />
                                        <button
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
                                                lineHeight: "20px",
                                                textAlign: "center",
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Close
                                </button>
                                <button className="btn btn-success" onClick={submitProduct}>
                                    Save Product
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default Products;
