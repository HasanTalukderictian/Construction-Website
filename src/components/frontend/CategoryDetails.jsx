import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../common/Header';
import Footer from '../common/Footer';
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const CategoryDetails = () => {
    const { name } = useParams(); // URL theke category name nibe
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        axios.get(`${API_BASE}/products/${name}`)
            .then(res => {
                if (res.data.success) {
                    setProducts(res.data.data);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [name]); // Name change holei call hobe

    return (
        <>
            <Header />
            <div className="container my-5">
                <h3 className="mb-4">Products for: <span className="text-success">{name}</span></h3>

                {loading ? (
                    <div className="text-center p-5">Loading Products...</div>
                ) : (
                    <div className="row g-4">
                        {products.length > 0 ? products.map((product) => (
                            <div className="col-md-3" key={product.id}>
                                <div className="card h-100 shadow-sm border-0 product-card">
                                    <img
                                        src={product.image_url}
                                        className="card-img-top p-3"
                                        alt={product.name}
                                        style={{ height: '200px', objectFit: 'contain' }}
                                    />
                                    <div className="card-body">
                                        <p className="text-muted small mb-1">{product.sub_category}</p>
                                        <h6 className="card-title fw-bold">{product.name}</h6>
                                        <div className="d-flex justify-content-between align-items-center mt-3">
                                            <span className="text-primary fw-bold">৳{product.price}</span>
                                            <span className="badge bg-warning text-dark">⭐ {product.rating}</span>
                                        </div>
                                        <button
                                            className="btn btn-sm btn-outline-success w-100 mt-3"
                                            onClick={() => navigate(`/product/${product.id}`)}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="col-12 text-center py-5">
                                <h5>No products found in this category.</h5>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default CategoryDetails;