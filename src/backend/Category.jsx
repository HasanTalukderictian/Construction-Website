import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import DashNav from "./DasNav";
import Footer from "./Footer";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { BsTrash, BsArrowLeft, BsArrowRight, BsPlus, BsFolder, BsFolderPlus } from "react-icons/bs";

export const API_BASE = import.meta.env.VITE_API_BASE_URL;

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");
  const [parentCategoryId, setParentCategoryId] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [subLoading, setSubLoading] = useState(false);

  // Pagination state
  const [categoryPage, setCategoryPage] = useState(1);
  const [subCategoryPage, setSubCategoryPage] = useState(1);
  const itemsPerPage = 8;

  // Fetch Parent Categories & SubCategories
  const fetchCategories = () => {
    axios
      .get(`${API_BASE}/all-category`)
      .then((res) => {
        if (res.data.success) {
          setCategories(res.data.data);
        }
      })
      .catch(() => toast.error("Failed to fetch categories"));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Submit Parent Category
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      toast.error("Please enter category name!");
      return;
    }
    
    setLoading(true);
    const formData = new FormData();
    formData.append("name", categoryName);
    if (categoryImage) {
      formData.append("image", categoryImage);
    }

    try {
      const res = await axios.post(`${API_BASE}/parent-category/store`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(res.data.message || "Parent Category created!");
      setCategoryName("");
      setCategoryImage(null);
      // Reset file input
      const fileInput = document.getElementById("categoryImage");
      if (fileInput) fileInput.value = "";
      fetchCategories();
    } catch (err) {
      toast.error("Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  // Submit SubCategory
  const handleSubCategorySubmit = async (e) => {
    e.preventDefault();
    if (!parentCategoryId) {
      toast.error("Please select a parent category!");
      return;
    }
    if (!subCategoryName.trim()) {
      toast.error("Please enter subcategory name!");
      return;
    }

    setSubLoading(true);
    try {
      await axios.post(`${API_BASE}/sub-category/store`, {
        name: subCategoryName,
        parent_category_id: parentCategoryId,
      });
      toast.success("SubCategory created!");
      setSubCategoryName("");
      setParentCategoryId("");
      fetchCategories();
    } catch (err) {
      toast.error("Failed to create subcategory");
    } finally {
      setSubLoading(false);
    }
  };

  // Handle Delete
  const handleDeleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await axios.delete(`${API_BASE}/delete-parent-category/${id}`);
        toast.success("Category deleted!");
        fetchCategories();
      } catch (err) {
        toast.error("Failed to delete category");
      }
    }
  };

  const handleDeleteSubCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this subcategory?")) {
      try {
        await axios.delete(`${API_BASE}/delete-sub-category/${id}`);
        toast.success("SubCategory deleted!");
        fetchCategories();
      } catch (err) {
        toast.error("Failed to delete subcategory");
      }
    }
  };

  // Pagination logic
  const paginatedCategories = categories.slice(
    (categoryPage - 1) * itemsPerPage,
    categoryPage * itemsPerPage
  );

  const allSubCategories = categories.flatMap(cat =>
    cat.sub_categories?.map(sub => ({ ...sub, parent_name: cat.name })) || []
  );

  const paginatedSubCategories = allSubCategories.slice(
    (subCategoryPage - 1) * itemsPerPage,
    subCategoryPage * itemsPerPage
  );

  const categoryTotalPages = Math.ceil(categories.length / itemsPerPage);
  const subCategoryTotalPages = Math.ceil(allSubCategories.length / itemsPerPage);

  return (
    <Layout>
      <div className="d-flex">
        <div className="flex-grow-1">
          <DashNav />

          <div className="container-fluid px-4 py-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h3 className="mb-1 fw-bold" style={{ color: "#2c3e50" }}>
                  <BsFolder className="me-2 text-success" /> Category Management
                </h3>
                <p className="text-muted mb-0">Manage your product categories and subcategories</p>
              </div>
            </div>

            {/* Forms Section */}
            <div className="row g-4 mb-5">
              {/* Parent Category Form */}
              <div className="col-md-6">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-header bg-white border-0 pt-4 pb-0">
                    <h5 className="mb-0 fw-semibold">
                      <BsFolderPlus className="me-2 text-success" /> Add New Category
                    </h5>
                    <p className="text-muted small">Create a main product category</p>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleCategorySubmit}>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Category Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter category name (e.g., Electronics, Fashion)"
                          value={categoryName}
                          onChange={(e) => setCategoryName(e.target.value)}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-semibold">Category Image</label>
                        <input
                          type="file"
                          id="categoryImage"
                          className="form-control"
                          accept="image/*"
                          onChange={(e) => setCategoryImage(e.target.files[0])}
                        />
                        <small className="text-muted">Optional: Upload a category image</small>
                      </div>

                      <button 
                        type="submit" 
                        className="btn btn-success w-100"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Creating...
                          </>
                        ) : (
                          <>
                            <BsPlus className="me-1" /> Create Category
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              </div>

              {/* SubCategory Form */}
              <div className="col-md-6">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-header bg-white border-0 pt-4 pb-0">
                    <h5 className="mb-0 fw-semibold">
                      <BsFolderPlus className="me-2 text-info" /> Add New Subcategory
                    </h5>
                    <p className="text-muted small">Create a subcategory under a parent category</p>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleSubCategorySubmit}>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Parent Category</label>
                        <select
                          className="form-select"
                          value={parentCategoryId}
                          onChange={(e) => setParentCategoryId(e.target.value)}
                          required
                        >
                          <option value="">Select Parent Category</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-semibold">Subcategory Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter subcategory name (e.g., Mobile, Laptop)"
                          value={subCategoryName}
                          onChange={(e) => setSubCategoryName(e.target.value)}
                          required
                        />
                      </div>

                      <button 
                        type="submit" 
                        className="btn btn-info w-100 text-white"
                        disabled={subLoading}
                      >
                        {subLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Creating...
                          </>
                        ) : (
                          <>
                            <BsPlus className="me-1" /> Create Subcategory
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            {/* Tables Section */}
            <div className="row g-4">
              {/* Category Table */}
              <div className="col-md-6">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-white">
                    <h5 className="mb-0 fw-semibold">
                      <BsFolder className="me-2 text-success" /> Categories List
                    </h5>
                  </div>
                  <div className="card-body p-0">
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead className="table-light">
                          <tr>
                            <th style={{ width: "60px" }}>#</th>
                            <th>Category Name</th>
                            <th style={{ width: "80px" }}>Image</th>
                            <th style={{ width: "80px" }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedCategories.length > 0 ? (
                            paginatedCategories.map((cat, idx) => (
                              <tr key={cat.id}>
                                <td>{(categoryPage - 1) * itemsPerPage + idx + 1}</td>
                                <td className="fw-semibold">{cat.name}</td>
                                <td>
                                  {cat.image_url ? (
                                    <img
                                      src={cat.image_url}
                                      alt={cat.name}
                                      className="rounded"
                                      style={{ width: "40px", height: "40px", objectFit: "cover" }}
                                    />
                                  ) : (
                                    <span className="text-muted">—</span>
                                  )}
                                </td>
                                <td>
                                  <button 
                                    className="btn btn-sm btn-outline-danger rounded-circle"
                                    title="Delete Category"
                                    onClick={() => handleDeleteCategory(cat.id)}
                                  >
                                    <BsTrash size={14} />
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="4" className="text-center py-4 text-muted">
                                No categories found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {categoryTotalPages > 1 && (
                    <div className="card-footer bg-white">
                      <div className="d-flex justify-content-center align-items-center gap-3">
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          disabled={categoryPage === 1}
                          onClick={() => setCategoryPage(prev => prev - 1)}
                        >
                          <BsArrowLeft /> Prev
                        </button>
                        <span className="small">
                          Page {categoryPage} of {categoryTotalPages}
                        </span>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          disabled={categoryPage === categoryTotalPages}
                          onClick={() => setCategoryPage(prev => prev + 1)}
                        >
                          Next <BsArrowRight />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* SubCategory Table */}
              <div className="col-md-6">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-white">
                    <h5 className="mb-0 fw-semibold">
                      <BsFolder className="me-2 text-info" /> Subcategories List
                    </h5>
                  </div>
                  <div className="card-body p-0">
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead className="table-light">
                          <tr>
                            <th style={{ width: "60px" }}>#</th>
                            <th>Subcategory Name</th>
                            <th>Parent Category</th>
                            <th style={{ width: "80px" }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedSubCategories.length > 0 ? (
                            paginatedSubCategories.map((sub, idx) => (
                              <tr key={sub.id}>
                                <td>{(subCategoryPage - 1) * itemsPerPage + idx + 1}</td>
                                <td className="fw-semibold">{sub.name}</td>
                                <td>
                                  <span className="badge bg-success bg-opacity-10 text-success">
                                    {sub.parent_name}
                                  </span>
                                </td>
                                <td>
                                  <button 
                                    className="btn btn-sm btn-outline-danger rounded-circle"
                                    title="Delete Subcategory"
                                    onClick={() => handleDeleteSubCategory(sub.id)}
                                  >
                                    <BsTrash size={14} />
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="4" className="text-center py-4 text-muted">
                                No subcategories found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {subCategoryTotalPages > 1 && (
                    <div className="card-footer bg-white">
                      <div className="d-flex justify-content-center align-items-center gap-3">
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          disabled={subCategoryPage === 1}
                          onClick={() => setSubCategoryPage(prev => prev - 1)}
                        >
                          <BsArrowLeft /> Prev
                        </button>
                        <span className="small">
                          Page {subCategoryPage} of {subCategoryTotalPages}
                        </span>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          disabled={subCategoryPage === subCategoryTotalPages}
                          onClick={() => setSubCategoryPage(prev => prev + 1)}
                        >
                          Next <BsArrowRight />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Footer />
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Layout>
  );
};

export default Category;