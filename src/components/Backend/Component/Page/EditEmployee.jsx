import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "../Layout";
import DashNav from "../DashNav";
import Footer from "../../Footer";

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [employee, setEmployee] = useState({
    employee_id: "",
    employee_name: "",
    status: "Active",
    joining_date: "",
    designation: "",
    department: "",
    contact_no: "",
  });

  const [image, setImage] = useState(null);

  const fetchEmployee = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/view-employee/${id}`);
      const result = await res.json();
      setEmployee(result.data);
    } catch (error) {
      alert("Failed to fetch employee.");
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(employee).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await fetch(`${BASE_URL}/api/edit-employee/${id}`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Update failed");

      alert("Employee updated successfully!");
      navigate("/admin/employee");
    } catch (err) {
      alert("Error updating employee: " + err.message);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  return (
    <Layout>
      <DashNav />
      <div className="container mt-5">
        <h3>Edit Employee</h3>
        <form onSubmit={handleUpdate} encType="multipart/form-data">
           <div className="row">
           <div className="mb-3 col-md-4">
            <label>Employee ID</label>
            <input
              type="text"
              name="employee_id"
              className="form-control"
              value={employee.employee_id}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3 col-md-4">
            <label>Name</label>
            <input
              type="text"
              name="employee_name"
              className="form-control"
              value={employee.employee_name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-3 col-md-4">
            <label>Status</label>
            <select
              name="status"
              className="form-control"
              value={employee.status}
              onChange={handleChange}
              required
            >
              <option value="Active">Active</option>
              <option value="Deactive">Deactive</option>
            </select>
          </div>
           </div>

         
         <div className="row">
               
         <div className="mb-3 col-md-4">
            <label>Joining Date</label>
            <input
              type="date"
              name="joining_date"
              className="form-control"
              value={employee.joining_date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3 col-md-4">
            <label>Designation</label>
            <input
              type="text"
              name="designation"
              className="form-control"
              value={employee.designation}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3 col-md-4">
            <label>Department</label>
            <input
              type="text"
              name="department"
              className="form-control"
              value={employee.department}
              onChange={handleChange}
              required
            />
          </div>
         </div>
        
          <div className="mb-3">
            <label>Phone</label>
            <input
              type="text"
              name="contact_no"
              className="form-control"
              value={employee.contact_no}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label>Image</label>
            <input
              type="file"
              name="image"
              className="form-control"
              onChange={handleImageChange}
              accept="image/*"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Update
          </button>
        </form>
      </div>
      <Footer />
    </Layout>
  );
};

export default EditEmployee;
