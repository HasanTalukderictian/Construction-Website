import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import DashNav from "../DashNav";
import Footer from "../../Footer";
import Layout from "../Layout";

const ViewEmployee = () => {
    const { id } = useParams();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const BASE_URL = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        const fetchEmployee = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${BASE_URL}/api/get-employee/${id}`);
                if (!response.ok) throw new Error("Failed to fetch employee data");

                const result = await response.json();
                setEmployee(result.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployee();
    }, [id]);

    return (
        <Layout>
            <DashNav />
            <div className="container my-4 p-3">
                <Link to="/admin/employee">
                    <button className="btn btn-sm btn-secondary mb-3">
                        <i className="bi bi-arrow-left fs-5 me-1"></i> Back
                    </button>
                </Link>

                {loading ? (
                    <div className="text-center my-5">Loading...</div>
                ) : error ? (
                    <div className="text-danger">Error: {error}</div>
                ) : employee ? (
                    <div className="card shadow-sm p-3">
                        <div className="card-header  text-center">
                            <h4 className="mb-0">Employee Details</h4>
                        </div>

                        <div className="card-body">
                            <div className="row g-4">
                                {/* Left Side - Image */}
                                <div
                                    className="col-12 col-md-6 text-center p-3"
                                    style={{
                                        backgroundColor: "#ffffff", // deep white background
                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // subtle shadow with blur and color
                                        borderRadius: "8px", // optional: rounded corners for modern look
                                    }}
                                >
                                    {employee.image ? (
                                        <img
                                            src={`${BASE_URL}/storage/${employee.image}`}
                                            alt={employee.employee_name}
                                            className="img-fluid rounded"
                                            style={{ maxHeight: "400px", objectFit: "cover" }}
                                        />
                                    ) : (
                                        <div className="text-muted">No Image Available</div>
                                    )}
                                </div>


                                {/* Right Side - Details */}
                                <div className="col-12 col-md-6 p-2">
                                    <p><strong>ID:</strong> {employee.employee_id}</p>
                                    <p><strong>Name:</strong> {employee.employee_name}</p>
                                    <p><strong>Phone:</strong> {employee.contact_no}</p>
                                    <p><strong>Designation:</strong> {employee.designation}</p>
                                    <p><strong>Email:</strong> {employee.email}</p>
                                    <p><strong>Address:</strong> {employee.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>No data found.</div>
                )}
            </div>
            <Footer />
        </Layout>
    );
};

export default ViewEmployee;
