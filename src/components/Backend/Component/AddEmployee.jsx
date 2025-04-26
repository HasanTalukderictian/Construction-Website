import Layout from "./Layout";
import Footer from "../Footer";
import DashNav from "./DashNav";
import { useEffect, useState } from "react";

const AddEmployee = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [status, setStatus] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [designation, setDesignation] = useState("");
  const [department, setDepartment] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert("Image exceeds the 2MB size limit.");
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const formDataToJson = (formData) => {
    const json = {};
    formData.forEach((value, key) => {
      if (key === "image" && value instanceof File) {
        json[key] = {
          name: value.name,
          type: value.type,
          size: value.size,
        };
      } else {
        json[key] = value;
      }
    });
    console.log("FormData as JSON:", JSON.stringify(json, null, 2));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("employee_id", employeeId);
    formData.append("employee_name", employeeName);
    formData.append("status", status);
    formData.append("joining_date", joiningDate);
    formData.append("designation", designation);
    formData.append("department", department);
    formData.append("contact_no", contactNo);
    formData.append("image", image);

    // Debug output
    formDataToJson(formData);

    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/add-employee", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          // Content-Type is NOT needed for FormData
        },
      });

      const result = await response.json();
      console.log("Server Response:", result);
      alert("Employee added successfully!");

      // Reset the form fields here
      setEmployeeId("");
      setEmployeeName("");
      setStatus("");
      setJoiningDate("");
      setDesignation("");
      setDepartment("");
      setContactNo("");
      setImage(null);
      setImagePreview(null);

    } catch (error) {
      console.error("API Error:", error);
      alert("Failed to add employee.");
    }
};


  return (
    <Layout>
      <DashNav />
      <div className="container mt-4">
        <form onSubmit={handleSubmit}>
          <div className="d-flex gap-3">
            <div className="mb-3 flex-fill">
              <label htmlFor="employeeId" className="form-label fs-5">Employee ID</label>
              <input
                type="text"
                className="form-control"
                id="employeeId"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                required
              />
            </div>

            <div className="mb-3 flex-fill">
              <label htmlFor="employeeName" className="form-label fs-5">Employee Name</label>
              <input
                type="text"
                className="form-control"
                id="employeeName"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                required
              />
            </div>

            <div className="mb-3 flex-fill">
              <label className="form-label fs-5">Employee Status</label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value="">Select status</option>
                <option value="Active">Active</option>
                <option value="Deactive">Deactive</option>
              </select>
            </div>
          </div>

          <div className="d-flex gap-3">
            <div className="mb-3 flex-fill">
              <label htmlFor="joiningDate" className="form-label fs-5">Joining Date</label>
              <input
                type="date"
                className="form-control"
                id="joiningDate"
                value={joiningDate}
                onChange={(e) => setJoiningDate(e.target.value)}
                required
              />
            </div>

            <div className="mb-3 flex-fill">
              <label htmlFor="designation" className="form-label fs-5">Designation</label>
              <input
                type="text"
                className="form-control"
                id="designation"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="d-flex gap-3">
            <div className="mb-3 flex-fill">
              <label htmlFor="department" className="form-label fs-5">Department</label>
              <input
                type="text"
                className="form-control"
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
              />
            </div>

            <div className="mb-3 flex-fill">
              <label htmlFor="contactNo" className="form-label fs-5">CONTACT NO.</label>
              <input
                type="tel"
                className="form-control"
                id="contactNo"
                value={contactNo}
                onChange={(e) => {
                  const onlyNums = e.target.value.replace(/[^0-9]/g, "");
                  if (onlyNums.length <= 11) setContactNo(onlyNums);
                }}
                maxLength={11}
                required
              />
            </div>
          </div>

          <div className="d-flex gap-3 align-items-center mb-3">
            <label htmlFor="image" className="form-label fs-5">Photo</label>
            <input
              type="file"
              name="image"
              id="image"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>

          {imagePreview && (
            <div className="mt-3 position-relative d-inline-block">
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={handleRemoveImage}
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  zIndex: 2,
                  borderRadius: "50%",
                }}
              >
                X
              </button>
              <img
                src={imagePreview}
                alt="Selected"
                className="img-fluid"
                style={{
                  maxWidth: "200px",
                  maxHeight: "200px",
                  borderRadius: "10px",
                }}
              />
            </div>
          )}

          <div className="mt-4">
            <button type="submit" className="btn btn-primary w-100">
              Submit
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </Layout>
  );
};

export default AddEmployee;
