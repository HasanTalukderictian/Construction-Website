// // import { useParams, Link } from "react-router-dom";
// // import { useContext, useEffect, useState } from "react";
// // import Header from "../common/Header";
// // import Footer from "../common/Footer";
// // import { CartContext } from "./CartContext";
// // import Toast from "react-bootstrap/Toast";
// // import Modal from "react-bootstrap/Modal";
// // import { Form, ProgressBar } from "react-bootstrap";
// // import "../../assets/css/product.scss";

// // export const API_BASE = import.meta.env.VITE_API_BASE_URL;

// // const Productdetails = () => {
// //     const { id } = useParams();
// //     const [product, setProduct] = useState(null);
// //     const [mainImage, setMainImage] = useState("");
// //     const [relatedProducts, setRelatedProducts] = useState([]);
// //     const { addToCart } = useContext(CartContext);
// //     const [showToast, setShowToast] = useState(false);
// //     const [windowWidth, setWindowWidth] = useState(window.innerWidth);

// //     const [showRateModal, setShowRateModal] = useState(false);
// //     const [imagePreview, setImagePreview] = useState(null);
// //     const [reviewData, setReviewData] = useState({
// //         price: 0, value: 0, quality: 0, service: 0,
// //         title: "", feedback: "", image: null, customer_name: "",
// //     });

// //     // New state for View More functionality
// //     const [showAllReviews, setShowAllReviews] = useState(false);

// //     useEffect(() => {
// //         const handleResize = () => setWindowWidth(window.innerWidth);
// //         window.addEventListener("resize", handleResize);
// //         return () => window.removeEventListener("resize", handleResize);
// //     }, []);

// //     useEffect(() => {
// //         fetch(`${API_BASE}/get-products`)
// //             .then((res) => res.json())
// //             .then((data) => {
// //                 const selectedProduct = data.find((item) => item.id === parseInt(id));
// //                 setProduct(selectedProduct);
// //                 if (selectedProduct?.images?.length > 0) setMainImage(selectedProduct.images[0]);

// //                 const related = data.filter(
// //                     (item) => item.id !== parseInt(id) && item.subcategory_id === selectedProduct?.subcategory_id
// //                 );
// //                 setRelatedProducts(related);
// //             })
// //             .catch((err) => console.log("Error Loading JSON", err));
// //     }, [id]);

// //     if (!product) return <p>Loading...</p>;

// //     const handleAddToCart = () => {
// //         addToCart({
// //             id: product.id,
// //             product_name: product.name || "Unknown Product",
// //             image_url: mainImage || "",
// //             price: parseFloat(product.price) || 0,
// //             description: product.description || "",
// //         });
// //         setShowToast(true);
// //         setTimeout(() => setShowToast(false), 3000);
// //     };

// //     const handleImageChange = (e) => {
// //         const file = e.target.files[0];
// //         if (file) {
// //             setReviewData({ ...reviewData, image: file });
// //             setImagePreview(URL.createObjectURL(file));
// //         }
// //     };

// //     const renderStars = (rating, isInteractive = false, category = "") => {
// //         return [1, 2, 3, 4, 5].map((star) => (
// //             <span
// //                 key={star}
// //                 style={{
// //                     cursor: isInteractive ? "pointer" : "default",
// //                     fontSize: isInteractive ? "22px" : "16px",
// //                     color: star <= rating ? "#ffc107" : "#ccc",
// //                 }}
// //                 onClick={() => isInteractive && setReviewData({ ...reviewData, [category]: star })}
// //             >
// //                 ★
// //             </span>
// //         ));
// //     };

// //     const handleSubmitReview = async () => {
// //         const formData = new FormData();
// //         formData.append('product_id', id);
// //         formData.append('price_rating', reviewData.price);
// //         formData.append('value_rating', reviewData.value);
// //         formData.append('quality_rating', reviewData.quality);
// //         formData.append('service_rating', reviewData.service);
// //         formData.append('title', reviewData.title);
// //         formData.append('customer_name', reviewData.customer_name);
// //         formData.append('feedback', reviewData.feedback);
// //         if (reviewData.image) formData.append('image', reviewData.image);

// //         try {
// //             const response = await fetch(`${API_BASE}/store-rating`, { method: "POST", body: formData });
// //             const result = await response.json();
// //             if (response.ok) {
// //                 alert(result.message || "Review submitted successfully!");
// //                 setShowRateModal(false);
// //                 setReviewData({ price: 0, value: 0, quality: 0, service: 0, title: "", feedback: "", image: null });
// //                 setImagePreview(null);
// //             } else {
// //                 alert(result.message || "Something went wrong!");
// //             }
// //         } catch (error) {
// //             alert("Connection to server failed!");
// //         }
// //     };

// //     // Slice reviews based on state
// //     const reviewsToShow = showAllReviews 
// //         ? product.reviews 
// //         : product.reviews?.slice(0, 2);

// //     return (
// //         <>
// //             <Header />
// //             <div className="container mt-5 position-relative mb-5">
// //                 <div style={{ position: "fixed", top: "20px", right: "20px", zIndex: 9999 }}>
// //                     <Toast show={showToast} bg="success" onClose={() => setShowToast(false)}>
// //                         <Toast.Header><strong className="me-auto">Cart</strong></Toast.Header>
// //                         <Toast.Body className="text-white">Product added to cart!</Toast.Body>
// //                     </Toast>
// //                 </div>

// //                 <div className="product-details d-flex flex-wrap" style={{ gap: "40px", alignItems: "flex-start" }}>
// //                     <div className="product-image" style={{ flex: 1, minWidth: "300px", maxWidth: windowWidth <= 768 ? "100%" : "50%" }}>
// //                         <img src={mainImage || '/placeholder.png'} alt={product.name} style={{ width: "100%", borderRadius: "8px" }} />
// //                         <div style={{ display: "flex", gap: "5px", marginTop: "10px", flexWrap: "wrap" }}>
// //                             {product.images?.map((img, index) => (
// //                                 <img key={index} src={img} alt="thumb" style={{ width: "60px", height: "60px", objectFit: "cover", cursor: "pointer", border: mainImage === img ? "2px solid #e4032e" : "1px solid #ccc" }} onClick={() => setMainImage(img)} />
// //                             ))}
// //                         </div>
// //                     </div>

// //                     <div className="product-info" style={{ flex: 1, minWidth: "300px" }}>
// //                         <h2>{product.name}</h2>
// //                         <p><strong>Price:</strong> {product.price}৳</p>
// //                         <p><strong>Quantity:</strong> {product.quantity}</p>
// //                         <div dangerouslySetInnerHTML={{ __html: product.description }} />
// //                         <div className="mt-4">
// //                             <button onClick={handleAddToCart} className="btn" style={{ backgroundColor: "#1c8b41", color: "#fff", fontWeight: "bold" }}>Add to Cart</button>
// //                         </div>
// //                     </div>
// //                 </div>

// //                 {/* --- Ratings & Reviews Section --- */}
// //                 <div className="ratings-section mt-5 p-4 border-top">
// //                     <h4 className="mb-4">Ratings & Reviews</h4>
// //                     <div className="row">
// //                         <div className="col-md-4 border-end">
// //                             <div className="d-flex align-items-center gap-3">
// //                                 <h1 className="display-4 fw-bold mb-0">{product.avg_rating || "0.0"}/5</h1>
// //                                 <div>
// //                                     <div>{renderStars(Math.round(product.avg_rating || 0))}</div>
// //                                     <small className="text-muted">{product.reviews?.length || 0} Ratings</small>
// //                                 </div>
// //                             </div>

// //                             <div className="mt-4">
// //                                 {[5, 4, 3, 2, 1].map((num) => (
// //                                     <div key={num} className="d-flex align-items-center mb-1" style={{ fontSize: "12px" }}>
// //                                         <div style={{ width: "50px" }}>{renderStars(num)}</div>
// //                                         <ProgressBar now={num === 5 ? 80 : 10} variant="danger" style={{ height: "6px", flex: 1, margin: "0 10px" }} />
// //                                         <span style={{ width: "20px" }}>{num === 5 ? 28 : 2}</span>
// //                                     </div>
// //                                 ))}
// //                             </div>
// //                         </div>

// //                         <div className="col-md-8 ps-md-5">
// //                             <div className="d-flex justify-content-between align-items-center mb-3">
// //                                 <h5>Product Reviews</h5>
// //                                 <button onClick={() => setShowRateModal(true)} className="btn btn-sm text-white" style={{ backgroundColor: "#385486" }}>Rate Product</button>
// //                             </div>

// //                             {reviewsToShow && reviewsToShow.length > 0 ? (
// //                                 <>
// //                                     {reviewsToShow.map((rev) => (
// //                                         <div key={rev.id} className="review-item mb-4 pb-3 border-bottom">
// //                                             <div className="d-flex gap-3">
// //                                                 <div style={{ width: "45px", height: "45px", backgroundColor: "#eee", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
// //                                                     <i className="bi bi-person-fill text-secondary"></i>
// //                                                 </div>
// //                                                 <div className="flex-grow-1">
// //                                                     <div className="d-flex justify-content-between align-items-center">
// //                                                         <h6 className="mb-0 fw-bold">{rev.customer_name ? rev.customer_name : "Anonymous Customer"}</h6>
// //                                                         <small className="text-muted">({rev.price_rating || 0}.0) {renderStars(rev.price_rating || 0)}</small>
// //                                                     </div>
// //                                                     <small className="text-muted d-block mb-2">Posted on {rev.created_at ? new Date(rev.created_at).toLocaleDateString() : "N/A"}</small>
// //                                                     <p className="mb-1">{rev.title || "No Title"}</p>
// //                                                     <p className="small text-dark mb-2">{rev.feedback || "No feedback provided."}</p>
// //                                                     {rev.image && (
// //                                                         <div className="mt-2">
// //                                                             <img src={rev.image} alt="review" style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "6px", border: "1px solid #ddd" }} />
// //                                                         </div>
// //                                                     )}
// //                                                 </div>
// //                                             </div>
// //                                         </div>
// //                                     ))}
                                    
// //                                     {/* View More / View Less Button */}
// //                                     {product.reviews.length > 2 && (
// //                                         <div className="text-center mt-3">
// //                                             <button 
// //                                                 className="btn btn-outline-secondary btn-sm" 
// //                                                 onClick={() => setShowAllReviews(!showAllReviews)}
// //                                             >
// //                                                 {showAllReviews ? "View Less" : "View More"}
// //                                             </button>
// //                                         </div>
// //                                     )}
// //                                 </>
// //                             ) : (
// //                                 <p className="text-muted">No reviews yet. Be the first to rate!</p>
// //                             )}
// //                         </div>
// //                     </div>
// //                 </div>

// //                 {/* Related Products Section */}
// //                 {relatedProducts.length > 0 && (
// //                     <div className="related-products mt-5">
// //                         <h3>Related Products</h3>
// //                         <div className="d-flex flex-wrap mt-3" style={{ gap: "20px" }}>
// //                             {relatedProducts.map((item) => (
// //                                 <div key={item.id} className="card" style={{ width: "200px" }}>
// //                                     <img src={item.images?.[0] || '/placeholder.png'} className="card-img-top" style={{ height: "150px", objectFit: "cover" }} alt={item.name} />
// //                                     <div className="card-body">
// //                                         <h5 style={{ fontSize: "14px" }}>{item.name}</h5>
// //                                         <Link to={`/product/${item.id}`} className="btn btn-success btn-sm">View</Link>
// //                                     </div>
// //                                 </div>
// //                             ))}
// //                         </div>
// //                     </div>
// //                 )}
// //             </div>

// //             {/* --- Rate Product Modal --- */}
// //             <Modal show={showRateModal} onHide={() => setShowRateModal(false)} size="lg" centered>
// //                 <Modal.Header closeButton><Modal.Title>Rate This Product</Modal.Title></Modal.Header>
// //                 <Modal.Body>
// //                     <div className="row text-center mb-4">
// //                         {['price', 'value', 'quality', 'service'].map(cat => (
// //                             <div key={cat} className="col-6 col-md-3">
// //                                 <label className="d-block fw-bold small text-capitalize">{cat}</label>
// //                                 {renderStars(reviewData[cat], true, cat)}
// //                             </div>
// //                         ))}
// //                     </div>
// //                     <Form>
// //                         <Form.Group className="mb-3">
// //                             <Form.Label className="fw-bold">Your Name</Form.Label>
// //                             <Form.Control type="text" placeholder="Your Name" onChange={(e) => setReviewData({ ...reviewData, customer_name: e.target.value })} />
// //                         </Form.Group>
// //                         <Form.Group className="mb-3">
// //                             <Form.Label className="fw-bold">Review Title</Form.Label>
// //                             <Form.Control type="text" placeholder="Summarize your experience" onChange={(e) => setReviewData({ ...reviewData, title: e.target.value })} />
// //                         </Form.Group>
// //                         <Form.Group className="mb-3">
// //                             <Form.Label className="fw-bold">Your Feedback</Form.Label>
// //                             <Form.Control as="textarea" rows={3} placeholder="What did you like or dislike?" onChange={(e) => setReviewData({ ...reviewData, feedback: e.target.value })} />
// //                         </Form.Group>
// //                         <Form.Group className="mb-3">
// //                             <Form.Label className="fw-bold">Upload Photo</Form.Label>
// //                             <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
// //                             {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2" style={{ width: "100px", borderRadius: "8px" }} />}
// //                         </Form.Group>
// //                     </Form>
// //                 </Modal.Body>
// //                 <Modal.Footer>
// //                     <button className="btn btn-light" onClick={() => setShowRateModal(false)}>Cancel</button>
// //                     <button className="btn text-white" style={{ backgroundColor: "#385486" }} onClick={handleSubmitReview}>Submit Review</button>
// //                 </Modal.Footer>
// //             </Modal>
// //             <Footer />
// //         </>
// //     );
// // };

// // export default Productdetails;

// import { useParams, Link } from "react-router-dom";
// import { useContext, useEffect, useState } from "react";
// import Header from "../common/Header";
// import Footer from "../common/Footer";
// import { CartContext } from "./CartContext";
// import Toast from "react-bootstrap/Toast";
// import Modal from "react-bootstrap/Modal";
// import { Form, ProgressBar } from "react-bootstrap";
// import "../../assets/css/product.scss";

// export const API_BASE = import.meta.env.VITE_API_BASE_URL;

// const Productdetails = () => {
//     const { id } = useParams();
//     const [product, setProduct] = useState(null);
//     const [mainImage, setMainImage] = useState("");
//     const [relatedProducts, setRelatedProducts] = useState([]);
//     const [allProducts, setAllProducts] = useState([]);
//     const { addToCart } = useContext(CartContext);
//     const [showToast, setShowToast] = useState(false);
//     const [windowWidth, setWindowWidth] = useState(window.innerWidth);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     const [showRateModal, setShowRateModal] = useState(false);
//     const [imagePreview, setImagePreview] = useState(null);
//     const [reviewData, setReviewData] = useState({
//         price: 0, value: 0, quality: 0, service: 0,
//         title: "", feedback: "", image: null, customer_name: "",
//     });

//     const [showAllReviews, setShowAllReviews] = useState(false);

//     useEffect(() => {
//         const handleResize = () => setWindowWidth(window.innerWidth);
//         window.addEventListener("resize", handleResize);
//         return () => window.removeEventListener("resize", handleResize);
//     }, []);

//     // FIX 1: Proper product fetching with error handling
//     useEffect(() => {
//         const fetchProduct = async () => {
//             try {
//                 setLoading(true);
//                 setError(null);
                
//                 // Option 1: Fetch single product directly (RECOMMENDED)
//                 const response = await fetch(`${API_BASE}/get-product/${id}`);
                
//                 if (!response.ok) {
//                     throw new Error(`HTTP error! status: ${response.status}`);
//                 }
                
//                 const data = await response.json();
                
//                 if (data.status && data.product) {
//                     setProduct(data.product);
//                     if (data.product.images?.length > 0) {
//                         setMainImage(data.product.images[0]);
//                     }
//                 } else {
//                     throw new Error(data.message || 'Product not found');
//                 }
                
//             } catch (err) {
//                 console.error("Error fetching product:", err);
//                 setError(err.message);
                
//                 // Option 2: Fallback - fetch all products and filter (if single endpoint fails)
//                 try {
//                     const allRes = await fetch(`${API_BASE}/get-products`);
//                     if (allRes.ok) {
//                         const allData = await allRes.json();
//                         const selectedProduct = allData.find((item) => item.id === parseInt(id));
//                         if (selectedProduct) {
//                             setProduct(selectedProduct);
//                             if (selectedProduct.images?.length > 0) {
//                                 setMainImage(selectedProduct.images[0]);
//                             }
//                             setAllProducts(allData);
//                             setError(null);
//                         }
//                     }
//                 } catch (fallbackErr) {
//                     console.error("Fallback also failed:", fallbackErr);
//                 }
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (id) {
//             fetchProduct();
//         }
//     }, [id]);

//     // FIX 2: Fetch related products after product is loaded
//     useEffect(() => {
//         const fetchRelated = async () => {
//             if (!product) return;
            
//             try {
//                 // If we already have all products from fallback, use that
//                 if (allProducts.length > 0) {
//                     const related = allProducts.filter(
//                         (item) => item.id !== parseInt(id) && 
//                         item.subcategory_id === product.subcategory_id
//                     );
//                     setRelatedProducts(related);
//                     return;
//                 }
                
//                 // Otherwise fetch all products for related
//                 const response = await fetch(`${API_BASE}/get-products`);
//                 if (response.ok) {
//                     const data = await response.json();
//                     const related = data.filter(
//                         (item) => item.id !== parseInt(id) && 
//                         item.subcategory_id === product.subcategory_id
//                     );
//                     setRelatedProducts(related);
//                 }
//             } catch (err) {
//                 console.error("Error fetching related products:", err);
//             }
//         };

//         fetchRelated();
//     }, [product, id, allProducts]);

//     // FIX 3: Loading and Error states
//     if (loading) {
//         return (
//             <>
//                 <Header />
//                 <div className="container mt-5 text-center">
//                     <div className="spinner-border text-danger" role="status">
//                         <span className="visually-hidden">Loading...</span>
//                     </div>
//                     <p className="mt-3">Loading product details...</p>
//                 </div>
//                 <Footer />
//             </>
//         );
//     }

//     if (error) {
//         return (
//             <>
//                 <Header />
//                 <div className="container mt-5 text-center">
//                     <h3 className="text-danger">Error Loading Product</h3>
//                     <p className="text-muted">{error}</p>
//                     <Link to="/" className="btn btn-primary">Go Back Home</Link>
//                 </div>
//                 <Footer />
//             </>
//         );
//     }

//     if (!product) {
//         return (
//             <>
//                 <Header />
//                 <div className="container mt-5 text-center">
//                     <h3>Product Not Found</h3>
//                     <p>The product you're looking for doesn't exist.</p>
//                     <Link to="/" className="btn btn-primary">Go Back Home</Link>
//                 </div>
//                 <Footer />
//             </>
//         );
//     }

//     const handleAddToCart = () => {
//         addToCart({
//             id: product.id,
//             product_name: product.name || "Unknown Product",
//             image_url: mainImage || "",
//             price: parseFloat(product.price) || 0,
//             description: product.description || "",
//         });
//         setShowToast(true);
//         setTimeout(() => setShowToast(false), 3000);
//     };

//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setReviewData({ ...reviewData, image: file });
//             setImagePreview(URL.createObjectURL(file));
//         }
//     };

//     const renderStars = (rating, isInteractive = false, category = "") => {
//         const numRating = Math.round(rating || 0);
//         return [1, 2, 3, 4, 5].map((star) => (
//             <span
//                 key={star}
//                 style={{
//                     cursor: isInteractive ? "pointer" : "default",
//                     fontSize: isInteractive ? "22px" : "16px",
//                     color: star <= numRating ? "#ffc107" : "#ccc",
//                 }}
//                 onClick={() => isInteractive && setReviewData({ ...reviewData, [category]: star })}
//             >
//                 ★
//             </span>
//         ));
//     };

//     const handleSubmitReview = async () => {
//     // Validate required fields before submitting
//     if (!reviewData.price || !reviewData.value || !reviewData.quality || !reviewData.service) {
//         alert("Please rate all categories (Price, Value, Quality, Service)");
//         return;
//     }

//     if (!reviewData.customer_name.trim()) {
//         alert("Please enter your name");
//         return;
//     }

//     if (!reviewData.title.trim()) {
//         alert("Please enter a review title");
//         return;
//     }

//     if (!reviewData.feedback.trim()) {
//         alert("Please enter your feedback");
//         return;
//     }

//     const formData = new FormData();
//     formData.append('product_id', id);
//     formData.append('price_rating', reviewData.price);
//     formData.append('value_rating', reviewData.value);
//     formData.append('quality_rating', reviewData.quality);
//     formData.append('service_rating', reviewData.service);
//     formData.append('title', reviewData.title);
//     formData.append('customer_name', reviewData.customer_name);
//     formData.append('feedback', reviewData.feedback);
//     if (reviewData.image) {
//         formData.append('image', reviewData.image);
//     }

//     try {
//         const response = await fetch(`${API_BASE}/store-rating`, {
//             method: "POST",
//             body: formData,
//             // Remove Content-Type header - browser will set it automatically with boundary
//         });

//         // Log the response status for debugging
//         console.log('Response status:', response.status);

//         if (!response.ok) {
//             const errorText = await response.text();
//             console.error('Error response:', errorText);
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const result = await response.json();
//         console.log('Success response:', result);

//         if (result.status === 'success') {
//             alert(result.message || "Review submitted successfully!");
//             setShowRateModal(false);
//             setReviewData({
//                 price: 0, value: 0, quality: 0, service: 0,
//                 title: "", feedback: "", image: null, customer_name: "",
//             });
//             setImagePreview(null);
//         } else {
//             alert(result.message || "Something went wrong!");
//         }
//     } catch (error) {
//         console.error("Review submission error:", error);
//         alert("Connection to server failed! Please check your internet connection and try again.");
//     }
// };

//     const reviewsToShow = showAllReviews 
//         ? product.reviews 
//         : product.reviews?.slice(0, 2);

//     return (
//         <>
//             <Header />
//             <div className="container mt-5 position-relative mb-5">
//                 <div style={{ position: "fixed", top: "20px", right: "20px", zIndex: 9999 }}>
//                     <Toast show={showToast} bg="success" onClose={() => setShowToast(false)}>
//                         <Toast.Header><strong className="me-auto">Cart</strong></Toast.Header>
//                         <Toast.Body className="text-white">Product added to cart!</Toast.Body>
//                     </Toast>
//                 </div>

//                 <div className="product-details d-flex flex-wrap" style={{ gap: "40px", alignItems: "flex-start" }}>
//                     <div className="product-image" style={{ flex: 1, minWidth: "300px", maxWidth: windowWidth <= 768 ? "100%" : "50%" }}>
//                         <img 
//                             src={mainImage || '/placeholder.png'} 
//                             alt={product.name} 
//                             style={{ width: "100%", borderRadius: "8px", maxHeight: "500px", objectFit: "contain" }} 
//                         />
//                         <div style={{ display: "flex", gap: "5px", marginTop: "10px", flexWrap: "wrap" }}>
//                             {product.images?.map((img, index) => (
//                                 <img 
//                                     key={index} 
//                                     src={img} 
//                                     alt="thumb" 
//                                     style={{ 
//                                         width: "60px", 
//                                         height: "60px", 
//                                         objectFit: "cover", 
//                                         cursor: "pointer", 
//                                         border: mainImage === img ? "2px solid #e4032e" : "1px solid #ccc",
//                                         borderRadius: "4px"
//                                     }} 
//                                     onClick={() => setMainImage(img)} 
//                                 />
//                             ))}
//                         </div>
//                     </div>

//                     <div className="product-info" style={{ flex: 1, minWidth: "300px" }}>
//                         <h2>{product.name}</h2>
//                         <p><strong>Price:</strong> {product.price}৳</p>
//                         <p><strong>Quantity:</strong> {product.quantity}</p>
//                         {product.description && (
//                             <div dangerouslySetInnerHTML={{ __html: product.description }} />
//                         )}
//                         <div className="mt-4">
//                             <button 
//                                 onClick={handleAddToCart} 
//                                 className="btn" 
//                                 style={{ backgroundColor: "#1c8b41", color: "#fff", fontWeight: "bold" }}
//                             >
//                                 Add to Cart
//                             </button>
//                         </div>
//                     </div>
//                 </div>

//                 {/* --- Ratings & Reviews Section --- */}
//                 <div className="ratings-section mt-5 p-4 border-top">
//                     <h4 className="mb-4">Ratings & Reviews</h4>
//                     <div className="row">
//                         <div className="col-md-4 border-end">
//                             <div className="d-flex align-items-center gap-3">
//                                 <h1 className="display-4 fw-bold mb-0">
//                                     {product.avg_rating ? Number(product.avg_rating).toFixed(1) : "0.0"}/5
//                                 </h1>
//                                 <div>
//                                     <div>{renderStars(product.avg_rating || 0)}</div>
//                                     <small className="text-muted">{product.reviews?.length || 0} Ratings</small>
//                                 </div>
//                             </div>

//                             <div className="mt-4">
//                                 {[5, 4, 3, 2, 1].map((num) => {
//                                     const count = product.reviews?.filter(r => Math.round(r.price_rating || 0) === num).length || 0;
//                                     const total = product.reviews?.length || 0;
//                                     const percentage = total > 0 ? (count / total) * 100 : 0;
//                                     return (
//                                         <div key={num} className="d-flex align-items-center mb-1" style={{ fontSize: "12px" }}>
//                                             <div style={{ width: "50px" }}>{renderStars(num)}</div>
//                                             <ProgressBar 
//                                                 now={percentage} 
//                                                 variant="danger" 
//                                                 style={{ height: "6px", flex: 1, margin: "0 10px" }} 
//                                             />
//                                             <span style={{ width: "20px" }}>{count}</span>
//                                         </div>
//                                     );
//                                 })}
//                             </div>
//                         </div>

//                         <div className="col-md-8 ps-md-5">
//                             <div className="d-flex justify-content-between align-items-center mb-3">
//                                 <h5>Product Reviews</h5>
//                                 <button 
//                                     onClick={() => setShowRateModal(true)} 
//                                     className="btn btn-sm text-white" 
//                                     style={{ backgroundColor: "#385486" }}
//                                 >
//                                     Rate Product
//                                 </button>
//                             </div>

//                             {product.reviews && product.reviews.length > 0 ? (
//                                 <>
//                                     {reviewsToShow.map((rev) => (
//                                         <div key={rev.id} className="review-item mb-4 pb-3 border-bottom">
//                                             <div className="d-flex gap-3">
//                                                 <div style={{ 
//                                                     width: "45px", 
//                                                     height: "45px", 
//                                                     backgroundColor: "#eee", 
//                                                     borderRadius: "50%", 
//                                                     display: "flex", 
//                                                     alignItems: "center", 
//                                                     justifyContent: "center" 
//                                                 }}>
//                                                     <i className="bi bi-person-fill text-secondary"></i>
//                                                 </div>
//                                                 <div className="flex-grow-1">
//                                                     <div className="d-flex justify-content-between align-items-center">
//                                                         <h6 className="mb-0 fw-bold">
//                                                             {rev.customer_name ? rev.customer_name : "Anonymous Customer"}
//                                                         </h6>
//                                                         <small className="text-muted">
//                                                             ({rev.price_rating || 0}.0) {renderStars(rev.price_rating || 0)}
//                                                         </small>
//                                                     </div>
//                                                     <small className="text-muted d-block mb-2">
//                                                         Posted on {rev.created_at ? new Date(rev.created_at).toLocaleDateString() : "N/A"}
//                                                     </small>
//                                                     <p className="mb-1">{rev.title || "No Title"}</p>
//                                                     <p className="small text-dark mb-2">{rev.feedback || "No feedback provided."}</p>
//                                                     {rev.image && (
//                                                         <div className="mt-2">
//                                                             <img 
//                                                                 src={rev.image} 
//                                                                 alt="review" 
//                                                                 style={{ 
//                                                                     width: "80px", 
//                                                                     height: "80px", 
//                                                                     objectFit: "cover", 
//                                                                     borderRadius: "6px", 
//                                                                     border: "1px solid #ddd" 
//                                                                 }} 
//                                                             />
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     ))}
                                    
//                                     {product.reviews.length > 2 && (
//                                         <div className="text-center mt-3">
//                                             <button 
//                                                 className="btn btn-outline-secondary btn-sm" 
//                                                 onClick={() => setShowAllReviews(!showAllReviews)}
//                                             >
//                                                 {showAllReviews ? "View Less" : "View More"}
//                                             </button>
//                                         </div>
//                                     )}
//                                 </>
//                             ) : (
//                                 <p className="text-muted">No reviews yet. Be the first to rate!</p>
//                             )}
//                         </div>
//                     </div>
//                 </div>

//                 {/* Related Products Section */}
//                 {relatedProducts.length > 0 && (
//                     <div className="related-products mt-5">
//                         <h3>Related Products</h3>
//                         <div className="d-flex flex-wrap mt-3" style={{ gap: "20px" }}>
//                             {relatedProducts.slice(0, 4).map((item) => (
//                                 <div key={item.id} className="card" style={{ width: "200px" }}>
//                                     <img 
//                                         src={item.images?.[0] || '/placeholder.png'} 
//                                         className="card-img-top" 
//                                         style={{ height: "150px", objectFit: "cover" }} 
//                                         alt={item.name} 
//                                     />
//                                     <div className="card-body">
//                                         <h5 style={{ fontSize: "14px" }}>{item.name}</h5>
//                                         <Link to={`/product/${item.id}`} className="btn btn-success btn-sm">
//                                             View
//                                         </Link>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 )}
//             </div>

//             {/* --- Rate Product Modal --- */}
//             <Modal show={showRateModal} onHide={() => setShowRateModal(false)} size="lg" centered>
//                 <Modal.Header closeButton><Modal.Title>Rate This Product</Modal.Title></Modal.Header>
//                 <Modal.Body>
//                     <div className="row text-center mb-4">
//                         {['price', 'value', 'quality', 'service'].map(cat => (
//                             <div key={cat} className="col-6 col-md-3">
//                                 <label className="d-block fw-bold small text-capitalize">{cat}</label>
//                                 {renderStars(reviewData[cat], true, cat)}
//                             </div>
//                         ))}
//                     </div>
//                     <Form>
//                         <Form.Group className="mb-3">
//                             <Form.Label className="fw-bold">Your Name</Form.Label>
//                             <Form.Control 
//                                 type="text" 
//                                 placeholder="Your Name" 
//                                 onChange={(e) => setReviewData({ ...reviewData, customer_name: e.target.value })} 
//                             />
//                         </Form.Group>
//                         <Form.Group className="mb-3">
//                             <Form.Label className="fw-bold">Review Title</Form.Label>
//                             <Form.Control 
//                                 type="text" 
//                                 placeholder="Summarize your experience" 
//                                 onChange={(e) => setReviewData({ ...reviewData, title: e.target.value })} 
//                             />
//                         </Form.Group>
//                         <Form.Group className="mb-3">
//                             <Form.Label className="fw-bold">Your Feedback</Form.Label>
//                             <Form.Control 
//                                 as="textarea" 
//                                 rows={3} 
//                                 placeholder="What did you like or dislike?" 
//                                 onChange={(e) => setReviewData({ ...reviewData, feedback: e.target.value })} 
//                             />
//                         </Form.Group>
//                         <Form.Group className="mb-3">
//                             <Form.Label className="fw-bold">Upload Photo</Form.Label>
//                             <Form.Control 
//                                 type="file" 
//                                 accept="image/*" 
//                                 onChange={handleImageChange} 
//                             />
//                             {imagePreview && (
//                                 <img 
//                                     src={imagePreview} 
//                                     alt="Preview" 
//                                     className="mt-2" 
//                                     style={{ width: "100px", borderRadius: "8px" }} 
//                                 />
//                             )}
//                         </Form.Group>
//                     </Form>
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <button className="btn btn-light" onClick={() => setShowRateModal(false)}>Cancel</button>
//                     <button 
//                         className="btn text-white" 
//                         style={{ backgroundColor: "#385486" }} 
//                         onClick={handleSubmitReview}
//                     >
//                         Submit Review
//                     </button>
//                 </Modal.Footer>
//             </Modal>
//             <Footer />
//         </>
//     );
// };

// export default Productdetails;


import { useParams, Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { CartContext } from "./CartContext";
import Toast from "react-bootstrap/Toast";
import Modal from "react-bootstrap/Modal";
import { Form, ProgressBar } from "react-bootstrap";
import "../../assets/css/product.scss";

export const API_BASE = import.meta.env.VITE_API_BASE_URL;

const Productdetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState("");
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const { addToCart } = useContext(CartContext);
    const [showToast, setShowToast] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showRateModal, setShowRateModal] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [reviewData, setReviewData] = useState({
        price: 0, value: 0, quality: 0, service: 0,
        title: "", feedback: "", image: null, customer_name: "",
    });

    const [showAllReviews, setShowAllReviews] = useState(false);
    const [expandedRelated, setExpandedRelated] = useState({});

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // FIX 1: Proper product fetching with error handling
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Option 1: Fetch single product directly (RECOMMENDED)
                const response = await fetch(`${API_BASE}/get-product/${id}`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                if (data.status && data.product) {
                    setProduct(data.product);
                    if (data.product.images?.length > 0) {
                        setMainImage(data.product.images[0]);
                    }
                } else {
                    throw new Error(data.message || 'Product not found');
                }
                
            } catch (err) {
                console.error("Error fetching product:", err);
                setError(err.message);
                
                // Option 2: Fallback - fetch all products and filter (if single endpoint fails)
                try {
                    const allRes = await fetch(`${API_BASE}/get-products`);
                    if (allRes.ok) {
                        const allData = await allRes.json();
                        const selectedProduct = allData.find((item) => item.id === parseInt(id));
                        if (selectedProduct) {
                            setProduct(selectedProduct);
                            if (selectedProduct.images?.length > 0) {
                                setMainImage(selectedProduct.images[0]);
                            }
                            setAllProducts(allData);
                            setError(null);
                        }
                    }
                } catch (fallbackErr) {
                    console.error("Fallback also failed:", fallbackErr);
                }
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    // FIX 2: Fetch related products after product is loaded
    useEffect(() => {
        const fetchRelated = async () => {
            if (!product) return;
            
            try {
                // If we already have all products from fallback, use that
                if (allProducts.length > 0) {
                    const related = allProducts.filter(
                        (item) => item.id !== parseInt(id) && 
                        item.subcategory_id === product.subcategory_id
                    );
                    setRelatedProducts(related);
                    return;
                }
                
                // Otherwise fetch all products for related
                const response = await fetch(`${API_BASE}/get-products`);
                if (response.ok) {
                    const data = await response.json();
                    const related = data.filter(
                        (item) => item.id !== parseInt(id) && 
                        item.subcategory_id === product.subcategory_id
                    );
                    setRelatedProducts(related);
                }
            } catch (err) {
                console.error("Error fetching related products:", err);
            }
        };

        fetchRelated();
    }, [product, id, allProducts]);

    // FIX 3: Loading and Error states
    if (loading) {
        return (
            <>
                <Header />
                <div className="container mt-5 text-center">
                    <div className="spinner-border text-danger" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Loading product details...</p>
                </div>
                <Footer />
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header />
                <div className="container mt-5 text-center">
                    <h3 className="text-danger">Error Loading Product</h3>
                    <p className="text-muted">{error}</p>
                    <Link to="/" className="btn btn-primary">Go Back Home</Link>
                </div>
                <Footer />
            </>
        );
    }

    if (!product) {
        return (
            <>
                <Header />
                <div className="container mt-5 text-center">
                    <h3>Product Not Found</h3>
                    <p>The product you're looking for doesn't exist.</p>
                    <Link to="/" className="btn btn-primary">Go Back Home</Link>
                </div>
                <Footer />
            </>
        );
    }

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            product_name: product.name || "Unknown Product",
            image_url: mainImage || "",
            price: parseFloat(product.price) || 0,
            description: product.description || "",
        });
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setReviewData({ ...reviewData, image: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const renderStars = (rating, isInteractive = false, category = "") => {
        const numRating = Math.round(rating || 0);
        return [1, 2, 3, 4, 5].map((star) => (
            <span
                key={star}
                style={{
                    cursor: isInteractive ? "pointer" : "default",
                    fontSize: isInteractive ? "22px" : "16px",
                    color: star <= numRating ? "#ffc107" : "#ccc",
                }}
                onClick={() => isInteractive && setReviewData({ ...reviewData, [category]: star })}
            >
                ★
            </span>
        ));
    };

    const handleSubmitReview = async () => {
        // Validate required fields before submitting
        if (!reviewData.price || !reviewData.value || !reviewData.quality || !reviewData.service) {
            alert("Please rate all categories (Price, Value, Quality, Service)");
            return;
        }

        if (!reviewData.customer_name.trim()) {
            alert("Please enter your name");
            return;
        }

        if (!reviewData.title.trim()) {
            alert("Please enter a review title");
            return;
        }

        if (!reviewData.feedback.trim()) {
            alert("Please enter your feedback");
            return;
        }

        const formData = new FormData();
        formData.append('product_id', id);
        formData.append('price_rating', reviewData.price);
        formData.append('value_rating', reviewData.value);
        formData.append('quality_rating', reviewData.quality);
        formData.append('service_rating', reviewData.service);
        formData.append('title', reviewData.title);
        formData.append('customer_name', reviewData.customer_name);
        formData.append('feedback', reviewData.feedback);
        if (reviewData.image) {
            formData.append('image', reviewData.image);
        }

        try {
            const response = await fetch(`${API_BASE}/store-rating`, {
                method: "POST",
                body: formData,
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Success response:', result);

            if (result.status === 'success') {
                alert(result.message || "Review submitted successfully!");
                setShowRateModal(false);
                setReviewData({
                    price: 0, value: 0, quality: 0, service: 0,
                    title: "", feedback: "", image: null, customer_name: "",
                });
                setImagePreview(null);
            } else {
                alert(result.message || "Something went wrong!");
            }
        } catch (error) {
            console.error("Review submission error:", error);
            alert("Connection to server failed! Please check your internet connection and try again.");
        }
    };

    const reviewsToShow = showAllReviews 
        ? product.reviews 
        : product.reviews?.slice(0, 2);

    // Function to toggle reviews visibility for related products
    const toggleRelatedReviews = (productId) => {
        setExpandedRelated(prev => ({
            ...prev,
            [productId]: !prev[productId]
        }));
    };

    // Function to get a preview of reviews (first 2)
    const getRelatedReviewsPreview = (reviews) => {
        if (!reviews || reviews.length === 0) return [];
        return reviews.slice(0, 2);
    };

    return (
        <>
            <Header />
            <div className="container mt-5 position-relative mb-5">
                <div style={{ position: "fixed", top: "20px", right: "20px", zIndex: 9999 }}>
                    <Toast show={showToast} bg="success" onClose={() => setShowToast(false)}>
                        <Toast.Header><strong className="me-auto">Cart</strong></Toast.Header>
                        <Toast.Body className="text-white">Product added to cart!</Toast.Body>
                    </Toast>
                </div>

                <div className="product-details d-flex flex-wrap" style={{ gap: "40px", alignItems: "flex-start" }}>
                    <div className="product-image" style={{ flex: 1, minWidth: "300px", maxWidth: windowWidth <= 768 ? "100%" : "50%" }}>
                        <img 
                            src={mainImage || '/placeholder.png'} 
                            alt={product.name} 
                            style={{ width: "100%", borderRadius: "8px", maxHeight: "500px", objectFit: "contain" }} 
                        />
                        <div style={{ display: "flex", gap: "5px", marginTop: "10px", flexWrap: "wrap" }}>
                            {product.images?.map((img, index) => (
                                <img 
                                    key={index} 
                                    src={img} 
                                    alt="thumb" 
                                    style={{ 
                                        width: "60px", 
                                        height: "60px", 
                                        objectFit: "cover", 
                                        cursor: "pointer", 
                                        border: mainImage === img ? "2px solid #e4032e" : "1px solid #ccc",
                                        borderRadius: "4px"
                                    }} 
                                    onClick={() => setMainImage(img)} 
                                />
                            ))}
                        </div>
                    </div>

                    <div className="product-info" style={{ flex: 1, minWidth: "300px" }}>
                        <h2>{product.name}</h2>
                        <p><strong>Price:</strong> {product.price}৳</p>
                        <p><strong>Quantity:</strong> {product.quantity}</p>
                        {product.description && (
                            <div dangerouslySetInnerHTML={{ __html: product.description }} />
                        )}
                        <div className="mt-4">
                            <button 
                                onClick={handleAddToCart} 
                                className="btn" 
                                style={{ backgroundColor: "#1c8b41", color: "#fff", fontWeight: "bold" }}
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- Ratings & Reviews Section --- */}
                <div className="ratings-section mt-5 p-4 border-top">
                    <h4 className="mb-4">Ratings & Reviews</h4>
                    <div className="row">
                        <div className="col-md-4 border-end">
                            <div className="d-flex align-items-center gap-3">
                                <h1 className="display-4 fw-bold mb-0">
                                    {product.avg_rating ? Number(product.avg_rating).toFixed(1) : "0.0"}/5
                                </h1>
                                <div>
                                    <div>{renderStars(product.avg_rating || 0)}</div>
                                    <small className="text-muted">{product.reviews?.length || 0} Ratings</small>
                                </div>
                            </div>

                            <div className="mt-4">
                                {[5, 4, 3, 2, 1].map((num) => {
                                    const count = product.reviews?.filter(r => Math.round(r.price_rating || 0) === num).length || 0;
                                    const total = product.reviews?.length || 0;
                                    const percentage = total > 0 ? (count / total) * 100 : 0;
                                    return (
                                        <div key={num} className="d-flex align-items-center mb-1" style={{ fontSize: "12px" }}>
                                            <div style={{ width: "50px" }}>{renderStars(num)}</div>
                                            <ProgressBar 
                                                now={percentage} 
                                                variant="danger" 
                                                style={{ height: "6px", flex: 1, margin: "0 10px" }} 
                                            />
                                            <span style={{ width: "20px" }}>{count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="col-md-8 ps-md-5">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5>Product Reviews</h5>
                                <button 
                                    onClick={() => setShowRateModal(true)} 
                                    className="btn btn-sm text-white" 
                                    style={{ backgroundColor: "#385486" }}
                                >
                                    Rate Product
                                </button>
                            </div>

                            {product.reviews && product.reviews.length > 0 ? (
                                <>
                                    {reviewsToShow.map((rev) => (
                                        <div key={rev.id} className="review-item mb-4 pb-3 border-bottom">
                                            <div className="d-flex gap-3">
                                                <div style={{ 
                                                    width: "45px", 
                                                    height: "45px", 
                                                    backgroundColor: "#eee", 
                                                    borderRadius: "50%", 
                                                    display: "flex", 
                                                    alignItems: "center", 
                                                    justifyContent: "center" 
                                                }}>
                                                    <i className="bi bi-person-fill text-secondary"></i>
                                                </div>
                                                <div className="flex-grow-1">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <h6 className="mb-0 fw-bold">
                                                            {rev.customer_name ? rev.customer_name : "Anonymous Customer"}
                                                        </h6>
                                                        <small className="text-muted">
                                                            ({rev.price_rating || 0}.0) {renderStars(rev.price_rating || 0)}
                                                        </small>
                                                    </div>
                                                    <small className="text-muted d-block mb-2">
                                                        Posted on {rev.created_at ? new Date(rev.created_at).toLocaleDateString() : "N/A"}
                                                    </small>
                                                    <p className="mb-1">{rev.title || "No Title"}</p>
                                                    <p className="small text-dark mb-2">{rev.feedback || "No feedback provided."}</p>
                                                    {rev.image && (
                                                        <div className="mt-2">
                                                            <img 
                                                                src={rev.image} 
                                                                alt="review" 
                                                                style={{ 
                                                                    width: "80px", 
                                                                    height: "80px", 
                                                                    objectFit: "cover", 
                                                                    borderRadius: "6px", 
                                                                    border: "1px solid #ddd" 
                                                                }} 
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    {product.reviews.length > 2 && (
                                        <div className="text-center mt-3">
                                            <button 
                                                className="btn btn-outline-secondary btn-sm" 
                                                onClick={() => setShowAllReviews(!showAllReviews)}
                                            >
                                                {showAllReviews ? "View Less" : "View More"}
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <p className="text-muted">No reviews yet. Be the first to rate!</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Related Products Section with Reviews */}
                {relatedProducts.length > 0 && (
                    <div className="related-products mt-5">
                        <h3 className="mb-4">Related Products</h3>
                        <div className="row">
                            {relatedProducts.slice(0, 4).map((item) => {
                                const isExpanded = expandedRelated[item.id] || false;
                                const reviewsPreview = getRelatedReviewsPreview(item.reviews);
                                const hasMoreReviews = item.reviews && item.reviews.length > 2;

                                return (
                                    <div key={item.id} className="col-md-3 col-sm-6 mb-4">
                                        <div className="card h-100">
                                            <Link to={`/product/${item.id}`}>
                                                <img 
                                                    src={item.images?.[0] || '/placeholder.png'} 
                                                    className="card-img-top" 
                                                    style={{ height: "200px", objectFit: "cover" }} 
                                                    alt={item.name} 
                                                />
                                            </Link>
                                            <div className="card-body d-flex flex-column">
                                                <Link to={`/product/${item.id}`} className="text-decoration-none text-dark">
                                                    <h5 className="card-title" style={{ fontSize: "14px", minHeight: "40px" }}>
                                                        {item.name}
                                                    </h5>
                                                </Link>
                                                
                                                {/* Rating Summary */}
                                                <div className="mb-2">
                                                    <div className="d-flex align-items-center">
                                                        <span className="me-2">{renderStars(item.avg_rating || 0)}</span>
                                                        <small className="text-muted">
                                                            ({item.reviews?.length || 0})
                                                        </small>
                                                    </div>
                                                </div>
                                                
                                                <p className="card-text">
                                                    <strong>{item.price}৳</strong>
                                                </p>
                                                
                                                {/* Reviews Section */}
                                                {item.reviews && item.reviews.length > 0 && (
                                                    <div className="mt-2">
                                                        <button 
                                                            className="btn btn-link btn-sm p-0 text-primary text-decoration-none"
                                                            onClick={() => toggleRelatedReviews(item.id)}
                                                            style={{ fontSize: "12px" }}
                                                        >
                                                            {isExpanded ? "Hide Reviews" : "Show Reviews"} 
                                                            <small>({item.reviews.length})</small>
                                                        </button>
                                                        
                                                        {isExpanded && (
                                                            <div className="mt-2">
                                                                {reviewsPreview.map((rev) => (
                                                                    <div key={rev.id} className="review-item mb-2 p-2 bg-light rounded">
                                                                        <div className="d-flex align-items-center">
                                                                            <div style={{ 
                                                                                width: "25px", 
                                                                                height: "25px", 
                                                                                backgroundColor: "#ddd", 
                                                                                borderRadius: "50%", 
                                                                                display: "flex", 
                                                                                alignItems: "center", 
                                                                                justifyContent: "center",
                                                                                marginRight: "8px",
                                                                                fontSize: "12px"
                                                                            }}>
                                                                                <i className="bi bi-person-fill text-secondary"></i>
                                                                            </div>
                                                                            <div className="flex-grow-1">
                                                                                <div className="d-flex justify-content-between align-items-center">
                                                                                    <small className="fw-bold">
                                                                                        {rev.customer_name || "Anonymous"}
                                                                                    </small>
                                                                                    <small>
                                                                                        {renderStars(rev.price_rating || 0)}
                                                                                    </small>
                                                                                </div>
                                                                                <small className="text-muted d-block">
                                                                                    {rev.title || "No Title"}
                                                                                </small>
                                                                                {rev.feedback && (
                                                                                    <small className="text-dark d-block">
                                                                                        {rev.feedback.length > 50 
                                                                                            ? rev.feedback.substring(0, 50) + "..." 
                                                                                            : rev.feedback}
                                                                                    </small>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                
                                                                {hasMoreReviews && (
                                                                    <Link 
                                                                        to={`/product/${item.id}`} 
                                                                        className="btn btn-outline-primary btn-sm w-100 mt-1"
                                                                        style={{ fontSize: "11px" }}
                                                                    >
                                                                        View All {item.reviews.length} Reviews
                                                                    </Link>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                
                                                <div className="mt-auto">
                                                    <Link to={`/product/${item.id}`} className="btn btn-success btn-sm w-100">
                                                        View Details
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* --- Rate Product Modal --- */}
            <Modal show={showRateModal} onHide={() => setShowRateModal(false)} size="lg" centered>
                <Modal.Header closeButton><Modal.Title>Rate This Product</Modal.Title></Modal.Header>
                <Modal.Body>
                    <div className="row text-center mb-4">
                        {['price', 'value', 'quality', 'service'].map(cat => (
                            <div key={cat} className="col-6 col-md-3">
                                <label className="d-block fw-bold small text-capitalize">{cat}</label>
                                {renderStars(reviewData[cat], true, cat)}
                            </div>
                        ))}
                    </div>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Your Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Your Name" 
                                onChange={(e) => setReviewData({ ...reviewData, customer_name: e.target.value })} 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Review Title</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Summarize your experience" 
                                onChange={(e) => setReviewData({ ...reviewData, title: e.target.value })} 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Your Feedback</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={3} 
                                placeholder="What did you like or dislike?" 
                                onChange={(e) => setReviewData({ ...reviewData, feedback: e.target.value })} 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Upload Photo</Form.Label>
                            <Form.Control 
                                type="file" 
                                accept="image/*" 
                                onChange={handleImageChange} 
                            />
                            {imagePreview && (
                                <img 
                                    src={imagePreview} 
                                    alt="Preview" 
                                    className="mt-2" 
                                    style={{ width: "100px", borderRadius: "8px" }} 
                                />
                            )}
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-light" onClick={() => setShowRateModal(false)}>Cancel</button>
                    <button 
                        className="btn text-white" 
                        style={{ backgroundColor: "#385486" }} 
                        onClick={handleSubmitReview}
                    >
                        Submit Review
                    </button>
                </Modal.Footer>
            </Modal>
            <Footer />
        </>
    );
};

export default Productdetails;