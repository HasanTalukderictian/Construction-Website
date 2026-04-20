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

    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${API_BASE}/get-products`)
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error(err));
    }, []);

    const categories = [...new Set(products.map(p => p.parent_category))];

    // ✅ Product Card

const ProductCard = ({ item }) => (
    <div
        className="product-card"
        onClick={() => navigate(`/product/${item.id}`)}
    >
        {/* Image */}
        <div className="image-holder">
            <img src={item.images?.[0] || "/placeholder.png"} alt="" />
        </div>

        <div className="card-body">

            {/* Category (small text) */}
            <p className="category">{item.parent_category}</p>

            {/* Product Name */}
            <h4 className="product-title">{item.name}</h4>

            {/* Price + Rating same line */}
            <div className="price-rating">
                <span className="price">৳{item.price}</span>

                <span className="rating-badge">
                    ⭐ {item.rating}
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


    return (
        <section className="section-products">
            <div className="container">

                {categories.map((cat) => {

                    const categoryProducts = products.filter(
                        p => p.parent_category === cat
                    );

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

                            {/* FIRST 4 */}
                            <div className="grid">
                                {firstFour.map(item => (
                                    <ProductCard key={item.id} item={item} />
                                ))}
                            </div>

                            {/* PAGINATED PRODUCTS */}
                            {rest.length > 0 && (
                                <>
                                    <div className="grid mt-3">
                                        {paginated.map(item => (
                                            <ProductCard key={item.id} item={item} />
                                        ))}
                                    </div>

                                    {/* PAGINATION */}
                                    <div className="pagination-wrap">
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
                                    </div>
                                </>
                            )}

                        </div>
                    );
                })}
            </div>

            {/* TOAST */}
            <div className="toast-wrap">
                <Toast
                    show={showToast}
                    onClose={() => setShowToast(false)}
                    delay={2000}
                    autohide
                >
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
            </div>
        </section>
    );
};

export default Percel;