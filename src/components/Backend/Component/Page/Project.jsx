import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import Layout from "../Layout";
import Footer from "../../Footer";
import DashNav from "../DashNav";

const Project = () => {
  const [blogs, setBlogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

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
        const response = await fetch(`${BASE_URL}/api/get-projects`);
        const result = await response.json();

        // Update blogs with image URLs
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
          `${BASE_URL}/api/edit-projects/${blogToDelete}`,
          {
            method: "POST",
            body: formData,
          }
        );
      } else {
        response = await fetch(`${BASE_URL}/api/add-projects`, {
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
        `${BASE_URL}/api/del-projects/${id}`,
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
      <DashNav />
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
              <th className="text-center border border-dark fs-3">No</th>
              <th className="text-center border border-dark fs-3">Title</th>
              <th className="text-center border border-dark fs-3">Description</th>
              <th className="text-center border border-dark fs-3">Text</th>
              <th className="text-center border border-dark fs-3">Picture</th>
              <th className="text-center border border-dark fs-3">Actions</th>
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
                        style={{ width: "80px", height: "80px" }}
                      />
                    )}
                  </td>

                  <td className="border border-dark mx-2">
                    <button
                      className="btn btn-outline-secondary mx-3 mb-2"
                      onClick={() => handleShowModal(blog)}
                    >
                      <i className="bi bi-pencil-square"></i> {/* Edit Icon */}
                    </button>
                    <button
                      className="btn btn-danger mx-3"
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

                    <div className="mt-5">
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
      <Footer />
    </Layout>
  );
};

export default Project;
