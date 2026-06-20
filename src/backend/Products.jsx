import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import DashNav from "./DasNav";
import Footer from "./Footer";
import axios from "axios";
import { BsChevronLeft, BsChevronRight, BsSearch, BsPlus, BsPencil, BsTrash, BsImage } from "react-icons/bs";
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
    const compressedFiles = [...imageFiles];
    const previewUrls = [...previews];

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

  // Table styles
  const tableStyles = `
    .product-table-container {
      background: white;
      border-radius: 12px;
      overflow-x: auto;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .product-table {
      margin-bottom: 0;
      width: 100%;
    }
    .product-table thead th {
      background: #f8f9fa;
      color: #2c3e50;
      font-weight: 600;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 12px 8px;
      border-bottom: 2px solid #e9ecef;
      vertical-align: middle;
    }
    .product-table tbody td {
      padding: 12px 8px;
      vertical-align: middle;
      border-bottom: 1px solid #f0f0f0;
    }
    .product-table tbody tr:hover {
      background: #f8f9fa;
    }
    .product-img {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: 8px;
    }
    .product-name {
      font-weight: 500;
      color: #2c3e50;
    }
    .price-tag {
      color: #28a745;
      font-weight: 600;
    }
    .rating-badge {
      background: #ffc107;
      color: #000;
      padding: 3px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      display: inline-block;
    }
    .action-btns {
      display: flex;
      gap: 5px;
    }
    .btn-icon {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      cursor: pointer;
      border: none;
    }
    .btn-edit {
      background: #fff3cd;
      color: #856404;
      border: 1px solid #ffeeba;
    }
    .btn-edit:hover {
      background: #ffeaa7;
      color: #856404;
    }
    .btn-delete {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }
    .btn-delete:hover {
      background: #f1b0b7;
      color: #721c24;
    }
    .search-box {
      position: relative;
      width: 280px;
    }
    .search-box input {
      padding-right: 35px;
      border-radius: 20px;
      border: 1px solid #dee2e6;
    }
    .search-box input:focus {
      outline: none;
      border-color: #28a745;
    }
    .search-box .search-icon {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #adb5bd;
    }
    .btn-upload {
      background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
      border: none;
      padding: 8px 20px;
      border-radius: 25px;
      font-weight: 500;
      color: white;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .btn-upload:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(40,167,69,0.3);
    }
    @media (max-width: 768px) {
      .product-table thead th { font-size: 0.7rem; padding: 8px 4px; }
      .product-table tbody td { padding: 8px 4px; font-size: 0.8rem; }
      .product-img { width: 35px; height: 35px; }
      .btn-icon { width: 28px; height: 28px; }
      .action-btns { gap: 3px; }
      .search-box { width: 100%; }
    }
  `;

  return (
    <Layout>
      <style>{tableStyles}</style>
      <div className="d-flex">
        <div className="flex-grow-1">
          <DashNav />
          <div className="container mt-4">
            {/* Header Section */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
              <div>
                <h3 className="mb-1" style={{ color: '#2c3e50', fontWeight: '600' }}>Products Management</h3>
                <p className="text-muted mb-0 small">Manage your product inventory</p>
              </div>
              <div className="d-flex gap-3">
                <div className="search-box">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="form-control"
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  />
                  <BsSearch className="search-icon" />
                </div>
                <button 
                  className="btn-upload" 
                  onClick={() => { resetForm(); setShowModal(true); }}
                >
                  <BsPlus size={20} /> Upload Product
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="row mb-4">
              <div className="col-md-3 col-6 mb-2">
                <div className="bg-white p-3 rounded shadow-sm">
                  <small className="text-muted">Total Products</small>
                  <h4 className="mb-0">{products.length}</h4>
                </div>
              </div>
              <div className="col-md-3 col-6 mb-2">
                <div className="bg-white p-3 rounded shadow-sm">
                  <small className="text-muted">Low Stock</small>
                  <h4 className="mb-0 text-warning">{products.filter(p => p.quantity < 10).length}</h4>
                </div>
              </div>
            </div>

            {/* Product Table */}
            <div className="product-table-container">
              <table className="product-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>#</th>
                    <th style={{ width: '80px' }}>Image</th>
                    <th>Product Name</th>
                    <th style={{ width: '100px' }}>Price</th>
                    <th style={{ width: '80px' }}>Rating</th>
                    <th style={{ width: '100px' }}>Stock</th>
                    <th style={{ width: '100px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="7" className="text-center py-5">Loading products...</td></tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr><td colSpan="7" className="text-center py-5 text-muted">No products found</td></tr>
                  ) : (
                    currentProducts.map((p, idx) => (
                      <tr key={p.id}>
                        <td className="text-muted">{indexOfFirstItem + idx + 1}</td>
                        <td>
                          {p.images && p.images.length > 0 ? 
                            <img src={p.images[0]} className="product-img" alt={p.name} /> : 
                            <div className="product-img bg-light d-flex align-items-center justify-content-center"><BsImage color="#ccc" /></div>
                          }
                        </td>
                        <td><span className="product-name">{p.name}</span></td>
                        <td><span className="price-tag">৳{p.price}</span></td>
                        <td><span className="rating-badge">⭐ {p.reviews?.quality_rating || p.rating || 'N/A'}</span></td>
                        <td>
                          <span className={`badge ${p.quantity > 10 ? 'bg-success' : p.quantity > 0 ? 'bg-warning' : 'bg-danger'}`}>
                            {p.quantity} units
                          </span>
                        </td>
                        <td>
                          <div className="action-btns">
                            <button className="btn-icon btn-edit" onClick={() => handleEdit(p)} title="Edit">
                              <BsPencil size={14} />
                            </button>
                            <button className="btn-icon btn-delete" onClick={() => handleDelete(p.id)} title="Delete">
                              <BsTrash size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="mt-4">
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button className="page-link" onClick={prevPage}><BsChevronLeft /> Prev</button>
                  </li>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) pageNum = i + 1;
                    else if (currentPage <= 3) pageNum = i + 1;
                    else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                    else pageNum = currentPage - 2 + i;
                    
                    return (
                      <li key={pageNum} className={`page-item ${currentPage === pageNum ? "active" : ""}`}>
                        <button className="page-link" onClick={() => goToPage(pageNum)}>{pageNum}</button>
                      </li>
                    );
                  })}
                  <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                    <button className="page-link" onClick={nextPage}>Next <BsChevronRight /></button>
                  </li>
                </ul>
              </nav>
            )}

          </div>
          <Footer />
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingProductId ? "Edit Product" : "Upload New Product"}</h5>
                <button type="button" className="btn-close" onClick={() => { setShowModal(false); resetForm(); }}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Product Name <span className="text-danger">*</span></label>
                    <input type="text" className="form-control" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Enter product name" />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Price <span className="text-danger">*</span></label>
                    <input type="number" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Enter price" />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Rating</label>
                    <input type="number" step="0.1" className="form-control" value={rating} onChange={(e) => setRating(e.target.value)} placeholder="0-5" />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Quantity <span className="text-danger">*</span></label>
                    <input type="number" className="form-control" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Enter quantity" />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Category <span className="text-danger">*</span></label>
                    <select className="form-select" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">SubCategory <span className="text-danger">*</span></label>
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
                  <label className="form-label">Product Images</label>
                  <input type="file" className="form-control" multiple accept="image/*" onChange={handleImageChange} />
                  <small className="text-muted">You can select multiple images</small>
                </div>
                {previews.length > 0 && (
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    {previews.map((img, index) => (
                      <div key={index} className="position-relative">
                        <img src={img} width="80" height="80" style={{ objectFit: "cover", borderRadius: "8px", border: "1px solid #ddd" }} alt="Preview" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          style={{ position: "absolute", top: "-8px", right: "-8px", background: "red", color: "#fff", border: "none", width: "22px", height: "22px", borderRadius: "50%", fontSize: "14px", cursor: "pointer" }}
                        >×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); resetForm(); }}>Cancel</button>
                <button type="button" className="btn btn-success" onClick={submitProduct}>{editingProductId ? "Update Product" : "Save Product"}</button>
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