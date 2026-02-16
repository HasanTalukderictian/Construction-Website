import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import DashNav from "./DasNav";
import Footer from "./Footer";
import axios from "axios";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import '../assets/css/Price.scss';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import imageCompression from 'browser-image-compression'; // <-- added

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Form States
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [rating, setRating] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Fetch products from API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/products");
      setProducts(res.data.data || res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Reset form helper
  const resetForm = () => {
    setEditingProductId(null);
    setProductName("");
    setPrice("");
    setRating("");
    setQuantity("");
    setDescription("");
    setImageFile(null);
    setPreview(null);
  };

  // Image preview & optimization
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Compress image (max 1MB, max width/height 1024px)
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true
      };
      const compressedFile = await imageCompression(file, options);

      setImageFile(compressedFile);
      setPreview(URL.createObjectURL(compressedFile));
    } catch (err) {
      console.error("Image compression error:", err);
      setImageFile(file); // fallback to original
      setPreview(URL.createObjectURL(file));
    }
  };

  const removePreview = () => {
    setImageFile(null);
    setPreview(null);
  };

  // Pagination & Filtering
  const filteredProducts = products.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const goToPage = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // Delete Product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/products-del/${id}`);
      setProducts((prev) => prev.filter((item) => item.id !== id));
      alert("Product deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete product!");
    }
  };

  // Open Modal for Edit
  const handleEdit = (product) => {
    setEditingProductId(product.id);
    setProductName(product.name);
    setPrice(product.price);
    setRating(product.rating);
    setQuantity(product.quantity);
    setDescription(product.description || "");
    setPreview(product.image_url || null);
    setShowModal(true);
  };

  // Open Modal for Upload (Reset form)
  const handleUpload = () => {
    resetForm();
    setShowModal(true);
  };

  // Submit Product (Add or Edit)
  const submitProduct = async () => {
    if (!productName || !price || !quantity) {
      alert("Please fill required fields!");
      return;
    }

    const formData = new FormData();
    formData.append("name", productName);
    formData.append("price", price);
    formData.append("rating", rating || "");
    formData.append("quantity", quantity);
    formData.append("description", description || "");
    if (imageFile) formData.append("image", imageFile);

    try {
      if (editingProductId) {
        await axios.post(
          `http://127.0.0.1:8000/api/products-update/${editingProductId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        alert("Product updated successfully!");
      } else {
        await axios.post(
          "http://127.0.0.1:8000/api/products-add",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        alert("Product saved successfully!");
      }

      await fetchProducts();
      resetForm();
      setShowModal(false);
    } catch (err) {
      console.error("Network error:", err.response?.data || err);
      alert("Network error or validation failed!");
    }
  };

  return (
    <Layout>
      <div className="d-flex">
        <div className="flex-grow-1">
          <DashNav />
          <div className="container mt-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
              <h2>Product List</h2>
              <div className="d-flex align-items-center flex-wrap">
                <div style={{ position: "relative", width: "250px", marginRight: "15px" }}>
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="form-control"
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    style={{ paddingRight: "35px" }}
                  />
                  <i className="bi bi-search" style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    color: "#555",
                    fontSize: "1.1rem",
                  }} onClick={() => setCurrentPage(1)}></i>
                </div>

                <button className="btn btn-primary mb-2" onClick={handleUpload} style={{ height: "35px", padding: "0 12px" }}>
                  Upload Product
                </button>
              </div>
            </div>

            {/* Product Table */}
            <table className="table table-bordered table-striped custom-product-table" style={{ tableLayout: "fixed", width: "100%" }}>
              <thead className="table-dark">
                <tr>
                  <th>SL</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Rating</th>
                  <th>Quantity</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" className="text-center">Loading...</td></tr>
                ) : filteredProducts.length === 0 ? (
                  <tr><td colSpan="7" className="text-center text-danger">No Products Found</td></tr>
                ) : (
                  currentProducts.map((item, index) => (
                    <tr key={item.id}>
                      <td>{indexOfFirstItem + index + 1}</td>
                      <td>{item.image_url ? <img src={item.image_url} width="60" height="60" style={{ objectFit: "cover", borderRadius: "5px" }} alt={item.name} /> : "No Image"}</td>
                      <td>{item.name}</td>
                      <td>{item.price}৳</td>
                      <td>{item.rating}</td>
                      <td>{item.quantity}</td>
                      <td className="text-center">
                        <button onClick={() => handleEdit(item)} className="btn btn-warning btn-sm me-1" title="Edit Product" style={{ padding: "4px 8px" }}>
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="btn btn-danger btn-sm" title="Delete Product" style={{ padding: "4px 8px" }}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <nav>
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={prevPage}><BsChevronLeft size={18} /> Prev</button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => (
                  <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                    <button className="page-link" onClick={() => goToPage(i + 1)}>{i + 1}</button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button className="page-link" onClick={nextPage}>Next <BsChevronRight size={18} /></button>
                </li>
              </ul>
            </nav>
          </div>

          <Footer />
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingProductId ? "Edit Product" : "Upload New Product"}</h5>
                <button className="btn-close" onClick={() => { setShowModal(false); resetForm(); }}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Product Name</label>
                    <input type="text" className="form-control" value={productName} onChange={(e) => setProductName(e.target.value)} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Price</label>
                    <input type="number" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Rating</label>
                    <input type="number" className="form-control" value={rating} onChange={(e) => setRating(e.target.value)} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Quantity</label>
                    <input type="number" className="form-control" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <ReactQuill
                    theme="snow"
                    value={description}
                    onChange={setDescription}
                    placeholder="Write product description here..."
                    modules={{
                      toolbar: [
                        [{ header: [1, 2, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        ['link', 'image', 'code-block'],
                        ['clean']
                      ]
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Product Image</label>
                  <input type="file" className="form-control" onChange={handleImageChange} />
                </div>
                {preview && (
                  <div className="position-relative d-inline-block">
                    <img src={preview} width="140" height="140" style={{ objectFit: "cover", borderRadius: "10px", border: "1px solid #ccc" }} alt="Preview" />
                    <button onClick={removePreview} style={{
                      position: "absolute", top: "-8px", right: "-8px", background: "red",
                      color: "#fff", border: "none", width: "22px", height: "22px", borderRadius: "50%",
                      cursor: "pointer", fontSize: "14px", lineHeight: "20px", textAlign: "center"
                    }}>×</button>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-success"
                  style={{ backgroundColor: '#ebb434', borderColor: '#ebb434' }}
                  onClick={() => { setShowModal(false); resetForm(); }}
                >
                  Close
                </button>
                <button
                  className="btn btn-success"
                  onClick={submitProduct}
                >
                  {editingProductId ? "Update Product" : "Save Product"}
                </button>

              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Products;
