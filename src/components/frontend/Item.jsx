import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../../src/assets/css/product.scss';
import Toast from "react-bootstrap/Toast";
import { CartContext } from "./CartContext";

const Item = () => {
    const [team, setTeam] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const navigate = useNavigate();

    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/products")
            .then(res => res.json())
            .then(data => setTeam(data))
            .catch(err => console.log("Error Loading JSON", err));
    }, []);

    const handleAddToCart = (product) => {
        addToCart(product);
        setToastMessage("Your order has been created successfully"); // changed message
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000); // auto hide after 3s
    };
    return (
        <section className="section-8 py-5">
            <div className="container mt-5">
                <div className='section-header text-center'>
                    <span className="mt-10">Cream</span>
                    <h2>New available</h2>
                    <p>We offer a diverse array of construction services...</p>
                </div>

                <div className='row pt-3'>
                    {team.map((item) => (
                        <div className='col-md-6 col-lg-3 mb-4' key={item.id}>
                            <div className='card h-100 shadow border-0 p-2 d-flex flex-column'>

                                <img
                                    src={item.image_url || '/placeholder.png'}
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
                                    <h5
                                        className='card-title mb-1'
                                        style={{ minHeight: "48px", overflow: "hidden" }}
                                    >
                                        {item.productName}
                                    </h5>

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
                </div>
            </div>

            {/* Toast Notification */}
            <div
                style={{
                    position: "fixed",
                    bottom: "20px",
                    right: "20px",
                    zIndex: 9999,
                }}
            >
                <Toast show={showToast} bg="success" onClose={() => setShowToast(false)} delay={3000} autohide>
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
