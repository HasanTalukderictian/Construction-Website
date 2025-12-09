import { useParams, Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { CartContext } from "./CartContext";
import Toast from "react-bootstrap/Toast";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import '../../assets/css/product.scss';

const Productdetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const { addToCart } = useContext(CartContext);
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/products")
            .then((res) => res.json())
            .then((data) => {
                const selectedProduct = data.find((item) => item.id === parseInt(id));
                setProduct(selectedProduct);

                const related = data.filter(
                    (item) => item.id !== parseInt(id) && item.category === selectedProduct?.category
                );
                setRelatedProducts(related);
            })
            .catch((err) => console.log("Error Loading JSON", err));
    }, [id]);

    if (!product) return <p>Loading...</p>;

    const handleAddToCart = () => {
        const productWithImage = {
            ...product,
            image: product.image_urls?.length > 0 ? product.image_urls[0] : '/placeholder.png'
        };
        addToCart(productWithImage);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
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

                        <div className="mt-4 text-center">
                            <button
                                onClick={handleAddToCart}
                                className="btn highlight-btn w-50"
                                style={{ backgroundColor: "#e4032e", color: "#fff", fontWeight: "bold" }}
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
                                        <Link to={`/product/${item.id}`} className="btn btn-primary btn-sm">View</Link>
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
