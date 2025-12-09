import { useParams, Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { CartContext } from "./CartContext";
import Toast from "react-bootstrap/Toast";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import '../../assets/css/product.scss';
import axios from "axios";

const Productdetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const { addToCart } = useContext(CartContext);
    const [showToast, setShowToast] = useState(false);

    // ===== Edit Modal States =====
    const [showEditModal, setShowEditModal] = useState(false);
    const [editName, setEditName] = useState("");
    const [editPrice, setEditPrice] = useState("");
    const [editRating, setEditRating] = useState("");
    const [editQuantity, setEditQuantity] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editImages, setEditImages] = useState([]);
    const [editPreviews, setEditPreviews] = useState([]);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/products")
            .then((res) => res.json())
            .then((data) => {
                const selectedProduct = data.find((item) => item.id === parseInt(id));
                setProduct(selectedProduct);

                // Prefill edit modal data
                if (selectedProduct) {
                    setEditName(selectedProduct.name);
                    setEditPrice(selectedProduct.price);
                    setEditRating(selectedProduct.rating);
                    setEditQuantity(selectedProduct.quantity);
                    setEditDescription(selectedProduct.description);
                    setEditPreviews(selectedProduct.image_urls || []);
                }

                const related = data.filter(
                    (item) => item.id !== parseInt(id) && item.category === selectedProduct?.category
                );
                setRelatedProducts(related);
            })
            .catch((err) => console.log("Error Loading JSON", err));
    }, [id]);

    if (!product) return <p>Loading...</p>;

    // ===== Cart Function =====
    const handleAddToCart = () => {
        const productWithImage = {
            ...product,
            image: product.image_urls?.length > 0 ? product.image_urls[0] : '/placeholder.png'
        };
        addToCart(productWithImage);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    // ===== Handle image change for edit =====
    const handleEditImagesChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        setEditImages(files);
        const previewUrls = files.map((file) => URL.createObjectURL(file));
        setEditPreviews(previewUrls);
    };

    const removeEditPreview = (index) => {
        const newFiles = [...editImages];
        const newPreviews = [...editPreviews];
        newFiles.splice(index, 1);
        newPreviews.splice(index, 1);
        setEditImages(newFiles);
        setEditPreviews(newPreviews);
    };

    // ===== Submit Edit =====
    const submitEdit = async () => {
        if (!editName || !editPrice || !editQuantity) {
            alert("Please fill required fields!");
            return;
        }

        const formData = new FormData();
        formData.append("name", editName);
        formData.append("price", editPrice);
        formData.append("rating", editRating || "");
        formData.append("quantity", editQuantity);
        formData.append("description", editDescription || "");

        editImages.forEach((file) => formData.append("images[]", file));

        try {
            await axios.post(`http://127.0.0.1:8000/api/products-edit/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            alert("Product updated successfully!");
            setShowEditModal(false);
            window.location.reload(); // simple refresh to reload updated product
        } catch (err) {
            console.error("Update error:", err.response?.data || err);
            alert("Failed to update product!");
        }
    };

    return (
        <>
            <Header />

            <div className="container mt-5 position-relative">

                {/* Toast Notification */}
                <div style={{ position: "fixed", top: "20px", right: "20px", zIndex: 9999 }}>
                    <Toast show={showToast} bg="success" onClose={() => setShowToast(false)}>
                        <Toast.Header>
                            <strong className="me-auto">Cart</strong>
                        </Toast.Header>
                        <Toast.Body className="text-white">
                            Your order has been successfully added to the cart!
                        </Toast.Body>
                    </Toast>
                </div>

                {/* Product Details */}
                <div className="product-details d-flex flex-wrap" style={{ gap: "40px", alignItems: "flex-start" }}>

                    {/* Image Section */}
                    <div className="product-image" style={{ flex: 1, minWidth: "300px", maxWidth: "50%" }}>
                        <Carousel
                            showThumbs={true}
                            infiniteLoop={true}
                            autoPlay={true}
                            interval={3000}
                            showStatus={false}
                            dynamicHeight={false}
                            thumbWidth={80}
                        >
                            {product.image_urls?.length > 0 ? product.image_urls.map((img, index) => (
                                <div key={index}>
                                    <img src={img} alt={product.name + index} />
                                </div>
                            )) : (
                                <div>
                                    <img src="/placeholder.png" alt="placeholder" />
                                </div>
                            )}
                        </Carousel>
                    </div>

                    {/* Details Section */}
                    <div className="product-info" style={{ flex: 1, minWidth: "300px", maxWidth: "50%" }}>
                        <h2>{product.name}</h2>
                        <p><strong>Price:</strong> {product.price}৳</p>
                        <p><strong>Rating:</strong> ⭐ {product.rating}</p>
                        <p><strong>Quantity:</strong> {product.quantity}</p>
                        <p>{product.description}</p>

                        <div className="mt-4 d-flex gap-2">
                            <button
                                onClick={handleAddToCart}
                                className="btn highlight-btn flex-fill"
                                style={{ backgroundColor: "#e4032e", color: "#fff", fontWeight: "bold" }}
                            >
                                Add to Cart
                            </button>
                            <button
                                onClick={() => setShowEditModal(true)}
                                className="btn btn-warning flex-fill"
                            >
                                Edit Product
                            </button>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="related-products mt-5">
                        <h3>Related Products</h3>
                        <div className="d-flex flex-wrap" style={{ gap: "20px" }}>
                            {relatedProducts.map((item) => (
                                <div key={item.id} className="card" style={{ width: "200px", borderRadius: "8px" }}>
                                    <img
                                        src={item.image_urls?.length > 0 ? item.image_urls[0] : '/placeholder.png'}
                                        className="card-img-top"
                                        alt={item.name}
                                        style={{ height: "150px", objectFit: "cover" }}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title" style={{ fontSize: "16px" }}>{item.name}</h5>
                                        <p className="mb-1"><strong>Price:</strong> {item.price}৳</p>
                                        <Link to={`/product/${item.id}`} className="btn btn-success btn-sm">View</Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>

            <Footer />

            {/* ===== Edit Product Modal ===== */}
            {showEditModal && (
                <div
                    className="custom-modal-backdrop"
                    onClick={() => setShowEditModal(false)} // click outside to close
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "rgba(0,0,0,0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1050,
                    }}
                >
                    <div
                        className="modal-dialog modal-lg"
                        onClick={(e) => e.stopPropagation()} // modal vitore click hole close hobe na
                        style={{ maxWidth: "800px" }}
                    >
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Product</h5>
                                <button className="btn-close" onClick={() => setShowEditModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Product Name *</label>
                                        <input type="text" className="form-control" value={editName} onChange={(e) => setEditName(e.target.value)} />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Price *</label>
                                        <input type="number" className="form-control" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Rating</label>
                                        <input type="number" className="form-control" value={editRating} onChange={(e) => setEditRating(e.target.value)} />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Quantity *</label>
                                        <input type="number" className="form-control" value={editQuantity} onChange={(e) => setEditQuantity(e.target.value)} />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Description</label>
                                    <textarea className="form-control" value={editDescription} onChange={(e) => setEditDescription(e.target.value)}></textarea>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Images</label>
                                    <input type="file" multiple className="form-control" onChange={handleEditImagesChange} />
                                </div>

                                {editPreviews.length > 0 && (
                                    <div className="d-flex flex-wrap gap-2">
                                        {editPreviews.map((url, idx) => (
                                            <div key={idx} style={{ position: "relative" }}>
                                                <img src={url} alt={`preview-${idx}`} width="80" height="80" style={{ objectFit: "cover", borderRadius: "5px" }} />
                                                <button type="button" className="btn btn-sm btn-danger" style={{ position: "absolute", top: 0, right: 0 }} onClick={() => removeEditPreview(idx)}>×</button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                            </div>
                            <div className="modal-footer d-flex gap-2">
                                <button className="btn btn-warning flex-fill" onClick={() => setShowEditModal(false)}>Close</button>
                                <button className="btn btn-success flex-fill" onClick={submitEdit}>Update Product</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


        </>
    );
};

export default Productdetails;
