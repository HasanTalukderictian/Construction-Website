import Layout from "./Layout";
import Footer from "../Footer";
import DashNav from "./DashNav";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);

    try {
      let url = "http://127.0.0.1:8000/api/get-employee";
      if (searchQuery.trim()) {
        url += `?search=${encodeURIComponent(searchQuery)}`;
      }

      console.log("Fetching:", url);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch data, status: " + response.status);
      }

      const result = await response.json();
      const employeeData = result.data;

      if (Array.isArray(employeeData)) {
        setEmployees(employeeData);
      } else {
        setEmployees([]);
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [searchQuery]);

  const handleSearch = () => {
    setSearchQuery(searchTerm.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Layout>
      <DashNav />
      <div className="container mt-4">
        <div className="d-flex justify-content-between mt-2 mb-2 align-items-center">
          <input
            type="text"
            className="form-control w-30"
            placeholder="Search by ID or name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="btn btn-sm btn-primary ms-2" onClick={handleSearch}>
            Search
          </button>
          <Link to="/admin/add-employee">
            <button className="btn btn-sm btn-success ms-2">Create New</button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center my-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
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
                  <th className="text-center">Address</th>
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
                          <button className="btn btn-sm btn-primary me-2">View</button>
                          <button className="btn btn-sm btn-primary me-2">Edit</button>
                          <button className="btn btn-sm btn-danger">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-danger">
                      {searchQuery ? "No employees found" : "No employee data available"}
                    </td>
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
