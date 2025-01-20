import { useState, useEffect } from "react";
import Layout from "./Layout";
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-quill/dist/quill.snow.css';
import ReactQuill from "react-quill";
import Footer from "../Footer";

const BackendBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false); // State to toggle edit mode

  // Form fields state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [showDialog, setShowDialog] = useState(false); // State for dialog visibility
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [errors, setErrors] = useState({});

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/get-blogs");
        const result = await response.json();

        console.log(result);

        // Access the "data" property and update image URLs
        const updatedBlogs = result.data.map((blog) => ({
          ...blog,
          image: blog.image
            ? `http://127.0.0.1:8000/storage/${blog.image}`
            : null,
        }));

        setBlogs(updatedBlogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchData();
  }, []);

  const handleShowModal = (blog = null) => {
    if (blog) {
      // If we are editing, populate the form with the blog data
      setTitle(blog.title);
      setDescription(blog.description);
      setImage(null); // Set to null so image won't be shown if not updated
      setEditMode(true); // Toggle to edit mode
      setBlogToDelete(blog.id); // Set the ID of the blog for editing
    } else {
      // If adding a new blog, reset form fields
      setTitle("");
      setDescription("");
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
    setTitle("");
    setDescription("");
    setImage(null);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) newErrors.title = "Title is required.";
    if (!description.trim()) newErrors.description = "Description is required.";
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
    formData.append("title", title);
    formData.append("description", description);
    if (image) {
      formData.append("image", image);
    }

    try {
      let response;
      if (editMode) {
        // Edit blog
        response = await fetch(`http://127.0.0.1:8000/api/edit-blog/${blogToDelete}`, {
          method: "POST",
          body: formData,
        });
      } else {
        // Add new blog
        response = await fetch("http://127.0.0.1:8000/api/blogs", {
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
      const response = await fetch(`http://127.0.0.1:8000/api/delete-blog/${id}`, {
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

  // Pagination logic
  const indexOfLastBlog = currentPage * itemsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - itemsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(blogs.length / itemsPerPage);

  return (
    <Layout>
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Blogs Page</h2>
          <button className="btn btn-success" onClick={() => handleShowModal()}>
            + Add Blog
          </button>
        </div>

        <table className="table table-bordered border-2">
          <thead className="thead-dark">
            <tr>
              <th className="text-center border border-dark fs-3">No</th>
              <th className="text-center border border-dark fs-3">Title</th>
              <th className="text-center border border-dark fs-3">Description</th>
              <th className="text-center border border-dark fs-3">Picture</th>
              <th className="text-center border border-dark fs-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentBlogs.length > 0 ? (
              currentBlogs.map((blog, index) => (
                <tr key={blog.id} className="border border-dark">
                  <td className="text-center border border-dark">{index + 1}</td>
                  <td className="border border-dark">{blog.title}</td>
                  <td className="border border-dark">
                    <div
                      className="form-control"
                      style={{
                        overflowY: "auto",
                        maxHeight: "100px",
                      }}
                      dangerouslySetInnerHTML={{ __html: blog.description }}
                    ></div>
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
                      className="btn btn-outline-secondary mb-2"
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

        {/* Pagination */}
        <div className="d-flex justify-content-center mt-4">
          <button
            className="btn btn-secondary"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={`btn btn-outline-secondary mx-2 ${currentPage === index + 1 ? 'active' : ''}`}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          <button
            className="btn btn-secondary"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>

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
                  {/* Title Field */}
                  <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      placeholder="Enter blog title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                    {errors.title && (
                      <small className="text-danger">{errors.title}</small>
                    )}
                  </div>

                  {/* Description Field */}
                  <div className="form-group mt-3">
                    <label htmlFor="description">Description</label>
                    <ReactQuill
                      value={description}
                      onChange={setDescription}
                      theme="snow"
                    />
                    {errors.description && (
                      <small className="text-danger">{errors.description}</small>
                    )}
                  </div>

                  {/* Image Field */}
                  <div className="form-group mt-3">
                    <label htmlFor="image">Image</label>
                    <input
                      type="file"
                      className="form-control"
                      id="image"
                      onChange={(e) => setImage(e.target.files[0])}
                    />
                    {errors.image && (
                      <small className="text-danger">{errors.image}</small>
                    )}
                  </div>

                  {/* Submit Buttons */}
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCloseModal}
                    >
                      Close
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {editMode ? "Save Changes" : "Add Blog"}
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

export default BackendBlogs;
