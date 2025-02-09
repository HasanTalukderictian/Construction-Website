import { useState, useEffect } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import 'react-quill/dist/quill.snow.css';
import ReactQuill from "react-quill";
import Layout from "../Layout";
import Footer from '../../../Backend/Footer.jsx';
import DashNav from "../DashNav.jsx";

const AboutUs = () => {
  const [blogs, setBlogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false); // State to toggle edit mode

  // Form fields state
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [showDialog, setShowDialog] = useState(false); // State for dialog visibility
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/about");
        const result = await response.json();

        console.log(result);

        // Access the "data" property and update image URLs
        const updatedBlogs = result.data.map((blog) => ({
          ...blog,
          imageUrl: blog.imageUrl
            ? `http://127.0.0.1:8000/storage/${blog.imageUrl}`
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
      setHeading(blog.heading);
      setDescription(blog.description);
      setImageUrl(null); // Set to null so image won't be shown if not updated
      setEditMode(true); // Toggle to edit mode
      setBlogToDelete(blog.id); // Set the ID of the blog for editing
    } else {
      // If adding a new blog, reset form fields
      setHeading("");
      setDescription("");
      setImageUrl(null);
      setEditMode(false); // Toggle to add mode
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setHeading("");
    setDescription("");
    setImageUrl(null);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    if (!heading.trim()) newErrors.heading = "Heading is required.";
    if (!description.trim()) newErrors.description = "Description is required.";
    if (imageUrl && !["image/png", "image/jpeg"].includes(imageUrl.type)) {
      newErrors.imageUrl = "Only PNG or JPEG images are allowed.";
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
    formData.append("heading", heading);
    formData.append("description", description);
    if (imageUrl) {
      formData.append("imageUrl", imageUrl);
    }

    try {
      let response;
      if (editMode) {
        // Edit blog
        response = await fetch(`http://127.0.0.1:8000/api/edit-about/${blogToDelete}`, {
          method: "POST",
          body: formData,
        });
      } else {
        // Add new blog
        response = await fetch("http://127.0.0.1:8000/api/add-about", {
          method: "POST",
          body: formData,
        });

        console.log(response);
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
      const response = await fetch(`http://127.0.0.1:8000/api/del-about/${id}`, {
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
    <DashNav/>
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>About Page</h2>
          <button className="btn btn-success" onClick={() => handleShowModal()}>
            + Add Banner
          </button>
        </div>

        <table className="table table-bordered border-2">
          <thead className="thead-dark">
            <tr>
              <th className="text-center border border-dark fs-3">No</th>
              <th className="text-center border border-dark fs-3">Heading</th>
              <th className="text-center border border-dark fs-3">Description</th>
              <th className="text-center border border-dark fs-3">Image</th>
              <th className="text-center border border-dark fs-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.length > 0 ? (
              blogs.map((blog, index) => (
                <tr key={blog.id} className="border border-dark">
                  <td className="text-center border border-dark">{index + 1}</td>
                  <td className="border border-dark">{blog.heading}</td>
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
                    {blog.imageUrl && (
                      <img
                        src={blog.imageUrl}
                        className="img-fluid"
                        style={{ width: "100px", height: "auto" }}
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
                  {/* Heading Field */}
                  <div className="form-group">
                    <label htmlFor="heading">Heading</label>
                    <input
                      type="text"
                      className="form-control"
                      id="heading"
                      placeholder="Enter blog heading"
                      value={heading}
                      onChange={(e) => setHeading(e.target.value)}
                      style={{ height: '50px' }}
                      required
                    />
                    {errors.heading && <small className="text-danger">{errors.heading}</small>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <ReactQuill
                      value={description}
                      onChange={setDescription}
                      theme="snow"
                      placeholder="Enter blog description"
                      style={{ height: '200px' }} // Set height here
                    />
                  </div>

                  {/* Image Upload Field */}
                  <div className="form-group mt-5">
                    <label htmlFor="imageUrl">Image </label>
                    <input
                      type="file"
                      className="form-control-file mt-2 mb-3 mx-2"
                      id="imageUrl"
                      accept="image/*"
                      onChange={(e) => setImageUrl(e.target.files[0])}
                    />
                    {errors.imageUrl && <small className="text-danger">{errors.imageUrl}</small>}
                  </div>

                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                      Close
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save Blog
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer/>
      
    </Layout>
  );
};

export default AboutUs;
