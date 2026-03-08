import { useParams, Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { CartContext } from "./CartContext";
import Toast from "react-bootstrap/Toast";
import "../../assets/css/product.scss";

export const API_BASE = import.meta.env.VITE_API_BASE_URL;

const Productdetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState(""); // New state for main image
    const [relatedProducts, setRelatedProducts] = useState([]);
    const { addToCart } = useContext(CartContext);
    const [showToast, setShowToast] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Fetch product and related products
    useEffect(() => {
        fetch(`${API_BASE}/get-products`)
            .then((res) => res.json())
            .then((data) => {
                const selectedProduct = data.find((item) => item.id === parseInt(id));
                setProduct(selectedProduct);

                // Set main image initially to first image
                if (selectedProduct && selectedProduct.images && selectedProduct.images.length > 0) {
                    setMainImage(selectedProduct.images[0]);
                }

                const related = data.filter(
                    (item) =>
                        item.id !== parseInt(id) &&
                        item.subcategory_id === selectedProduct?.subcategory_id
                );
                setRelatedProducts(related);
            })
            .catch((err) => console.log("Error Loading JSON", err));
    }, [id]);

    if (!product) return <p>Loading...</p>;

    const handleAddToCart = () => {
        const normalizedProduct = {
            id: product.id,
            product_name: product.name || "Unknown Product",
            image_url: mainImage || "",
            price: parseFloat(product.price) || 0,
            description: product.description || "",
        };
        addToCart(normalizedProduct);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    return (
        <>
            <Header />
            <div className="container mt-5 position-relative mb-5">
                {/* Toast Notification */}
                <div style={{ position: "fixed", top: "20px", right: "20px", zIndex: 9999 }}>
                    <Toast show={showToast} bg="success" onClose={() => setShowToast(false)}>
                        <Toast.Header>
                            <strong className="me-auto">Cart</strong>
                        </Toast.Header>
                        <Toast.Body className="text-white">
                            Your product has been added to the cart!
                        </Toast.Body>
                    </Toast>
                </div>

                {/* Product Details */}
                <div className="product-details d-flex flex-wrap" style={{ gap: "40px", alignItems: "flex-start" }}>

                    {/* Main Product Image */}
                    <div
                        className="product-image"
                        style={{
                            flex: 1,
                            minWidth: "300px",
                            maxWidth: windowWidth <= 768 ? "100%" : "50%",
                            position: "relative",
                            overflow: "hidden",
                            borderRadius: "8px",
                        }}
                    >
                        <img
                            src={mainImage || '/placeholder.png'}
                            alt={product.name}
                            style={{
                                width: "100%",
                                height: "100%", // fill the div height
                                objectFit: "cover", // maintains aspect ratio, crops if necessary
                            }}
                        />

                        {/* Thumbnails */}
                        {product.images && product.images.length > 1 && (
                            <div style={{ display: "flex", gap: "5px", marginTop: "10px", flexWrap: "wrap" }}>
                                {product.images.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt={`Thumbnail ${index + 1}`}
                                        style={{
                                            width: "60px",
                                            height: "60px",
                                            objectFit: "cover",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                            border: mainImage === img ? "2px solid #e4032e" : "1px solid #ccc",
                                            transition: "transform 0.2s ease",
                                        }}
                                        onClick={() => setMainImage(img)} // Click replaces main image
                                        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"} // small zoom on hover
                                        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                                    />
                                ))}
                            </div>
                        )}
                    </div>



                    {/* Product Info */}
                    <div className="product-info" style={{ flex: 1, minWidth: "300px", maxWidth: windowWidth <= 768 ? "100%" : "50%" }}>
                        <h2>{product.name}</h2>
                        <p><strong>Price:</strong> {product.price}৳</p>
                        <p><strong>Rating:</strong> ⭐ {product.rating}</p>
                        <p><strong>Quantity:</strong> {product.quantity}</p>
                        <div dangerouslySetInnerHTML={{ __html: product.description }} />

                        <div className="mt-4">
                            <button
                                onClick={handleAddToCart}
                                className="btn highlight-btn"
                                style={{ backgroundColor: "#1c8b41", color: "#fff", fontWeight: "bold" }}
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="related-products mt-5">
                        <h3>Related Products</h3>
                        <div className="d-flex flex-wrap mt-3" style={{ gap: "20px" }}>
                            {relatedProducts.map((item) => (
                                <div key={item.id} className="card" style={{ width: "200px", borderRadius: "8px" }}>
                                    <img
                                        src={item.images && item.images.length > 0 ? item.images[0] : '/placeholder.png'}
                                        className="product-img"
                                        alt={item.name}
                                        style={{ height: "150px", objectFit: "cover" }}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title" style={{ fontSize: "16px" }}>{item.name}</h5>
                                        <p className="mb-1"><strong>Price:</strong> {item.price}৳</p>
                                        <Link
                                            to={`/product/${item.id}`}
                                            className="btn btn-primary btn-sm"
                                            style={{ fontWeight: "400", padding: "0.25rem 0.5rem" }}
                                        >
                                            View
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default Productdetails;