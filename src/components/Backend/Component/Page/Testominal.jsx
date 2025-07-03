import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-quill/dist/quill.snow.css';
import ReactQuill from "react-quill";
import Layout from "../Layout";
import Footer from "../../Footer";
import DashNav from "../DashNav";

const Testominal = () => {
  const [blogs, setBlogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false); // State to toggle edit mode

  // Form fields state
  const [name, setName] = useState(""); // Changed title to name
  const [designation, setdesignation] = useState("");
  const [rating, setRating] = useState(""); // Added state for rating
  const [comment, setComment] = useState(""); // Added state for comment
  const [image, setImage] = useState(null);
  const [showDialog, setShowDialog] = useState(false); // State for dialog visibility
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [errors, setErrors] = useState({});

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/get-testominal`);
        const result = await response.json();

        console.log(result);

        // Access the "data" property and update image URLs
        const updatedBlogs = result.data.map((blog) => ({
          ...blog,
          image: blog.image
            ? `${BASE_URL}/storage/${blog.image}`
            : null,
        }));

        setBlogs(updatedBlogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchData();
  }, []);


  const optimizeImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          canvas.toBlob(
            (blob) => {
              const optimizedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(optimizedFile);
            },
            "image/jpeg",
            0.7 // compression quality
          );
        };
      };
    });
  };




  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const optimized = await optimizeImage(file);
    setImage(optimized);
  };


  const handleShowModal = (blog = null) => {
    if (blog) {
      // If we are editing, populate the form with the blog data
      setName(blog.title); // Changed title to name
      setdesignation(blog.designation);
      setRating(blog.rating || ""); // Set rating for edit mode
      setComment(blog.comment || ""); // Set comment for edit mode
      setImage(null); // Set to null so image won't be shown if not updated
      setEditMode(true); // Toggle to edit mode
      setBlogToDelete(blog.id); // Set the ID of the blog for editing
    } else {
      // If adding a new blog, reset form fields
      setName(""); // Changed title to name
      setdesignation("");
      setRating(""); // Reset rating
      setComment(""); // Reset comment
      setImage(null);
      setEditMode(false); // Toggle to add mode
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setName(""); // Changed title to name
    setdesignation("");
    setRating(""); // Reset rating
    setComment(""); // Reset comment
    setImage(null);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = "Name is required."; // Changed title to name
    if (!designation.trim()) newErrors.designation = "designation is required.";
    if (!rating.trim()) newErrors.rating = "Rating is required."; // Validate rating
    if (!comment.trim()) newErrors.comment = "Comment is required."; // Validate comment
    if (image && !["image/png", "image/jpeg"].includes(image.type)) {
      newErrors.image = "Only PNG or JPEG images are allowed.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page

    if (!validateForm()) {
      console.log("Validation failed", errors);
      return;
    }

    const formData = new FormData();
    formData.append("name", name); // Changed title to name
    formData.append("designation", designation);
    formData.append("rating", rating); // Added rating field
    formData.append("comment", comment); // Added comment field
    if (image) {
      formData.append("image", image);
    }

    try {
      let response;
      if (editMode) {
        // Edit blog
        response = await fetch(`${BASE_URL}/api/edit-testominal/${blogToDelete}`, {
          method: "POST",
          body: formData,
        });
      } else {
        // Add new blog
        response = await fetch(`${BASE_URL}/api/add-testominal`, {
          method: "POST",
          body: formData,
        });
      }

      const result = await response.json();

      if (response.ok) {
        if (editMode) {
          // Update the blogs array with the edited blog
          setBlogs(blogs.map((blog) => (blog.id === blogToDelete ? result : blog)));
        } else {
          setBlogs([...blogs, result]);
        }
        handleCloseModal();
      } else {
        console.error("Failed to save the blog:", result);
        setErrors(result.errors || {});
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  const deleteBlog = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/api/del-testominal/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setBlogs(blogs.filter(blog => blog.id !== id));
        setShowDialog(false);
      } else {
        console.error("Failed to delete the blog");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  const handleDeleteClick = (id) => {
    setBlogToDelete(id);
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
    setBlogToDelete(null);
  };

  return (
    <Layout>
      <DashNav />
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Testimonial Page</h2>
          <button className="btn btn-success" onClick={() => handleShowModal()}>
            + Add Testimonial
          </button>
        </div>

        <table className="table table-bordered border-2">
          <thead className="thead-dark">
            <tr>
              <th className="text-center border border-dark fs-3">No</th>
              <th className="text-center border border-dark fs-3">Name</th> {/* Changed Title to Name */}
              <th className="text-center border border-dark fs-3">Designation</th>
              <th className="text-center border border-dark fs-3">Comment</th>
              <th className="text-center border border-dark fs-3">Picture</th>
              <th className="text-center border border-dark fs-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.length > 0 ? (
              blogs.map((blog, index) => (
                <tr key={blog.id} className="border border-dark">
                  <td className="text-center border border-dark">{index + 1}</td>
                  <td className="border border-dark text-center">{blog.name}</td> {/* Changed Title to Name */}
                  <td className="border border-dark text-center">

                    {blog.designation}

                  </td>
                  <td
                    className="border border-dark">
                    {blog.comment}
                  </td>
                  <td className="border border-dark">
                    {blog.image && (
                      <img
                        src={blog.image}
                        className="img-fluid"
                        style={{ width: "80px", height: "80px" }}
                      />
                    )}
                  </td>
                  <td className="border border-dark">
                    <button
                      className="btn btn-outline-secondary mx-2"
                      onClick={() => handleShowModal(blog)}
                    >
                      <i className="bi bi-pencil-square"></i> {/* Edit Icon */}
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteClick(blog.id)}
                    >
                      <i className="bi bi-trash"></i> {/* Delete Icon */}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center border border-dark">
                  No blogs available.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Confirmation Dialog */}
        {showDialog && (
          <div className="modal show" style={{ display: "block" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-body">
                  <p className="text-center text-danger font-weight-bold">
                    Are you sure you want to delete this blog?
                  </p>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeDialog}
                    style={{ height: '55px' }}
                  >
                    No
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => deleteBlog(blogToDelete)}
                    style={{ height: '55px', lineHeight: '41px' }}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Blog Modal */}
      {showModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-xl" role="document">
            <div className="modal-content">
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  {/* Name Field */}
                  <div className="form-group">
                    <label htmlFor="name">Name</label> {/* Changed title to name */}
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      placeholder="Enter blog name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{ height: '50px' }}
                      required
                    />
                    {errors.name && <small className="text-danger">{errors.name}</small>}
                  </div>

                  {/* designation Field */}
                  <div className="form-group">
                    <label htmlFor="designation">Designation</label>
                    <input
                      type="text"
                      className="form-control"
                      id="designation"
                      placeholder="Enter blog designation"
                      value={designation}
                      onChange={(e) => setdesignation(e.target.value)} // Set designation state here
                      required
                    />
                    {errors.designation && <small className="text-danger">{errors.designation}</small>}
                  </div>

                  {/* Rating Field */}
                  <div className="form-group">
                    <label htmlFor="rating">Rating</label>
                    <input
                      type="text"
                      className="form-control"
                      id="rating"
                      placeholder="Enter rating"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      style={{ height: '50px' }}
                      required
                    />
                    {errors.rating && <small className="text-danger">{errors.rating}</small>}
                  </div>

                  {/* Comment Field */}
                  <div className="form-group">
                    <label htmlFor="comment">Comment</label>
                    <ReactQuill
                      id="comment"
                      value={comment}
                      onChange={(value) => setComment(value)}
                      placeholder="Enter your comment"
                      required
                    />
                    {errors.comment && <small className="text-danger">{errors.comment}</small>}
                  </div>

                  {/* Image Upload */}

                  <div className="mb-3">
                    <label className="form-label">Picture</label>
                    <input
                      type="file"
                      accept="image/*"
                      className={`form-control ${errors.image ? "is-invalid" : ""}`}
                      onChange={handleImageChange}
                    />
                    {errors.image && (
                      <div className="invalid-feedback">{errors.image}</div>
                    )}

                    {image && (
                      <div className="position-relative mt-3" style={{ maxWidth: "150px" }}>
                        <img
                          src={URL.createObjectURL(image)}
                          alt="Preview"
                          className="img-thumbnail"
                        />
                        <button
                          type="button"
                          className="btn btn-sm btn-danger position-absolute top-0 end-0"
                          onClick={() => setImage(null)}
                          style={{
                            borderRadius: "50%",
                            padding: "0 6px",
                            transform: "translate(50%, -50%)",
                          }}
                        >
                          &times;
                        </button>
                      </div>
                    )}
                  </div>


                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCloseModal}
                    >
                      Close
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {editMode ? "Update Blog" : "Add Blog"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </Layout>
  );
};

export default Testominal;
