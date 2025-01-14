import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import Layout from "../Layout";

const Project = () => {
  const [blogs, setBlogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Form fields state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [text, setText] = useState(""); // Updated input field
  const [image, setImage] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/get-projects");
        const result = await response.json();

        // Update blogs with image URLs
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
      setTitle(blog.title);
      setDescription(blog.description);
      setText(blog.text || ""); // Populate text if editing
      setImage(null);
      setEditMode(true);
      setBlogToDelete(blog.id);
    } else {
      setTitle("");
      setDescription("");
      setText("");
      setImage(null);
      setEditMode(false);
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
    setText("");
    setImage(null);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) newErrors.title = "Title is required.";
    if (!description.trim()) newErrors.description = "Description is required.";
    if (!text.trim()) newErrors.text = "Text is required.";
    if (image && !["image/png", "image/jpeg"].includes(image.type)) {
      newErrors.image = "Only PNG or JPEG images are allowed.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("text", text);
    if (image) {
      formData.append("image", image);
    }

    try {
      let response;
      if (editMode) {
        response = await fetch(
          `http://127.0.0.1:8000/api/edit-projects/${blogToDelete}`,
          {
            method: "POST",
            body: formData,
          }
        );
      } else {
        response = await fetch("http://127.0.0.1:8000/api/add-projects", {
          method: "POST",
          body: formData,
        });
      }

      const result = await response.json();

      if (response.ok) {
        if (editMode) {
          setBlogs(
            blogs.map((blog) => (blog.id === blogToDelete ? result : blog))
          );
        } else {
          setBlogs([...blogs, result]);
        }
        handleCloseModal();
      } else {
        setErrors(result.errors || {});
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  const deleteBlog = async (id) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/del-projects/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setBlogs(blogs.filter((blog) => blog.id !== id));
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
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Project Page</h2>
          <button
            className="btn btn-success"
            onClick={() => handleShowModal()}
          >
            + Add Project
          </button>
        </div>

        <table className="table table-bordered border-2">
          <thead className="thead-dark">
            <tr>
              <th className="text-center border border-dark">No</th>
              <th className="text-center border border-dark">Title</th>
              <th className="text-center border border-dark">Description</th>
              <th className="text-center border border-dark">Text</th>
              <th className="text-center border border-dark">Picture</th>
              <th className="text-center border border-dark">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.length > 0 ? (
              blogs.map((blog, index) => (
                <tr key={blog.id} className="border border-dark">
                  <td className="text-center border border-dark">{index + 1}</td>
                  <td className="border border-dark">{blog.title}</td>
                  <div
                    className="form-control"
                    style={{
                      overflowY: "auto",
                      maxHeight: "100px",
                    }}
                    dangerouslySetInnerHTML={{ __html: blog.description }}
                  ></div>
                  <td className="border border-dark">{blog.text}</td>
                  <td className="border border-dark">
                    {blog.image && (
                      <img
                        src={blog.image}
                        className="img-fluid"
                        style={{ width: "100px", height: "auto" }}
                      />
                    )}
                  </td>

                  <td className="border border-dark mx-2">
                    <button
                      className="btn btn-outline-secondary mx-3"
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
                <td colSpan="6" className="text-center border border-dark">
                  No blogs available.
                </td>
              </tr>
            )}
          </tbody>
        </table>

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
                        required
                      />
                      {errors.title && (
                        <small className="text-danger">{errors.title}</small>
                      )}
                    </div>

                    {/* Text Field */}
                    <div className="form-group">
                      <label htmlFor="text">Text</label>
                      <input
                        type="text"
                        className="form-control"
                        id="text"
                        placeholder="Enter text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        required
                      />
                      {errors.text && (
                        <small className="text-danger">{errors.text}</small>
                      )}
                    </div>

                    {/* Description Field */}
                    <div className="form-group">
                      <label htmlFor="description">Description</label>
                      <ReactQuill
                        value={description}
                        onChange={setDescription}
                        theme="snow"
                        placeholder="Enter blog description"
                        style={{ height: '200px' }} // Set height here
                      />
                      {errors.description && (
                        <small className="text-danger">
                          {errors.description}
                        </small>
                      )}
                    </div>

                    {/* Image Upload Field */}
                    <div className="form-group mt-5">
                      <label htmlFor="image">Image</label>
                      <input
                        type="file"
                        className="form-control-file mt-2"
                        id="image"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                      />
                      {errors.image && (
                        <small className="text-danger">{errors.image}</small>
                      )}
                    </div>

                    {/* Buttons */}
                    <div className="d-flex justify-content-between mt-4">
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

        {/* Delete Confirmation Dialog */}
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
    </Layout>
  );
};

export default Project;
