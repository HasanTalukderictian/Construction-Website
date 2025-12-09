import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import DashNav from "./DasNav";
import Footer from "./Footer";
import axios from "axios";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Form States
    const [productName, setProductName] = useState("");
    const [price, setPrice] = useState("");
    const [rating, setRating] = useState("");
    const [quantity, setQuantity] = useState("");
    const [description, setDescription] = useState("");
    const [imageFiles, setImageFiles] = useState([]); // multiple files
    const [previews, setPreviews] = useState([]);     // previews

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Load Product List
    const loadProducts = () => {
        fetch("http://127.0.0.1:8000/api/products")
            .then((res) => res.json())
            .then((data) => {
                setProducts(data);
                setLoading(false);
            })
            .catch((err) => {
                console.log("Error:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        loadProducts();
    }, []);

    // Handle multiple image change & preview
    const handleImagesChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        setImageFiles(files);

        const previewUrls = files.map((file) => URL.createObjectURL(file));
        setPreviews(previewUrls);
    };

    const removePreview = (index) => {
        const newFiles = [...imageFiles];
        const newPreviews = [...previews];
        newFiles.splice(index, 1);
        newPreviews.splice(index, 1);
        setImageFiles(newFiles);
        setPreviews(newPreviews);
    };

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(products.length / itemsPerPage);

    const goToPage = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

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

        imageFiles.forEach((file) => {
            formData.append("images[]", file); // multiple images
        });

        try {
            await axios.post(
                "http://127.0.0.1:8000/api/products-add",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            alert("Product saved successfully!");

            // Reset form
            setProductName("");
            setPrice("");
            setRating("");
            setQuantity("");
            setDescription("");
            setImageFiles([]);
            setPreviews([]);
            setShowModal(false);
            loadProducts();
            setCurrentPage(1);

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
                                    <th>SL</th>
                                    <th>ID</th>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Rating</th>
                                    <th>Quantity</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="8" className="text-center">Loading...</td>
                                    </tr>
                                ) : products.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="text-center">No Products Available</td>
                                    </tr>
                                ) : (
                                    currentProducts.map((item, index) => (
                                        <tr key={item.id}>
                                            <td>{indexOfFirstItem + index + 1}</td>
                                            <td>{item.id}</td>
                                            <td>
                                                {item.image_urls && item.image_urls.length > 0 ? (
                                                    <img
                                                        src={item.image_urls[0]} // first image only
                                                        width="60"
                                                        height="60"
                                                        style={{ objectFit: "cover", borderRadius: "5px" }}
                                                        alt={item.name}
                                                    />
                                                ) : "No Image"}
                                            </td>
                                            <td>{item.name}</td>
                                            <td>{item.price}৳</td>
                                            <td>{item.rating}</td>
                                            <td>{item.quantity}</td>
                                            <td>
                                                <div style={{ display: "flex", gap: "8px" }}>
                                                    <button className="btn btn-primary" style={{ width: "40px", height: "40px", padding: 0 }}>✎</button>
                                                    <button className="btn btn-danger" style={{ width: "40px", height: "40px", padding: 0 }}>🗑</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        <nav>
                            <ul className="pagination justify-content-center">
                                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                    <button className="page-link" onClick={prevPage}><BsChevronLeft /> Prev</button>
                                </li>
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                                        <button className="page-link" onClick={() => goToPage(i + 1)}>{i + 1}</button>
                                    </li>
                                ))}
                                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                    <button className="page-link" onClick={nextPage}>Next <BsChevronRight /></button>
                                </li>
                            </ul>
                        </nav>
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
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Product Name</label>
                                        <input type="text" className="form-control" value={productName} onChange={(e) => setProductName(e.target.value)} />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Price</label>
                                        <input type="number" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Rating</label>
                                        <input type="number" className="form-control" value={rating} onChange={(e) => setRating(e.target.value)} />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Quantity</label>
                                        <input type="number" className="form-control" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Description</label>
                                    <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Product Images</label>
                                    <input type="file" className="form-control" onChange={handleImagesChange} multiple />
                                </div>

                                {/* Preview */}
                                <div className="d-flex flex-wrap gap-2">
                                    {previews.map((url, index) => (
                                        <div key={index} className="position-relative">
                                            <img src={url} width="100" height="100" style={{ objectFit: "cover", borderRadius: "5px" }} />
                                            <button type="button" onClick={() => removePreview(index)} style={{
                                                position: "absolute", top: "-5px", right: "-5px", background: "red",
                                                color: "#fff", border: "none", borderRadius: "50%", width: "20px", height: "20px", cursor: "pointer"
                                            }}>×</button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button className="btn btn-warning" onClick={() => setShowModal(false)}>Close</button>
                                <button className="btn btn-success" onClick={submitProduct}>Save Product</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default Products;
