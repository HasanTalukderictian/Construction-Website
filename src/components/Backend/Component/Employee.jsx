// Employee.jsx
import Layout from "./Layout";
import Footer from "../Footer";
import DashNav from "./DashNav";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = "http://127.0.0.1:8000/api/get-employee";
      if (searchQuery.trim()) {
        url += `?search=${encodeURIComponent(searchQuery)}`;
      }
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch data");

      const result = await response.json();
      const employeeData = result.data;

      setEmployees(Array.isArray(employeeData) ? employeeData : []);
    } catch (error) {
      setError(error.message);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/edit-employee/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/del-employee/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Delete failed");
        fetchEmployees();
      } catch (error) {
        alert("Delete failed: " + error.message);
      }
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [searchQuery]);

  const handleSearch = () => {
    setSearchQuery(searchTerm.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

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
            <button className="btn btn-sm btn-success ms-2">Create New</button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center my-4">Loading...</div>
        ) : error ? (
          <div className="text-danger">Error: {error}</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <th className="text-center">Employee ID</th>
                  <th className="text-center">Name</th>
                  <th className="text-center">Phone</th>
                  <th className="text-center">Designation</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {employees.length > 0 ? (
                  employees.map((employee) => (
                    <tr key={employee.id}>
                      <td className="text-center">{employee.employee_id}</td>
                      <td className="text-center">{employee.employee_name}</td>
                      <td className="text-center">{employee.contact_no}</td>
                      <td className="text-center">{employee.designation}</td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center">
                          <button
                            className="btn btn-sm btn-primary me-2"
                            onClick={() => handleEdit(employee.id)}
                          >
                            <i className="bi bi-pencil me-1"></i> Edit
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(employee.id)}
                          >
                            <i className="bi bi-trash me-1"></i> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">No employees found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </Layout>
  );
};

export default Employee;
