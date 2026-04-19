import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "react-bootstrap/Toast";
import { CartContext } from "./CartContext";

export const API_BASE = import.meta.env.VITE_API_BASE_URL;

const Percel = () => {
    const [products, setProducts] = useState([]);
    const [pages, setPages] = useState({}); // 👈 per category page
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        fetch(`${API_BASE}/get-products`)
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error(err));
    }, []);

    const handleAddToCart = (item) => {
        if (!item.quantity || item.quantity <= 0) {
            setToastMessage("Out of stock!");
            setShowToast(true);
            return;
        }

        addToCart({
            id: item.id,
            product_name: item.name,
            image_url: item.images?.[0],
            price: item.price
        });

        setToastMessage("Added to cart!");
        setShowToast(true);
    };

    const categories = [...new Set(products.map(p => p.parent_category))];

    const ProductCard = ({ item }) => (
        <div className="product-card" onClick={() => navigate(`/product/${item.id}`)}>
            <div className="image-holder">
                <img src={item.images?.[0] || "/placeholder.png"} alt="" />
            </div>
            <div className="card-body">
                <h6>{item.name}</h6>
                <p>৳{item.price}</p>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(item);
                    }}
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );

    return (
        <section className="section-products">
            <div className="container">

                {categories.map((cat) => {

                    const categoryProducts = products.filter(p => p.parent_category === cat);

                    const firstFour = categoryProducts.slice(0, 4);
                    const rest = categoryProducts.slice(4);

                    const itemsPerPage = 8;
                    const currentPage = pages[cat] || 1;

                    const start = (currentPage - 1) * itemsPerPage;
                    const paginated = rest.slice(start, start + itemsPerPage);

                    const totalPages = Math.ceil(rest.length / itemsPerPage);

                    return (
                        <div key={cat} className="category-block">

                            <div className="header-row">
                                <h3>{cat}</h3>
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
                <Toast show={showToast} onClose={() => setShowToast(false)} delay={2000} autohide>
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
            </div>
        </section>
    );
};

export default Percel;