import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";

const Productdetails = () => {
    const { id } = useParams(); // get product id from URL
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        fetch("../../../public/product.json")
            .then((res) => res.json())
            .then((data) => {
                const selectedProduct = data.find((item) => item.id === parseInt(id));
                setProduct(selectedProduct);

                // Filter related products (same category, excluding current)
                const related = data.filter(
                    (item) =>
                        item.id !== parseInt(id) &&
                        item.category === selectedProduct.category // optional
                );
                setRelatedProducts(related);
            })
            .catch((err) => console.log("Error Loading JSON", err));
    }, [id]);

    if (!product) return <p>Loading...</p>;

    return (
        <>
            <Header />
            <div className="container mt-5">
                <div className="product-details d-flex" style={{ gap: "40px", alignItems: "flex-start" }}>
                    {/* Image Section */}
                    <div
                        className="product-image"
                        style={{
                            flex: 1,
                            maxWidth: "50%",
                            position: "relative",
                            overflow: "hidden",
                            borderRadius: "8px",
                        }}
                    >
                        <img
                            src={product.imageUrl}
                            alt={product.productName}
                            style={{
                                width: "100%",
                                height: "600px",
                                objectFit: "cover",
                                transition: "transform 0.5s ease",
                            }}
                            className="zoom-image"
                        />

                        {/* Overlay Details */}
                        <div
                            className="overlay"
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                backgroundColor: "rgba(0,0,0,0.5)",
                                color: "#fff",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                opacity: 0,
                                transition: "opacity 0.3s ease",
                                textAlign: "center",
                                padding: "20px",
                            }}
                        >
                            <h4>{product.productName}</h4>
                            <p><strong>Price:</strong> {product.price}৳</p>
                            <p><strong>Rating:</strong> ⭐ {product.rating}</p>
                        </div>
                    </div>

                    {/* Details Section */}
                    <div
                        className="product-info"
                        style={{ flex: 1, maxWidth: "50%" }}
                    >
                        <h2>{product.productName}</h2>
                        <p><strong>Price:</strong> {product.price}৳</p>
                        <p><strong>Rating:</strong> ⭐ {product.rating}</p>
                        <p><strong>Quantity:</strong> {product.quantity}</p>
                        <p>{product.description}</p>

                        <div className="mt-4 text-center">
                    <button
                        className="btn highlight-btn w-50"
                        style={{ backgroundColor: "#e4032e", color: "#fff", fontWeight: "bold" }}
                    >
                        Add to Cart
                    </button>
                </div>
                    </div>
                    
                </div>

                {/* Add to Cart Button */}
                




                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="related-products mt-5">
                        <h3>Related Products</h3>
                        <div
                            className="d-flex flex-wrap"
                            style={{ gap: "20px" }}
                        >
                            {relatedProducts.map((item) => (
                                <div
                                    key={item.id}
                                    className="card"
                                    style={{ width: "200px", borderRadius: "8px" }}
                                >
                                    <img
                                        src={item.imageUrl}
                                        className="card-img-top"
                                        alt={item.productName}
                                        style={{ height: "150px", 
                                        objectFit: "cover" }}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title" style={{ fontSize: "16px" }}>
                                            {item.productName}
                                        </h5>
                                        <p className="mb-1"><strong>Price:</strong> {item.price}৳</p>
                                        <Link to={`/product/${item.id}`} className="btn btn-primary btn-sm">
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
