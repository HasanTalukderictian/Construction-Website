import { useState, useEffect } from "react";
import Layout from "./Layout";
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-quill/dist/quill.snow.css';
import ReactQuill from "react-quill";
import Footer from "../Footer";
import axios from "axios";

import '../../../assets/css/common.scss';
import DashNav from "./DashNav";

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

  const [images, setImages] = useState([]);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const BASE_URL = import.meta.env.VITE_BASE_URL;



  //image preview start

  const [imagePreviews, setImagePreviews] = useState([]);


  const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute("content");

  useEffect(() => {
    // Cleanup object URLs on component unmount
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);


  / handle image upload function start/

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter((file) => file.size <= MAX_FILE_SIZE);

    if (validFiles.length < files.length) {
      alert("Some files exceed the 2MB size limit and were not added.");
    }

    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    setImages((prev) => [...prev, ...validFiles]);
  };


  / handle image upload function end /

  // Remove an image by index
  const handleRemoveImage = (index) => {
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    const newImages = images.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);
    setImages(newImages);
  };

  //image preview end


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/get-blogs`);
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

    // Check if images array is populated before appending
    if (images && images.length > 0) {
      images.forEach((image) => {
        formData.append("image[]", image);
      });
    } else {
      console.log("No images to upload.");
      return;
    }

    try {
      const response = await axios.post(
        editMode
          ? `${BASE_URL}/edit-blog/${blogToDelete}`
          : `${BASE_URL}/api/blogs`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-CSRF-TOKEN": csrfToken, // CSRF Token
          },
        }
      );
      setErrors(response.data.errors || {});

      if (response.status === 201) {
        const result = response.data;
        if (editMode) {
          setBlogs(blogs.map((blog) => (blog.id === blogToDelete ? result : blog)));
        } else {
          setBlogs([...blogs, result]);
        }
        handleCloseModal();
      } else {
        // Log errors if response status is not 200
        setErrors(response.data.errors || {});
        console.error("Failed to save the blog:", response.data);
      }
    } catch (error) {
      console.error("Error submitting the form:", error.response.data);
    }
  };




  const deleteBlog = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/api/delete-blog/${id}`, {
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
    <DashNav/>
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Blogs Page</h2>
          <button className="btn btn-success" onClick={() => handleShowModal()}>
            + Add Blog
          </button>
        </div>

        <table className="table" style={{
        border: '5px solid rgb(185, 176, 176)', // 4px solid border with the specified color
        borderRadius: '4px',         // Rounded corners with a 4px radius
    }}>
          <thead className="thead-dark" style={{  border: '5px solid rgb(185, 176, 176)', // 4px solid border with the specified color
        borderRadius: '4px', }}> 
            <tr className="border" style={{  border: '5px solid rgb(185, 176, 176)', // 4px solid border with the specified color
        borderRadius: '4px', }} >
              <th className="text-center border border-dark fs-3" >No</th>
              <th className="text-center border border-dark fs-3">Title</th>
              <th className="text-center border border-dark fs-3">Description</th>
              <th className="text-center border border-dark fs-3">Picture</th>
              <th className="text-center border border-dark fs-3">Actions</th>
            </tr>
          </thead>
          <tbody >
            {currentBlogs.length > 0 ? (
              currentBlogs.map((blog, index) => (
                <tr key={blog.id} className="border border-dark">
                  <td className="text-center border border-dark" >{index + 1}</td>
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
                      Array.isArray(blog.image)
                        ? blog.image.map((img, index) => (
                          <img
                            key={index}
                            src={`${img.replace(/^blogs\//, '')}`}
                            className="img-fluid"
                            style={{ width: "80px", height: "80px", marginRight: "5px" }}
                            alt={`Image ${index + 1}`}
                          />
                        ))
                        : typeof blog.image === 'string' && blog.image.startsWith('[')
                          ? JSON.parse(blog.image).map((img, index) => (
                            <img
                              key={index}
                              src={`${img.replace(/^blogs\//, '')}`}
                              className="img-fluid"
                              style={{ width: "80px", height: "80px", marginRight: "5px" }}
                              alt={`Image ${index + 1}`}
                            />
                          ))
                          : (
                            <img
                              src={`${blog.image.replace(/^blogs\//, '')}`}
                              className="img-fluid"
                              style={{ width: "80px", height: "80px" }}
                              alt="Blog image"
                            />
                          )
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
        <div>

        </div>
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

      <input type="file" onChange={handleImageUpload} />

      {/* showmadal functionality */}

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
                  <input type="hidden" name="_token" value={csrfToken} />
                  <div className="form-group">
                    <label htmlFor="title" className="fs-2">Title</label>
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
                    <label htmlFor="description" className="fs-2">Description</label>
                    <ReactQuill
                      value={description}
                      onChange={setDescription}
                      theme="snow"
                    />
                    {errors.description && (
                      <small className="text-danger">{errors.description}</small>
                    )}
                  </div>

                  {/* Image Input Field */}
                  <div className="form-group">
                    <label htmlFor="image" className="fs-2">
                      Images
                    </label>
                    <input
                      type="file"
                      name="image[]"
                      className="form-control"
                      id="image"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                    />
                    {errors.images && (
                      <small className="text-danger">{errors.images}</small>
                    )}
                  </div>

                  {/* Image Previews */}
                  <div className="d-flex flex-wrap mt-3 gap-3">
                    {imagePreviews.map((preview, index) => (
                      <div
                        key={index}
                        style={{
                          position: "relative",
                          display: "inline-block",
                        }}
                      >
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            zIndex: 2,
                            borderRadius: "50%",
                          }}
                          onClick={() => handleRemoveImage(index)}
                        >
                          X
                        </button>
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="img-fluid"
                          style={{
                            maxWidth: "200px",
                            maxHeight: "200px",
                            borderRadius: "10px",
                            marginRight: "10px",
                          }}
                        />
                      </div>
                    ))}


                    {/* Submit Buttons */}
                    <div>
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
                    </div>
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
