import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Footer from "./Footer";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashNav from "./DasNav";

const Testominal = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // Fetch Reviews
  const fetchReviews = () => {
    axios
      .get("http://127.0.0.1:8000/api/get-reviews")
      .then((res) => {
        if (res.data.status) setReviews(res.data.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Image Handling
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
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
    const formData = new FormData();
    formData.append("name", name);
    formData.append("designation", designation);
    formData.append("rating", rating);
    formData.append("comment", comment);
    if (image) formData.append("image", image);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/add-reviews",
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
    }
  };

  // Delete Review
  const deleteReview = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      const res = await axios.delete(`http://127.0.0.1:8000/api/del-reviews/${id}`);
      if (res.data.status) {
        fetchReviews();
        toast.success("Review deleted successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete review.");
    }
  };

  return (
    <Layout>
      <div className="d-flex">
        <div className="flex-grow-1">
          <DashNav />

          <div className="container mt-4">
            {/* Title + Add Button */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3>Testimonials</h3>
              <button className="btn btn-success" onClick={() => setShowModal(true)}>
                + Add
              </button>
            </div>

            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered table-striped">
                  <thead className="table-dark">
                    <tr>
                      <th>Name</th>
                      <th>Designation</th>
                      <th>Rating</th>
                      <th>Comment</th>
                      <th>Image</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.length > 0 ? (
                      reviews.map((review) => (
                        <tr key={review.id}>
                          <td>{review.name}</td>
                          <td>{review.designation}</td>
                          <td>{review.rating} ⭐</td>
                          <td>{review.comment}</td>
                          <td>
                            {review.image && (
                              <img
                                src={review.image}
                                width="60"
                                height="60"
                                style={{ objectFit: "cover" }}
                                alt=""
                              />
                            )}
                          </td>
                          <td>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => deleteReview(review.id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No Reviews Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <Footer />
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Review</h5>
                <button
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                ></button>
              </div>

              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Designation</label>
                    <input
                      type="text"
                      className="form-control"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Rating (1-5)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Comment</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label className="form-label">Image</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={handleImageChange}
                  />
                </div>

                {preview && (
                  <div className="position-relative d-inline-block mb-3">
                    <img
                      src={preview}
                      width="140"
                      height="140"
                      style={{
                        objectFit: "cover",
                        borderRadius: "10px",
                        border: "1px solid #ccc",
                      }}
                      alt="Preview"
                    />
                    <button
                      onClick={removePreview}
                      style={{
                        position: "absolute",
                        top: "-8px",
                        right: "-8px",
                        background: "red",
                        color: "#fff",
                        border: "none",
                        width: "22px",
                        height: "22px",
                        borderRadius: "50%",
                        cursor: "pointer",
                      }}
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                >
                  Close
                </button>
                <button className="btn btn-success" onClick={submitReview}>
                  Save Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      <ToastContainer position="top-right" autoClose={3000} />
    </Layout>
  );
};

export default Testominal;