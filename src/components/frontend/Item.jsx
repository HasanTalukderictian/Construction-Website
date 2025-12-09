import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../../src/assets/css/product.scss';
import Toast from "react-bootstrap/Toast";
import { CartContext } from "./CartContext";

const Item = () => {
    const [team, setTeam] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // Search term
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [visibleCount, setVisibleCount] = useState(16);
    const [showAll, setShowAll] = useState(false);

    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate();

    // Fetch products from API
    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/products")
            .then(res => res.json())
            .then(data => {
                console.log("Products:", data); // check API response
                setTeam(data);
            })
            .catch(err => console.log("Error Loading JSON", err));
    }, []);

    // Add product to cart
    const handleAddToCart = (product) => {
        const productWithImage = {
            ...product,
            image: product.image_urls?.length > 0 ? product.image_urls[0] : '/placeholder.png'
        };
        addToCart(productWithImage);
        setToastMessage("Your order has been added to cart successfully");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    // Filter products based on search term
    const filteredProducts = team.filter(item => {
        const term = searchTerm.toLowerCase();
        return (
            item.name?.toLowerCase().includes(term) ||
            item.id?.toString().includes(term) ||
            item.price?.toString().includes(term)
        );
    });

    const visibleProducts = showAll ? filteredProducts : filteredProducts.slice(0, visibleCount);

    return (
        <section className="section-8 py-5">
            <div className="container mt-5">

                {/* Header + Search */}
                <div className='row align-items-center justify-content-between mb-3'>
                    <div className='col-md-6'>
                        <div className='section-header text-start'>
                            <h2>New available</h2>
                            <p>We offer a diverse array of construction services...</p>
                        </div>
                    </div>
                    <div className='col-md-4 text-end'>
                        <div className="position-relative" style={{ width: "100%" }}>
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="form-control"
                                style={{
                                    padding: "10px 40px 10px 10px",
                                    borderRadius: "8px",
                                }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <span
                                style={{
                                    position: "absolute",
                                    right: "10px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    fontSize: "20px",
                                    color: "#23e80dff",
                                    cursor: "pointer",
                                }}
                            >
                                🔍
                            </span>
                        </div>
                    </div>
                </div>

                {/* Products */}
                <div className='row pt-3'>
                    {visibleProducts.map((item) => (
                        <div className='col-md-6 col-lg-3 mb-4' key={item.id}>
                            <div className='card h-100 shadow border-0 p-2 d-flex flex-column'>
                                <img
                                    src={item.image_urls?.length > 0 ? item.image_urls[0] : '/placeholder.png'}
                                    alt={item.name}
                                    style={{
                                        width: "100%",
                                        height: "220px",
                                        objectFit: "cover",
                                        borderRadius: "6px",
                                        padding: "4px",
                                        marginTop: "4px"
                                    }}
                                />
                                <div className='card-body text-start d-flex flex-column'>
                                    <h5 className='mb-1'><strong>Product Name:</strong> {item.name}</h5>
                                    <p className="mb-1"><strong>Price:</strong> {item.price}৳</p>
                                    <p className="mb-1"><strong>Rating:</strong> ⭐ {item.rating}</p>
                                    <p className="mb-2"><strong>Quantity:</strong> {item.quantity}</p>
                                </div>

                                <div className="text-center mt-auto mb-2">
                                    <button
                                        onClick={() => handleAddToCart(item)}
                                        className="btn highlight-btn w-50"
                                        style={{ backgroundColor: "#e4032e", color: "#fff", fontWeight: "bold" }}
                                    >
                                        Add to Cart
                                    </button>
                                    <button
                                        className="btn highlight-btn w-80 ms-2"
                                        style={{ backgroundColor: "#11cc1aff" }}
                                        onClick={() => navigate(`/product/${item.id}`)}
                                    >
                                        View
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* More Button */}
                    {!showAll && filteredProducts.length > visibleCount && (
                        <div className="text-center mt-4">
                            <button
                                className="btn btn-primary px-4 py-2"
                                onClick={() => setShowAll(true)}
                            >
                                More
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Toast Notification */}
            <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 9999 }}>
                <Toast
                    show={showToast}
                    bg="success"
                    onClose={() => setShowToast(false)}
                    delay={3000}
                    autohide
                >
                    <Toast.Header>
                        <strong className="me-auto">Cart</strong>
                    </Toast.Header>
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
            </div>
        </section>
    );
};

export default Item;
