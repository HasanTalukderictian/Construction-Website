import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Footer from "./Footer";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashNav from "./DasNav";

const Banner = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // Fetch data
  const fetchData = () => {
    axios
      .get("http://127.0.0.1:8000/api/get-banner")
      .then((res) => {
        if (res.data.status) setData(res.data.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
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

    // file input reset করার জন্য
    const fileInput = document.getElementById("bannerImageInput");
    if (fileInput) {
      fileInput.value = "";
    }
  };
  const resetForm = () => {
    setTitle("");
    setPrice("");
    setImage(null);
    setPreview(null);
  };

  // Submit Banner
  const submitBanner = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("price", price);
    if (image) formData.append("image", image);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/add-banner",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.status) {
        fetchData();
        setShowModal(false);
        resetForm();
        toast.success("Banner added successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add banner.");
    }
  };

  // Delete
  const deleteBanner = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;

    try {
      const res = await axios.delete(
        `http://127.0.0.1:8000/api/del-banner/${id}`
      );
      if (res.data.status) {
        fetchData();
        toast.success("Banner deleted successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete banner.");
    }
  };

  return (
    <Layout>
      <div className="d-flex">
        <div className="flex-grow-1">
          <DashNav />

          <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3>Banner List</h3>
              <button
                className="btn btn-success"
                onClick={() => setShowModal(true)}
              >
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
                      <th>Title</th>
                      <th>Price</th>
                      <th>Image</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.length > 0 ? (
                      data.map((item) => (
                        <tr key={item.id}>
                          <td>{item.title}</td>
                          <td>{item.price}</td>
                          <td>
                            {item.image && (
                              <img
                                src={item.image}
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
                              onClick={() => deleteBanner(item.id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">
                          No Data Found
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
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Banner</h5>
                <button
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                ></button>
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Price</label>
                  <input
                    type="text"
                    className="form-control"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Image</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={handleImageChange}
                  />
                </div>
                <td>
                  {preview && (
                    <div className="position-relative mt-3 d-inline-block">
                      <img
                        src={preview}
                        width="120"
                        height="120"
                        style={{
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: "1px solid #ddd",
                        }}
                        alt="Preview"
                      />

                      <button
                        type="button"
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
                          fontSize: "14px",
                        }}
                      >
                        ×
                      </button>
                    </div>
                  )}

                </td>

                
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
                <button className="btn btn-success" onClick={submitBanner}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </Layout>
  );
};

export default Banner;