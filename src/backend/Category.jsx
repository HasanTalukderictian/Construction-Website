import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import DashNav from "./DasNav";
import Footer from "./Footer";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { BsTrash } from "react-icons/bs";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";

export const API_BASE = import.meta.env.VITE_API_BASE_URL;

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");
  const [parentCategoryId, setParentCategoryId] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);

  // Pagination state
  const [categoryPage, setCategoryPage] = useState(1);
  const [subCategoryPage, setSubCategoryPage] = useState(1);
  const itemsPerPage = 8;

  // ===============================
  // Fetch Parent Categories & SubCategories
  // ===============================
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

  // ===============================
  // Submit Parent Category
  // ===============================
  const handleCategorySubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", categoryName);
    if (categoryImage) {
      formData.append("image", categoryImage);
    }

    axios
      .post(`${API_BASE}/parent-category/store`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        toast.success(res.data.message || "Parent Category created!");
        setCategoryName("");
        setCategoryImage(null);
        fetchCategories();
      })
      .catch(() => toast.error("Failed to create category"));
  };

  // ===============================
  // Submit SubCategory
  // ===============================
  const handleSubCategorySubmit = (e) => {
    e.preventDefault();
    if (!parentCategoryId) {
      toast.error("Please select a parent category!");
      return;
    }
    axios
      .post(`${API_BASE}/sub-category/store`, {
        name: subCategoryName,
        parent_category_id: parentCategoryId,
      })
      .then(() => {
        toast.success("SubCategory created!");
        setSubCategoryName("");
        setParentCategoryId("");
        fetchCategories();
      })
      .catch(() => toast.error("Failed to create subcategory"));
  };

  // ===============================
  // Handle Delete
  // ===============================
  const handleDeleteCategory = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      axios.delete(`${API_BASE}/delete-parent-category/${id}`)
        .then(() => {
          toast.success("Category deleted!");
          fetchCategories();
        })
        .catch(() => toast.error("Failed to delete category"));
    }
  };

  const handleDeleteSubCategory = (id) => {
    if (window.confirm("Are you sure you want to delete this subcategory?")) {
      axios.delete(`${API_BASE}/delete-sub-category/${id}`)
        .then(() => {
          toast.success("SubCategory deleted!");
          fetchCategories();
        })
        .catch(() => toast.error("Failed to delete subcategory"));
    }
  };

  // ===============================
  // Pagination logic
  // ===============================
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
          <div className="container mt-4">

            <div className="row g-4">

              {/* Parent Category Form */}
              <div className="col-md-6">
                <form className="shadow p-4 rounded bg-light" onSubmit={handleCategorySubmit}>
                  <div className="mb-3">
                    <label htmlFor="category_name" className="form-label">Category</label>
                    <input
                      type="text"
                      id="category_name"
                      className="form-control"
                      placeholder="Enter Category"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Category Image</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) => setCategoryImage(e.target.files[0])}
                    />
                  </div>
                  <button type="submit" className="btn btn-success">Submit</button>
                </form>
              </div>

              {/* SubCategory Form */}
              <div className="col-md-6">
                <form className="shadow p-4 rounded bg-light" onSubmit={handleSubCategorySubmit}>
                  <div className="mb-3">
                    <label htmlFor="parent_category_id" className="form-label">Parent Category</label>
                    <select
                      id="parent_category_id"
                      className="form-select"
                      value={parentCategoryId}
                      onChange={(e) => setParentCategoryId(e.target.value)}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="subcategory_name" className="form-label">SubCategory</label>
                    <input
                      type="text"
                      id="subcategory_name"
                      className="form-control"
                      placeholder="Enter SubCategory"
                      value={subCategoryName}
                      onChange={(e) => setSubCategoryName(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-success">Submit</button>
                </form>
              </div>

            </div>

            {/* Tables Side by Side */}
            <div className="row mt-5 g-4">

              {/* Category Table */}
              <div className="col-md-6 d-flex flex-column">
                <h5>Categories</h5>
                <div className="table-responsive shadow-sm">
                  <table className="table table-bordered table-striped text-center">
                    <thead className="table-dark">
                      <tr>
                        <th>#</th>
                        <th>Category</th>
                       
                        <th>Image</th>
                         <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedCategories.length > 0 ? paginatedCategories.map((cat, idx) => (
                        <tr key={cat.id}>
                          <td>{(categoryPage - 1) * itemsPerPage + idx + 1}</td>
                          <td>{cat.name}</td>
                          <td>
                            {cat.image_url ? (
                              <img
                                src={cat.image_url}
                                alt={cat.name}
                                style={{ width: "50px", height: "50px", objectFit: "cover" }}
                              />
                            ) : "N/A"}
                          </td>
                          <td>
                            <button className="btn btn-sm btn-danger" title="Delete" onClick={() => handleDeleteCategory(cat.id)}>
                              <BsTrash />
                            </button>
                          </td>
                          
                        </tr>
                      )) : (
                        <tr><td colSpan="3">No categories found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {/* Pagination buttons for Category */}
                <div className="d-flex justify-content-center align-items-center mt-2">
                  <button
                    className="btn btn-sm btn-dark me-2"
                    disabled={categoryPage === 1}
                    onClick={() => setCategoryPage(prev => prev - 1)}
                    title="Previous Page"
                  >
                    <BsArrowLeft />
                  </button>

                  <span className="mx-2">
                    Page {categoryPage} of {categoryTotalPages}
                  </span>

                  <button
                    className="btn btn-sm btn-dark ms-2"
                    disabled={categoryPage === categoryTotalPages}
                    onClick={() => setCategoryPage(prev => prev + 1)}
                    title="Next Page"
                  >
                    <BsArrowRight />
                  </button>
                </div>
              </div>

              {/* SubCategory Table */}
              <div className="col-md-6 d-flex flex-column">
                <h5>SubCategories</h5>
                <div className="table-responsive shadow-sm">
                  <table className="table table-bordered table-striped text-center">
                    <thead className="table-dark">
                      <tr>
                        <th>#</th>
                        <th>SubCategory</th>
                        <th>Parent Category</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedSubCategories.length > 0 ? paginatedSubCategories.map((sub, idx) => (
                        <tr key={sub.id}>
                          <td>{(subCategoryPage - 1) * itemsPerPage + idx + 1}</td>
                          <td>{sub.name}</td>
                          <td>{sub.parent_name}</td>
                          <td>
                            <button className="btn btn-sm btn-danger" title="Delete" onClick={() => handleDeleteSubCategory(sub.id)}>
                              <BsTrash />
                            </button>
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan="4">No subcategories found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {/* Pagination buttons for SubCategory */}
                <div className="d-flex justify-content-center align-items-center mt-2">
                  <button
                    className="btn btn-sm btn-dark me-2"
                    disabled={subCategoryPage === 1}
                    onClick={() => setSubCategoryPage(prev => prev - 1)}
                    title="Previous Page"
                  >
                    <BsArrowLeft />
                  </button>

                  <span className="mx-2">
                    Page {subCategoryPage} of {subCategoryTotalPages}
                  </span>

                  <button
                    className="btn btn-sm btn-dark ms-2"
                    disabled={subCategoryPage === subCategoryTotalPages}
                    onClick={() => setSubCategoryPage(prev => prev + 1)}
                    title="Next Page"
                  >
                    <BsArrowRight />
                  </button>
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