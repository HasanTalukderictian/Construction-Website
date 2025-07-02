import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "./Layout";
import Footer from "../Footer";
import DashNav from "./DashNav";

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `${BASE_URL}/api/get-employee`;
      if (searchQuery.trim()) {
        url += `?search=${encodeURIComponent(searchQuery)}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch data");

      const result = await response.json();
      const employeeData = result.data;
      setEmployees(Array.isArray(employeeData) ? employeeData : []);
      setCurrentPage(1); // Reset to first page on new fetch
    } catch (error) {
      setError(error.message);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [searchQuery]);

  const handleEdit = (id) => {
    navigate(`/admin/edit-employee/${id}`);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You are not authorized. Please log in again.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        const response = await fetch(`${BASE_URL}/api/del-employee/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Delete failed");
        fetchEmployees();
      } catch (error) {
        alert("Delete failed: " + error.message);
      }
    }
  };

  const handleSearch = () => {
    setSearchQuery(searchTerm.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleView = (id) => {
    navigate(`/admin/view-employee/${id}`);
  };

  // Pagination handlers
  const totalPages = Math.ceil(employees.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handlePageClick = (pageNum) => {
    setCurrentPage(pageNum);
  };

  // Get current page data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = employees.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <Layout>
      <DashNav />
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <input
            type="text"
            className="form-control w-30"
            placeholder="Search by ID or name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="btn btn-sm btn-primary ms-2" onClick={handleSearch}>
            <i className="bi bi-search me-1"></i>
          </button>
          <Link to="/admin/add-employee">
            <button className="btn btn-sm btn-success ms-2">Add Employee</button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center my-4">Loading...</div>
        ) : error ? (
          <div className="text-danger">Error: {error}</div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-bordered table-striped">
                <thead className="table-dark">
                  <tr>
                    <th className="text-center">Employee ID</th>
                    <th className="text-center">Name</th>
                    <th className="text-center">Phone</th>
                    <th className="text-center">Designation</th>
                    <th className="text-center">Action</th>
                    <th className="text-center">Image</th>
                  </tr>
                </thead>
                <tbody>
                  {currentEmployees.length > 0 ? (
                    currentEmployees.map((employee) => (
                      <tr key={employee.id}>
                        <td className="text-center">{employee.employee_id}</td>
                        <td className="text-center">{employee.employee_name}</td>
                        <td className="text-center">{employee.contact_no}</td>
                        <td className="text-center">{employee.designation}</td>
                        <td className="text-center">
                          <div className="d-flex justify-content-center">
                            <button
                              className="btn btn-sm btn-primary me-2"
                              style={{
                                paddingTop: "2px",
                                paddingBottom: "2px",
                                background: "#0c9568",
                                borderColor: "#0c9568",
                              }}
                              onClick={() => handleView(employee.id)}
                            >
                              <i className="bi bi-eye fs-5 me-1"></i> View
                            </button>

                            <button
                              className="btn btn-sm btn-primary me-2"
                              style={{
                                paddingTop: "2px",
                                paddingBottom: "2px",
                                background: "#5f0c95",
                                borderColor: "#5f0c95",
                              }}
                              onClick={() => handleEdit(employee.id)}
                            >
                              <i className="bi bi-pencil fs-5 me-1"></i> Edit
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(employee.id)}
                            >
                              <i className="bi bi-trash fs-5 me-1"></i> Delete
                            </button>
                          </div>
                        </td>
                        <td className="text-center">
                          {employee.image ? (
                            <img
                              src={`${BASE_URL}/storage/${employee.image}`}
                              alt={employee.employee_name}
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            "No Image"
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No employees found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-center mt-3">
              <nav>
                <ul className="pagination">
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button className="page-link" onClick={handlePrevPage}>
                      &laquo; Prev
                    </button>
                  </li>

                  {Array.from({ length: totalPages }, (_, i) => (
                    <li
                      key={i + 1}
                      className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageClick(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}

                  <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                    <button className="page-link" onClick={handleNextPage}>
                      Next &raquo;
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </>
        )}
      </div>
      <Footer />
    </Layout>
  );
};

export default Employee;
