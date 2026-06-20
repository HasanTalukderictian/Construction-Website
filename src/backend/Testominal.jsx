import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Footer from "./Footer";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashNav from "./DasNav";
import { BsStar, BsStarFill, BsStarHalf, BsPlus, BsTrash, BsChat, BsPerson, BsBriefcase, BsImage, BsUpload, BsX, BsStars } from "react-icons/bs";
import { FaSpinner } from "react-icons/fa";

export const API_BASE = import.meta.env.VITE_API_BASE_URL;

const Testominal = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);

  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // Fetch Reviews
  const fetchReviews = () => {
    setLoading(true);
    axios
      .get(`${API_BASE}/get-reviews`)
      .then((res) => {
        if (res.data.status) setReviews(res.data.data);
      })
      .catch(() => toast.error("Failed to load reviews"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Image Handling
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removePreview = () => {
    setImage(null);
    setPreview(null);
  };

  const resetForm = () => {
    setName("");
    setDesignation("");
    setRating("");
    setComment("");
    setImage(null);
    setPreview(null);
  };

  // Submit Review
  const submitReview = async () => {
    if (!name || !designation || !rating || !comment) {
      toast.error("Please fill all required fields!");
      return;
    }

    if (rating < 1 || rating > 5) {
      toast.error("Rating must be between 1 and 5!");
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("designation", designation);
    formData.append("rating", rating);
    formData.append("comment", comment);
    if (image) formData.append("image", image);

    try {
      const res = await axios.post(
        `${API_BASE}/add-reviews`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (res.data.status) {
        fetchReviews();
        setShowModal(false);
        resetForm();
        toast.success("Review added successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add review.");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Review
  const deleteReview = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    
    setDeleteLoading(id);
    try {
      const res = await axios.delete(`${API_BASE}/del-reviews/${id}`);
      if (res.data.status) {
        fetchReviews();
        toast.success("Review deleted successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete review.");
    } finally {
      setDeleteLoading(null);
    }
  };

  // Render Stars
  const renderStars = (ratingValue) => {
    const numRating = parseFloat(ratingValue) || 0;
    const stars = [];
    const fullStars = Math.floor(numRating);
    const hasHalfStar = numRating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<BsStarFill key={`full-${i}`} style={{ color: '#fbbf24', fontSize: '12px' }} />);
    }
    if (hasHalfStar) {
      stars.push(<BsStarHalf key="half" style={{ color: '#fbbf24', fontSize: '12px' }} />);
    }
    while (stars.length < 5) {
      stars.push(<BsStar key={`empty-${stars.length}`} style={{ color: '#e5e7eb', fontSize: '12px' }} />);
    }
    return stars;
  };

  // Calculate stats
  const totalReviews = reviews.length;
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + (parseFloat(r.rating) || 0), 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <Layout>
      <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
        <DashNav />
        
        <div className="container-fluid px-3 px-md-4 py-4">
          {/* Header */}
          <div className="mb-4">
            <div className="d-flex align-items-center gap-3 mb-2">
              <div className="rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)', width: '50px', height: '50px' }}>
                <BsStars size={28} color="white" />
              </div>
              <div>
                <h3 className="mb-0 fw-bold" style={{ color: '#1f2937' }}>Testimonials</h3>
                <p className="text-muted mt-1 mb-0">Manage customer reviews and feedback</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)', color: 'white' }}>
                <div className="card-body p-3 p-md-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1 opacity-75">Total Reviews</h6>
                      <h2 className="mb-0 fw-bold">{totalReviews}</h2>
                    </div>
                    <BsChat size={32} className="opacity-50" />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: 'white' }}>
                <div className="card-body p-3 p-md-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1 opacity-75">Average Rating</h6>
                      <h2 className="mb-0 fw-bold">{avgRating} / 5</h2>
                    </div>
                    <div className="d-flex gap-1">{renderStars(avgRating)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Header with Add Button */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
            <div>
              <h5 className="mb-0 fw-semibold" style={{ color: '#1f2937' }}>All Testimonials</h5>
              <p className="text-muted small mt-1 mb-0">Showing {reviews.length} customer reviews</p>
            </div>
            <button
              className="btn d-flex align-items-center gap-2"
              style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', borderRadius: '12px', padding: '10px 24px' }}
              onClick={() => setShowModal(true)}
            >
              <BsPlus size={18} /> Add Testimonial
            </button>
          </div>

          {/* Reviews Grid */}
          {loading ? (
            <div className="text-center py-5">
              <FaSpinner className="fa-spin" size={40} style={{ color: '#ec4899' }} />
              <p className="mt-3 text-muted">Loading testimonials...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-5">
              <BsStars size={60} className="text-muted mb-3 opacity-25" />
              <h5 className="text-muted">No testimonials found</h5>
              <p className="text-muted">Click "Add Testimonial" to create your first review</p>
            </div>
          ) : (
            <div className="row g-4">
              {reviews.map((review) => (
                <div className="col-xl-4 col-lg-6" key={review.id}>
                  <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '20px', overflow: 'hidden', transition: 'transform 0.2s ease' }}>
                    <div className="card-body p-4">
                      {/* Rating Stars */}
                      <div className="d-flex align-items-center gap-1 mb-3">
                        {renderStars(review.rating)}
                        <span className="text-muted small ms-2">({review.rating})</span>
                      </div>
                      
                      {/* Comment */}
                      <p className="text-muted mb-3" style={{ fontSize: '14px', lineHeight: '1.6', minHeight: '80px' }}>
                        "{review.comment?.length > 150 ? review.comment.substring(0, 150) + '...' : review.comment}"
                      </p>
                      
                      {/* User Info */}
                      <div className="d-flex align-items-center gap-3 mt-3 pt-2 border-top" style={{ borderTop: '1px solid #e2e8f0' }}>
                        {review.image ? (
                          <img
                            src={review.image}
                            width="50"
                            height="50"
                            style={{ objectFit: "cover", borderRadius: "50%" }}
                            alt={review.name}
                          />
                        ) : (
                          <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px', background: '#fce7f3' }}>
                            <BsPerson size={24} style={{ color: '#ec4899' }} />
                          </div>
                        )}
                        <div className="flex-grow-1">
                          <h6 className="mb-0 fw-semibold" style={{ color: '#1f2937' }}>{review.name}</h6>
                          <small className="text-muted">{review.designation}</small>
                        </div>
                        <button
                          className="btn btn-sm d-flex align-items-center justify-content-center"
                          style={{ background: '#ef4444', color: 'white', borderRadius: '10px', width: '34px', height: '34px', border: 'none' }}
                          onClick={() => deleteReview(review.id)}
                          disabled={deleteLoading === review.id}
                        >
                          {deleteLoading === review.id ? <FaSpinner className="fa-spin" size={12} /> : <BsTrash size={14} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <Footer />
      </div>

      {/* Add Review Modal */}
      {showModal && (
        <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.5)", zIndex: 9999, overflowY: "auto" }}>
          <div className="modal-dialog modal-dialog-centered" style={{ margin: "16px", maxWidth: "550px" }}>
            <div className="modal-content" style={{ borderRadius: '24px', overflow: 'hidden' }}>
              <div className="modal-header border-0" style={{ background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)', padding: '20px 24px' }}>
                <div className="d-flex align-items-center gap-2">
                  <BsStars size={20} color="white" />
                  <h5 className="modal-title text-white">Add New Testimonial</h5>
                </div>
                <button type="button" className="btn-close btn-close-white" onClick={() => { setShowModal(false); resetForm(); }}></button>
              </div>
              
              <div className="modal-body p-4">
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <BsPerson className="me-1" style={{ color: '#ec4899' }} />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    style={{ borderRadius: '12px', padding: '12px 16px', border: '1px solid #e2e8f0' }}
                    placeholder="Enter customer name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <BsBriefcase className="me-1" style={{ color: '#ec4899' }} />
                    Designation *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    style={{ borderRadius: '12px', padding: '12px 16px', border: '1px solid #e2e8f0' }}
                    placeholder="e.g., CEO, Founder, Customer"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <BsStar className="me-1" style={{ color: '#ec4899' }} />
                    Rating (1-5) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    className="form-control"
                    style={{ borderRadius: '12px', padding: '12px 16px', border: '1px solid #e2e8f0' }}
                    placeholder="Enter rating from 1 to 5"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <BsChat className="me-1" style={{ color: '#ec4899' }} />
                    Review Comment *
                  </label>
                  <textarea
                    className="form-control"
                    rows="4"
                    style={{ borderRadius: '12px', padding: '12px 16px', border: '1px solid #e2e8f0' }}
                    placeholder="Write customer's feedback..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <BsImage className="me-1" style={{ color: '#ec4899' }} />
                    Customer Image
                  </label>
                  <div className="border-2 border-dashed rounded-4 p-4 text-center" style={{ border: '2px dashed #cbd5e1', borderRadius: '16px', cursor: 'pointer', background: '#f8fafc' }}>
                    <input
                      type="file"
                      id="reviewImage"
                      style={{ display: 'none' }}
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <label htmlFor="reviewImage" style={{ cursor: 'pointer', display: 'block' }}>
                      <BsUpload size={30} style={{ color: '#ec4899', marginBottom: '12px' }} />
                      <p className="mb-1 fw-semibold">Click to upload image</p>
                      <small className="text-muted">PNG, JPG up to 2MB</small>
                    </label>
                  </div>
                  
                  {preview && (
                    <div className="position-relative d-inline-block mt-3">
                      <img
                        src={preview}
                        width="100"
                        height="100"
                        style={{ objectFit: "cover", borderRadius: "50%", border: "2px solid #ec4899" }}
                        alt="Preview"
                      />
                      <button
                        type="button"
                        onClick={removePreview}
                        style={{ position: "absolute", top: "-8px", right: "-8px", background: "#ef4444", color: "#fff", border: "none", width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                      >
                        <BsX size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="modal-footer border-0 p-4 pt-0">
                <button
                  type="button"
                  className="btn btn-light"
                  style={{ borderRadius: '12px', padding: '10px 24px' }}
                  onClick={() => { setShowModal(false); resetForm(); }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn d-flex align-items-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', borderRadius: '12px', padding: '10px 24px', border: 'none' }}
                  onClick={submitReview}
                  disabled={submitting}
                >
                  {submitting ? <><FaSpinner className="fa-spin" /> Saving...</> : <><BsStars /> Save Review</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </Layout>
  );
};

export default Testominal;