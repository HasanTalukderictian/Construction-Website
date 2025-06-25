import { useState, useEffect } from "react";
import Layout from "./Layout";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import Footer from "../Footer";
import DashNav from "./DashNav";

const Fortfilo = () => {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage] = useState(5); // Number of items per page
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [Name, setName] = useState("");
  const [Designation, setDesignation] = useState("");
  const [socialMediaLink, setSocialMediaLink] = useState("");
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [blogToEdit, setBlogToEdit] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/get-team`);
        if (!response.ok) throw new Error("Failed to fetch team data.");
        const result = await response.json();
        const updatedBlogs = result.data.map((blog) => ({
          ...blog,
          image: blog.image
            ? `http://127.0.0.1:8000/storage/${blog.image}`
            : null,
        }));
        setBlogs(updatedBlogs);
      } catch (error) {
        console.error("Error fetching team data:", error.message);
        alert("Failed to load team data. Please try again later.");
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
      setName(blog.Name);
      setDesignation(blog.Designation);
      setSocialMediaLink(blog.socialMediaLink || "");
      setImage(null);
      setEditMode(true);
      setBlogToEdit(blog.id);
    } else {
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
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("Name", Name);
    formData.append("Designation", Designation);
    formData.append("socialMediaLink", socialMediaLink);
    if (image) formData.append("image", image);

    try {
      setIsLoading(true);
      let response;
      if (editMode) {
        response = await fetch(
          `http://127.0.0.1:8000/api/edit-team/${blogToEdit}`,
          {
            method: "POST",
            body: formData,
          }
        );
      } else {
        response = await fetch(`http://127.0.0.1:8000/api/add-team`, {
          method: "POST",
          body: formData,
        });
      }

      const result = await response.json();

      if (response.ok) {
        if (editMode) {
          setBlogs(
            blogs.map((blog) =>
              blog.id === blogToEdit ? { ...result.data, id: blogToEdit } : blog
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
      console.error("Error submitting form:", error.message);
      alert("Failed to submit the form. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/del-team/${id}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        setBlogs(blogs.filter((blog) => blog.id !== id));
      } else {
        console.error("Failed to delete the blog");
      }
    } catch (error) {
      console.error("Error deleting blog:", error.message);
      alert("Failed to delete team member. Please try again.");
    }
  };

  // Pagination logic
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  return (
    <Layout>
      <DashNav />
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
              <th className="text-center fs-3">No</th>
              <th className="text-center fs-3">Name</th>
              <th className="text-center fs-3">Designation</th>
              <th className="text-center fs-3">Picture</th>
              <th className="text-center fs-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentBlogs.map((blog, index) => (
              <tr className="text-center" key={blog.id}>
                <td>{indexOfFirstBlog + index + 1}</td>
                <td className="text-center fw-bold">{blog.Name}</td>
                <td className="text-center fw-bold" dangerouslySetInnerHTML={{ __html: blog.Designation }} />
                <td>
                  {blog.image && (
                    <img
                      src={blog.image}
                      alt={blog.Name}
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
                    onClick={() => handleDelete(blog.id)}
                  >
                    <i className="bi bi-trash"></i> {/* Delete Icon */}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {/* <nav>
          <ul className="pagination justify-content-center">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li
                key={page}
                className={`page-item ${
                  currentPage === page ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => paginate(page)}
                >
                  {page}
                </button>
              </li>
            ))}
          </ul>
        </nav> */}

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

        {/* Modal */}
        {showModal && (
          <div className="modal show d-block" tabIndex="-1">
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
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className={`form-control ${errors.Name ? "is-invalid" : ""
                          }`}
                        value={Name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      {errors.Name && (
                        <div className="invalid-feedback">{errors.Name}</div>
                      )}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Designation</label>
                      <ReactQuill
                        value={Designation}
                        onChange={(value) => setDesignation(value)}
                      />
                      {errors.Designation && (
                        <div className="text-danger">
                          {errors.Designation}
                        </div>
                      )}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Social Media Link</label>
                      <input
                        type="text"
                        className="form-control"
                        value={socialMediaLink}
                        onChange={(e) => setSocialMediaLink(e.target.value)}
                      />
                    </div>


                    {/* <div className="mb-3">
                      <label className="form-label">Picture</label>
                      <input
                        type="file"
                        className="form-control"
                        onChange={(e) => setImage(e.target.files[0])}
                      />
                      {errors.image && (
                        <div className="text-danger">{errors.image}</div>
                      )}
                    </div>
                
*/}



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

                  </div>



                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCloseModal}
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isLoading}
                    >
                      {isLoading ? "Saving..." : "Save"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </Layout>
  );
};

export default Fortfilo;


