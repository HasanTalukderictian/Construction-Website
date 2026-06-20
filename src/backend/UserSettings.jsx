import Layout from "../components/Layout";
import DashNav from "./DasNav";
import Footer from "./Footer";
import { useEffect, useState } from "react";
import { BsPeople, BsPlus, BsFilter, BsEye, BsEyeSlash, BsCheckCircle, BsXCircle, BsShieldCheck, BsEnvelope, BsLock, BsPerson } from "react-icons/bs";
import { FaSpinner } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const API_BASE = import.meta.env.VITE_API_BASE_URL;

const UserSettings = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [togglingId, setTogglingId] = useState(null);

    // pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 8;

    // form state
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState("admin");
    const [error, setError] = useState("");

    // fetch users
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE}/users`, {
                headers: {
                    "Accept": "application/json",
                    "Authorization": "Bearer " + JSON.parse(localStorage.getItem("adminUser"))?.token
                },
            });
            const data = await response.json();
            if (response.ok) {
                setUsers(data.users || []);
                setFilteredUsers(data.users || []);
            } else {
                console.error("Failed to fetch users", data);
                toast.error("Failed to fetch users");
            }
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // toggle active/inactive
    const toggleStatus = async (userId, currentStatus) => {
        setTogglingId(userId);
        try {
            const response = await fetch(`${API_BASE}/users/${userId}/toggle-status`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + JSON.parse(localStorage.getItem("adminUser"))?.token
                },
                body: JSON.stringify({ active: !currentStatus })
            });

            const data = await response.json();
            if (response.ok) {
                const updatedUsers = users.map(user => user.id === userId ? { ...user, active: !currentStatus } : user);
                setUsers(updatedUsers);
                applyFilter(filterStatus, updatedUsers);
                toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
            } else {
                toast.error(data.message || "Failed to update status");
            }
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("Something went wrong while updating status");
        } finally {
            setTogglingId(null);
        }
    };

    // submit add user form
    const handleAddUser = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            const response = await fetch(`${API_BASE}/create-user`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + JSON.parse(localStorage.getItem("adminUser"))?.token
                },
                body: JSON.stringify({ name, email, password, role })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("User created successfully!");
                const updatedUsers = [...users, data.user];
                setUsers(updatedUsers);
                applyFilter(filterStatus, updatedUsers);
                setShowModal(false);
                setName("");
                setEmail("");
                setPassword("");
                setRole("admin");
                setCurrentPage(Math.ceil(updatedUsers.length / usersPerPage));
            } else {
                setError(data.message || "Failed to create user");
                toast.error(data.message || "Failed to create user");
            }
        } catch (err) {
            console.error(err);
            setError("Something went wrong");
            toast.error("Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    // filter function
    const applyFilter = (status, allUsers = users) => {
        setFilterStatus(status);
        let filtered = allUsers;
        if (status === "active") {
            filtered = allUsers.filter(u => u.active);
        } else if (status === "inactive") {
            filtered = allUsers.filter(u => !u.active);
        }
        
        // apply search filter
        if (searchTerm) {
            filtered = filtered.filter(u => 
                u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.email?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        setFilteredUsers(filtered);
        setCurrentPage(1);
    };

    // handle search
    useEffect(() => {
        let filtered = users;
        if (filterStatus === "active") {
            filtered = filtered.filter(u => u.active);
        } else if (filterStatus === "inactive") {
            filtered = filtered.filter(u => !u.active);
        }
        if (searchTerm) {
            filtered = filtered.filter(u => 
                u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.email?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredUsers(filtered);
        setCurrentPage(1);
    }, [searchTerm, filterStatus, users]);

    // pagination calculations
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const totalActive = users.filter(u => u.active).length;
    const totalInactive = users.filter(u => !u.active).length;

    return (
        <Layout>
            <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
                <DashNav />
                
                <div className="container-fluid px-3 px-md-4 py-4">
                    {/* Header */}
                    <div className="mb-4">
                        <div className="d-flex align-items-center gap-3 mb-2">
                            <div className="rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', width: '50px', height: '50px' }}>
                                <BsPeople size={28} color="white" />
                            </div>
                            <div>
                                <h3 className="mb-0 fw-bold" style={{ color: '#1f2937' }}>User Management</h3>
                                <p className="text-muted mt-1 mb-0">Manage system users and their permissions</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="row g-3 mb-4">
                        <div className="col-md-4">
                            <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: 'white' }}>
                                <div className="card-body p-3 p-md-4">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="mb-1 opacity-75">Total Users</h6>
                                            <h2 className="mb-0 fw-bold">{users.length}</h2>
                                        </div>
                                        <BsPeople size={32} className="opacity-50" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white' }}>
                                <div className="card-body p-3 p-md-4">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="mb-1 opacity-75">Active Users</h6>
                                            <h2 className="mb-0 fw-bold">{totalActive}</h2>
                                        </div>
                                        <BsCheckCircle size={32} className="opacity-50" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: 'white' }}>
                                <div className="card-body p-3 p-md-4">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="mb-1 opacity-75">Inactive Users</h6>
                                            <h2 className="mb-0 fw-bold">{totalInactive}</h2>
                                        </div>
                                        <BsXCircle size={32} className="opacity-50" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters and Search */}
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                        <div className="d-flex gap-2">
                            <div className="position-relative">
                                <BsFilter className="position-absolute top-50 start-0 translate-middle-y ms-3" style={{ color: '#9ca3af', fontSize: '14px' }} />
                                <select
                                    className="form-select ps-5"
                                    style={{ borderRadius: '12px', padding: '10px 16px', border: '1px solid #e5e7eb', minWidth: '140px' }}
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                >
                                    <option value="all">All Users</option>
                                    <option value="active">Active Users</option>
                                    <option value="inactive">Inactive Users</option>
                                </select>
                            </div>
                            <div className="position-relative" style={{ width: '250px' }}>
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    className="form-control"
                                    style={{ borderRadius: '12px', padding: '10px 16px', border: '1px solid #e5e7eb' }}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <button
                            className="btn d-flex align-items-center gap-2"
                            style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', borderRadius: '12px', padding: '10px 24px' }}
                            onClick={() => setShowModal(true)}
                        >
                            <BsPlus size={18} /> Add New User
                        </button>
                    </div>

                    {/* Users Table */}
                    <div className="card border-0 shadow-sm" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0" style={{ minWidth: '600px' }}>
                                    <thead style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                        <tr>
                                            <th className="py-3 px-4">Name</th>
                                            <th className="py-3 px-4">Role</th>
                                            <th className="py-3 px-4">Email</th>
                                            <th className="py-3 px-4 text-center">Status</th>
                                            <th className="py-3 px-4 text-center" style={{ width: '120px' }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr><td colSpan="5" className="text-center py-5">
                                                <FaSpinner className="fa-spin" size={30} style={{ color: '#10b981' }} />
                                                <p className="mt-2 text-muted">Loading users...</p>
                                            </td></tr>
                                        ) : currentUsers.length > 0 ? (
                                            currentUsers.map((user) => (
                                                <tr key={user.id} style={{ transition: 'background 0.2s ease' }}>
                                                    <td className="px-4 py-3 align-middle">
                                                        <div className="d-flex align-items-center gap-2">
                                                            <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '35px', height: '35px', background: '#e0e7ff' }}>
                                                                <BsPerson size={16} color="#4f46e5" />
                                                            </div>
                                                            <strong>{user.name}</strong>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 align-middle">
                                                        <span className="badge" style={{ background: '#e0e7ff', color: '#4f46e5', padding: '5px 12px', borderRadius: '20px' }}>
                                                            {user.role?.name || "Admin"}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 align-middle">{user.email}</td>
                                                    <td className="px-4 py-3 align-middle text-center">
                                                        <span className={`badge ${user.active ? 'bg-success' : 'bg-warning'}`} style={{ padding: '5px 12px', borderRadius: '20px' }}>
                                                            {user.active ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 align-middle text-center">
                                                        <button
                                                            className={`btn btn-sm ${user.active ? 'btn-warning' : 'btn-success'} d-flex align-items-center gap-1 mx-auto`}
                                                            style={{ borderRadius: '10px', padding: '6px 14px' }}
                                                            onClick={() => toggleStatus(user.id, user.active)}
                                                            disabled={togglingId === user.id}
                                                        >
                                                            {togglingId === user.id ? (
                                                                <FaSpinner className="fa-spin" size={12} />
                                                            ) : user.active ? (
                                                                <> <BsXCircle size={12} /> Deactivate</>
                                                            ) : (
                                                                <> <BsCheckCircle size={12} /> Activate</>
                                                            )}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr><td colSpan="5" className="text-center py-5">
                                                <BsPeople size={50} className="text-muted mb-2 opacity-25" />
                                                <h6 className="text-muted">No users found</h6>
                                                <p className="text-muted small">Click "Add New User" to create one</p>
                                            </td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        
                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="card-footer bg-white border-0 py-3 d-flex justify-content-center">
                                <div className="d-flex gap-1">
                                    <button
                                        className="btn btn-sm btn-outline-secondary"
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(prev => prev - 1)}
                                        style={{ borderRadius: '10px' }}
                                    >
                                        Previous
                                    </button>
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            pageNum = currentPage - 2 + i;
                                        }
                                        return (
                                            <button
                                                key={pageNum}
                                                className={`btn btn-sm ${currentPage === pageNum ? 'btn-primary' : 'btn-outline-secondary'}`}
                                                onClick={() => setCurrentPage(pageNum)}
                                                style={{ borderRadius: '8px', minWidth: '38px' }}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                    <button
                                        className="btn btn-sm btn-outline-secondary"
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(prev => prev + 1)}
                                        style={{ borderRadius: '10px' }}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                
                <Footer />
            </div>

            {/* Add User Modal */}
            {showModal && (
                <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.5)", zIndex: 9999, overflowY: "auto" }}>
                    <div className="modal-dialog modal-dialog-centered" style={{ margin: "16px", maxWidth: "500px" }}>
                        <div className="modal-content" style={{ borderRadius: '24px', overflow: 'hidden' }}>
                            <div className="modal-header border-0" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: '20px 24px' }}>
                                <div className="d-flex align-items-center gap-2">
                                    <BsPeople size={20} color="white" />
                                    <h5 className="modal-title text-white">Add New User</h5>
                                </div>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body p-4">
                                {error && <div className="alert alert-danger mb-3">{error}</div>}
                                
                                <form onSubmit={handleAddUser}>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">
                                            <BsPerson className="me-1" style={{ color: '#10b981' }} />
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            style={{ borderRadius: '12px', padding: '12px 16px', border: '1px solid #e2e8f0' }}
                                            placeholder="Enter full name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">
                                            <BsEnvelope className="me-1" style={{ color: '#10b981' }} />
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            style={{ borderRadius: '12px', padding: '12px 16px', border: '1px solid #e2e8f0' }}
                                            placeholder="Enter email address"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">
                                            <BsLock className="me-1" style={{ color: '#10b981' }} />
                                            Password
                                        </label>
                                        <div className="input-group">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className="form-control"
                                                style={{ borderRadius: '12px', padding: '12px 16px', border: '1px solid #e2e8f0' }}
                                                placeholder="Enter password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                style={{ borderRadius: '12px', marginLeft: '8px' }}
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <BsEyeSlash size={16} /> : <BsEye size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label fw-semibold">
                                            <BsShieldCheck className="me-1" style={{ color: '#10b981' }} />
                                            User Role
                                        </label>
                                        <select
                                            className="form-select"
                                            style={{ borderRadius: '12px', padding: '12px 16px', border: '1px solid #e2e8f0' }}
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                        >
                                            <option value="admin">Admin</option>
                                            <option value="user">User</option>
                                        </select>
                                    </div>
                                    <button 
                                        type="submit" 
                                        className="btn w-100 d-flex align-items-center justify-content-center gap-2"
                                        style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', borderRadius: '12px', padding: '12px', border: 'none', fontWeight: '500' }}
                                        disabled={submitting}
                                    >
                                        {submitting ? <><FaSpinner className="fa-spin" /> Creating...</> : <><BsPlus /> Create User</>}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            <ToastContainer position="top-right" autoClose={3000} theme="colored" />
        </Layout>
    );
};

export default UserSettings;