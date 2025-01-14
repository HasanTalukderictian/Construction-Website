import { useState, useEffect } from "react";
import Layout from "./Layout";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";

const Fortfilo = () => {
  const [blogs, setBlogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false); // State to toggle edit mode

  // Form fields state
  const [Name, setName] = useState("");
  const [Designation, setDesignation] = useState("");
  const [socialMediaLink, setSocialMediaLink] = useState("");
  const [image, setImage] = useState(null);
  const [showDialog, setShowDialog] = useState(false); // State for dialog visibility
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/get-team");
        const result = await response.json();

        // Update blogs with proper image URLs
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
      setName(blog.Name);
      setDesignation(blog.Designation);
      setSocialMediaLink(blog.socialMediaLink || "");
      setImage(null); // Image is not updated unless specified
      setEditMode(true);
      setBlogToDelete(blog.id);
    } else {
      // Reset form fields for adding a new blog
      resetForm();
      setEditMode(false);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setDesignation("");
    setSocialMediaLink("");
    setImage(null);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!Name.trim()) newErrors.Name = "Name is required.";
    if (!Designation.trim()) newErrors.Designation = "Designation is required.";
    if (image && !["image/png", "image/jpeg"].includes(image.type)) {
      newErrors.image = "Only PNG or JPEG images are allowed.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page

    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("Name", Name);
    formData.append("Designation", Designation);
    formData.append("socialMediaLink", socialMediaLink);
    if (image) formData.append("image", image);

    try {
      let response;
      if (editMode) {
        response = await fetch(
          `http://127.0.0.1:8000/api/edit-team/${blogToDelete}`,
          {
            method: "POST",
            body: formData,
          }
        );
      } else {
        response = await fetch("http://127.0.0.1:8000/api/add-team", {
          method: "POST",
          body: formData,
        });
      }

      const result = await response.json();

      if (response.ok) {
        if (editMode) {
          setBlogs(
            blogs.map((blog) =>
              blog.id === blogToDelete ? result.data : blog
            )
          );
        } else {
          setBlogs([...blogs, result.data]);
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
        `http://127.0.0.1:8000/api/del-team/${id}`,
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
          <h2>Our Team</h2>
          <button
            className="btn btn-success"
            onClick={() => handleShowModal()}
          >
            + Add Team Member
          </button>
        </div>

        <table className="table table-bordered border-2">
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Designation</th>
              <th>Picture</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog, index) => (
              <tr key={blog.id}>
                <td>{index + 1}</td>
                <td>{blog.Name}</td>
                <td dangerouslySetInnerHTML={{ __html: blog.Designation }} />
                <td>
                  {blog.image && (
                    <img
                      src={blog.image}
                      alt={blog.Name}
                      style={{ width: "100px" }}
                    />
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => handleShowModal(blog)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteClick(blog.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showModal && (
          <div className="modal show" style={{ display: "block" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editMode ? "Edit Team Member" : "Add Team Member"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseModal}
                  ></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={Name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      {errors.Name && (
                        <small className="text-danger">{errors.Name}</small>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Designation</label>
                      <ReactQuill
                        value={Designation}
                        onChange={setDesignation}
                      />
                      {errors.Designation && (
                        <small className="text-danger">
                          {errors.Designation}
                        </small>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Social Media Link</label>
                      <input
                        type="text"
                        className="form-control"
                        value={socialMediaLink}
                        onChange={(e) => setSocialMediaLink(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Image</label>
                      <input
                        type="file"
                        className="form-control"
                        onChange={(e) => setImage(e.target.files[0])}
                      />
                      {errors.image && (
                        <small className="text-danger">{errors.image}</small>
                      )}
                    </div>

                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        {editMode ? "Update" : "Submit"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {showDialog && (
          <div className="modal show" style={{ display: "block" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-body">
                  <p>Are you sure you want to delete?</p>
                </div>
                <div className="modal-footer">
                  <button onClick={closeDialog}
                  className="btn btn-warning">Cancel</button>
                  <button
                    onClick={() => deleteBlog(blogToDelete)}
                    className="btn btn-danger"
                  >
                    Delete
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

export default Fortfilo;
