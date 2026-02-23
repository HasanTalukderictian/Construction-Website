import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import DashNav from "./DasNav";
import Footer from "./Footer";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { BsPencil, BsTrash } from "react-icons/bs";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");
  const [parentCategoryId, setParentCategoryId] = useState("");

  // ===============================
  // Fetch Parent Categories & SubCategories
  // ===============================
  const fetchCategories = () => {
    axios
      .get("http://127.0.0.1:8000/api/all-category")
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
    axios
      .post("http://127.0.0.1:8000/api/parent-category/store", { name: categoryName })
      .then((res) => {
        toast.success(res.data.message || "Parent Category created!");
        setCategoryName("");
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
      .post("http://127.0.0.1:8000/api/sub-category/store", {
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
      axios.delete(`http://127.0.0.1:8000/api/delete-parent-category/${id}`)
        .then(() => {
          toast.success("Category deleted!");
          fetchCategories();
        })
        .catch(() => toast.error("Failed to delete category"));
    }
  };

  const handleDeleteSubCategory = (id) => {
    if (window.confirm("Are you sure you want to delete this subcategory?")) {
      axios.delete(`http://127.0.0.1:8000/api/delete-sub-category/${id}`)
        .then(() => {
          toast.success("SubCategory deleted!");
          fetchCategories();
        })
        .catch(() => toast.error("Failed to delete subcategory"));
    }
  };

  return (
    <Layout>
      <div className="d-flex">
        <div className="flex-grow-1">
          <DashNav />
          <div className="container mt-4">

            <div className="row g-4">

              {/* ==================== Parent Category Form ==================== */}
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
                  <button type="submit" className="btn btn-success">Submit</button>
                </form>
              </div>

              {/* ==================== SubCategory Form ==================== */}
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

            {/* ==================== Tables Side by Side ==================== */}
            <div className="row mt-5 g-4">

              {/* Category Table */}
              <div className="col-md-6">
                <h5>Categories</h5>
                <div className="table-responsive shadow-sm">
                  <table className="table table-bordered table-striped text-center">
                    <thead className="table-dark">
                      <tr>
                        <th>#</th>
                        <th>Category</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.length > 0 ? categories.map((cat, idx) => (
                        <tr key={cat.id}>
                          <td>{idx + 1}</td>
                          <td>{cat.name}</td>
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
              </div>

              {/* SubCategory Table */}
              <div className="col-md-6">
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
                      {categories.length > 0 ? (
                        categories.flatMap((cat) =>
                          cat.sub_categories && cat.sub_categories.length > 0
                            ? cat.sub_categories.map((sub, subIdx) => (
                              <tr key={sub.id}>
                                <td>{subIdx + 1}</td>
                                <td>{sub.name}</td>
                                <td>{cat.name}</td>
                                <td>
                                
                                  <button className="btn btn-sm btn-danger" title="Delete" onClick={() => handleDeleteSubCategory(sub.id)}>
                                    <BsTrash />
                                  </button>
                                </td>
                              </tr>
                            )) : []
                        )
                      ) : (
                        <tr><td colSpan="4">No subcategories found</td></tr>
                      )}
                    </tbody>
                  </table>
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