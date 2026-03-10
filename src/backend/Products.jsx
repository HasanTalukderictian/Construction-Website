import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import DashNav from "./DasNav";
import Footer from "./Footer";
import axios from "axios";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import '../assets/css/Price.scss';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import imageCompression from 'browser-image-compression';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const API_BASE = import.meta.env.VITE_API_BASE_URL;
export const STORE_BASE = import.meta.env.VITE_API_STORAGE_URL;

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

  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const [editingProductId, setEditingProductId] = useState(null);

  // Category/SubCategory states
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [subCategoryId, setSubCategoryId] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/get-products`);
      const data = res.data.data || res.data;
      const formatted = data.map(product => ({
        ...product,
        images: product.images?.map(img =>
          typeof img === "string"
            ? img
            : `${STORE_BASE}/${img.image_path}`
        )
      }));
      setProducts(formatted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  useEffect(() => {
    fetchProducts();
    axios.get(`${API_BASE}/all-category`)
      .then(res => {
        if (res.data.success) setCategories(res.data.data);
      })
      .catch(() => toast.error("Failed to fetch categories"));
  }, []);

  // Update subcategories
  useEffect(() => {
    if (categoryId) {
      const cat = categories.find(c => c.id === parseInt(categoryId));
      setSubCategories(cat?.sub_categories || []);
      setSubCategoryId("");
    }
  }, [categoryId, categories]);

  // Reset form
  const resetForm = () => {
    setEditingProductId(null);
    setProductName("");
    setPrice("");
    setRating("");
    setQuantity("");
    setDescription("");
    setCategoryId("");
    setSubCategoryId("");
    setImageFiles([]);
    setPreviews([]);
  };

  // Image upload & preview
  const handleImageChange = async (e) => {
  const files = Array.from(e.target.files);
  const compressedFiles = [...imageFiles]; // keep old uploaded files
  const previewUrls = [...previews]; // keep old previews

  for (let file of files) {
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true
      });
      compressedFiles.push(compressed);
      previewUrls.push(URL.createObjectURL(compressed));
    } catch {
      compressedFiles.push(file);
      previewUrls.push(URL.createObjectURL(file));
    }
  }

  setImageFiles(compressedFiles);
  setPreviews(previewUrls);
};

  // Remove single image
  const removeImage = (index) => {
    const newFiles = [...imageFiles];
    const newPreviews = [...previews];
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    setImageFiles(newFiles);
    setPreviews(newPreviews);
  };

  // Submit product
  const submitProduct = async () => {
    if (!productName || !price || !quantity || !categoryId || !subCategoryId) {
      toast.error("Please fill all required fields!");
      return;
    }

    const formData = new FormData();
    formData.append("name", productName);
    formData.append("price", price);
    formData.append("rating", rating || "");
    formData.append("quantity", quantity);
    formData.append("description", description || "");
    formData.append("parent_category_id", categoryId);
    formData.append("sub_category_id", subCategoryId);
    imageFiles.forEach(file => formData.append("images[]", file));

    try {
      if (editingProductId) {
        await axios.post(`${API_BASE}/update-products/${editingProductId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Product updated successfully!");
      } else {
        await axios.post(`${API_BASE}/add-products`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Product saved successfully!");
      }
      fetchProducts();
      resetForm();
      setShowModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Network error!");
    }
  };

  // Edit product
  const handleEdit = (product) => {
    setEditingProductId(product.id);
    setProductName(product.name);
    setPrice(product.price);
    setRating(product.rating);
    setQuantity(product.quantity);
    setDescription(product.description || "");
    setCategoryId(product.parent_category_id?.toString() || "");
    setSubCategoryId(product.sub_category_id?.toString() || "");
    setImageFiles([]);
    setPreviews(product.images || []);
    setShowModal(true);
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${API_BASE}/products-del/${id}`);
      fetchProducts();
      toast.success("Product deleted successfully!");
    } catch {
      toast.error("Failed to delete product!");
    }
  };

  // Pagination & filtering
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToPage = (page) => setCurrentPage(page);

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
                  />
                  <i className="bi bi-search" style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}></i>
                </div>
                <button className="btn btn-success mb-2" onClick={() => { resetForm(); setShowModal(true); }}>Upload Product</button>
              </div>
            </div>

            {/* Product Table */}
            <table className="table table-bordered table-striped custom-product-table">
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
                {loading ? <tr><td colSpan="9" className="text-center">Loading...</td></tr> :
                  filteredProducts.length === 0 ? <tr><td colSpan="9" className="text-center text-danger">No Products Found</td></tr> :
                    currentProducts.map((p, idx) => (
                      <tr key={p.id}>
                        <td>{indexOfFirstItem + idx + 1}</td>
                        <td>{p.images && p.images.length > 0 ? <img src={p.images[0]} width="60" height="60" style={{ objectFit: "cover", borderRadius: "5px" }} /> : "No Image"}</td>
                        <td>{p.name}</td>
                        <td>{p.price}৳</td>
                        <td>{p.rating}</td>
                        <td>{p.quantity}</td>
                        <td className="text-center">
                          <button className="btn btn-warning btn-sm me-1" onClick={() => handleEdit(p)}><i className="bi bi-pencil"></i></button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}><i className="bi bi-trash"></i></button>
                        </td>
                      </tr>
                    ))
                }
              </tbody>
            </table>

            {/* Pagination */}
            <nav>
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}><button className="page-link" onClick={prevPage}><BsChevronLeft /> Prev</button></li>
                {Array.from({ length: totalPages }, (_, i) => (
                  <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}><button className="page-link" onClick={() => goToPage(i + 1)}>{i + 1}</button></li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}><button className="page-link" onClick={nextPage}>Next <BsChevronRight /></button></li>
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
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Category</label>
                    <select className="form-select" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">SubCategory</label>
                    <select className="form-select" value={subCategoryId} onChange={(e) => setSubCategoryId(e.target.value)}>
                      <option value="">Select SubCategory</option>
                      {subCategories.map(sc => <option key={sc.id} value={sc.id}>{sc.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <ReactQuill theme="snow" value={description} onChange={setDescription} placeholder="Write product description..." />
                </div>
                <div className="mb-3">
                  <label className="form-label">Product Image</label>
                  <input type="file" className="form-control" multiple accept="image/*" onChange={handleImageChange} />
                </div>
                {previews.length > 0 && (
                  <div className="d-flex flex-wrap gap-2">
                    {previews.map((img, index) => (
                      <div key={index} className="position-relative">
                        <img src={img} width="120" height="120" style={{ objectFit: "cover", borderRadius: "10px", border: "1px solid #ccc" }} />
                        <button onClick={() => removeImage(index)} style={{ position: "absolute", top: "-8px", right: "-8px", background: "red", color: "#fff", border: "none", width: "22px", height: "22px", borderRadius: "50%" }}>×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-danger" onClick={() => { setShowModal(false); resetForm(); }}>Close</button>
                <button className="btn btn-success" onClick={submitProduct}>{editingProductId ? "Update Product" : "Save Product"}</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </Layout>
  );
};

export default Products;