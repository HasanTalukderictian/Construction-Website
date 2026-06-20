import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "react-bootstrap/Toast";
import '../../assets/css/Percel.scss'

export const API_BASE = import.meta.env.VITE_API_BASE_URL;

const Percel = () => {
    const [products, setProducts] = useState([]);
    const [pages, setPages] = useState({});
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${API_BASE}/get-products`);
            const data = await response.json();
            
            // ✅ Handle different API response structures
            let productsArray = [];
            if (data.success && data.data) {
                productsArray = data.data;
            } else if (Array.isArray(data)) {
                productsArray = data;
            } else if (data.products && Array.isArray(data.products)) {
                productsArray = data.products;
            } else {
                console.error("Unexpected API response structure:", data);
                productsArray = [];
            }
            
            setProducts(productsArray);
        } catch (err) {
            console.error("Error fetching products:", err);
            setToastMessage("Failed to load products");
            setShowToast(true);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Safe category extraction with null checks
    const categories = [...new Set(
        products
            .filter(p => p && p.parent_category)
            .map(p => p.parent_category)
    )];

    // ✅ Product Card with safe property access
    const ProductCard = ({ item }) => (
        <div
            className="product-card"
            onClick={() => navigate(`/product/${item.id}`)}
        >
            {/* Image with safe access */}
            <div className="image-holder">
                <img 
                    src={item.images?.[0] || "/placeholder.png"} 
                    alt={item.name || "Product"} 
                />
            </div>

            <div className="card-body">
                {/* Category */}
                <p className="category">{item.parent_category || "Uncategorized"}</p>

                {/* Product Name */}
                <h4 className="product-title">{item.name || "Product Name"}</h4>

                {/* Price + Rating */}
                <div className="price-rating">
                    <span className="price">৳{item.price || "0"}</span>
                    <span className="rating-badge">
                        ⭐ {item.rating || "0"}
                    </span>
                </div>

                {/* Button */}
                <button
                    className="view-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/${item.id}`);
                    }}
                >
                    View Details
                </button>
            </div>
        </div>
    );

    // Loading state
    if (loading) {
        return (
            <section className="section-products">
                <div className="container text-center py-5">
                    <div className="spinner-border text-success" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </section>
        );
    }

    // No products state
    if (products.length === 0) {
        return (
            <section className="section-products">
                <div className="container text-center py-5">
                    <h4>No products found</h4>
                </div>
            </section>
        );
    }

    return (
        <section className="section-products">
            <div className="container">
                {categories.map((cat) => {
                    // Filter products for this category
                    const categoryProducts = products.filter(
                        p => p && p.parent_category === cat
                    );

                    if (categoryProducts.length === 0) return null;

                    const firstFour = categoryProducts.slice(0, 5);
                    const rest = categoryProducts.slice(4);

                    const itemsPerPage = 10;
                    const currentPage = pages[cat] || 1;

                    const start = (currentPage - 1) * itemsPerPage;
                    const paginated = rest.slice(start, start + itemsPerPage);

                    const totalPages = Math.ceil(rest.length / itemsPerPage);

                    return (
                        <div key={cat} className="category-block">
                            {/* Header */}
                            <div className="header-row d-flex justify-content-between align-items-center mb-2">
                                <h3 className="m-0">{cat}</h3>
                                <button
                                    className="btn btn-sm btn-outline-success"
                                    onClick={() =>
                                        navigate(`/category/${encodeURIComponent(cat)}`)
                                    }
                                >
                                    View All
                                </button>
                            </div>

                            {/* FIRST 5 */}
                            <div className="grid">
                                {firstFour.map(item => (
                                    <ProductCard key={item.id} item={item} />
                                ))}
                            </div>

                            {/* REST PRODUCTS WITH PAGINATION */}
                            {rest.length > 0 && (
                                <>
                                    <div className="grid mt-3">
                                        {paginated.map(item => (
                                            <ProductCard key={item.id} item={item} />
                                        ))}
                                    </div>

                                    {/* PAGINATION */}
                                    {totalPages > 1 && (
                                        <div className="pagination-wrap">
                                            <button
                                                onClick={() => setPages(prev => ({
                                                    ...prev,
                                                    [cat]: Math.max(1, currentPage - 1)
                                                }))}
                                                disabled={currentPage === 1}
                                                className="pagination-nav"
                                            >
                                                &laquo; Prev
                                            </button>
                                            
                                            {Array.from({ length: totalPages }, (_, i) => (
                                                <button
                                                    key={i}
                                                    className={currentPage === i + 1 ? "active" : ""}
                                                    onClick={() =>
                                                        setPages(prev => ({
                                                            ...prev,
                                                            [cat]: i + 1
                                                        }))
                                                    }
                                                >
                                                    {i + 1}
                                                </button>
                                            ))}
                                            
                                            <button
                                                onClick={() => setPages(prev => ({
                                                    ...prev,
                                                    [cat]: Math.min(totalPages, currentPage + 1)
                                                }))}
                                                disabled={currentPage === totalPages}
                                                className="pagination-nav"
                                            >
                                                Next &raquo;
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* TOAST */}
            <div className="toast-wrap" style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1050 }}>
                <Toast
                    show={showToast}
                    onClose={() => setShowToast(false)}
                    delay={3000}
                    autohide
                >
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
            </div>
        </section>
    );
};

export default Percel;