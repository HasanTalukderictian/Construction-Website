import Layout from "../components/Layout";
import DashNav from "./DasNav";
import Footer from "./Footer";
import { useEffect, useState } from "react";

const UserSettings = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [filterStatus, setFilterStatus] = useState("all"); // filter state

    // pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;

    // form state
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("admin");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // fetch users
    const fetchUsers = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/users", {
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
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // toggle active/inactive
    const toggleStatus = async (userId, currentStatus) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/users/${userId}/toggle-status`, {
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
            } else {
                console.error("Failed to toggle status", data);
                alert(data.message || "Failed to update status");
            }
        } catch (error) {
            console.error("Fetch error:", error);
            alert("Something went wrong while updating status");
        }
    };

    // submit add user form
    const handleAddUser = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const response = await fetch("http://127.0.0.1:8000/api/create-user", {
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
                setSuccess("User created successfully!");
                const updatedUsers = [...users, data.user];
                setUsers(updatedUsers);
                applyFilter(filterStatus, updatedUsers);
                setShowModal(false);
                setName("");
                setEmail("");
                setPassword("");
                setRole("admin");
                setCurrentPage(Math.ceil(updatedUsers.length / usersPerPage)); // go to last page
            } else {
                setError(data.message || "Failed to create user");
            }
        } catch (err) {
            console.error(err);
            setError("Something went wrong");
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
        setFilteredUsers(filtered);
        setCurrentPage(1); // reset to first page after filter
    };

    // pagination calculations
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    return (
        <Layout>
            <div className="flex-grow-1">
                <DashNav />
                <div className="container mt-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2>Settings Page</h2>
                        <button
                            className="btn btn-success"
                            onClick={() => setShowModal(true)}
                        >
                            Add User
                        </button>
                    </div>

                    {/* Filter dropdown */}
                    <div className="mb-3">
                        <label>Filter by Status: </label>
                        <select
                            className="form-select w-auto d-inline-block ms-2"
                            value={filterStatus}
                            onChange={(e) => applyFilter(e.target.value)}
                        >
                            <option value="all">All</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-striped table-bordered">
                            <thead className="table-dark">
                                <tr>
                                    <th>Name</th>
                                    <th>Role</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentUsers.length > 0 ? (
                                    currentUsers.map((user) => (
                                        <tr key={user.id}>
                                            <td>{user.name}</td>
                                            <td>{user.role?.name || "-"}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <button
                                                    className={`btn btn-sm ${user.active ? 'btn-success' : 'btn-warning'}`}
                                                    style={{ minWidth: "80px" }}
                                                    onClick={() => toggleStatus(user.id, user.active)}
                                                >
                                                    {user.active ? 'Active' : 'Inactive'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center">
                                            No users found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination buttons */}
                    <div className="d-flex justify-content-center mt-3">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                className={`btn btn-sm mx-1 ${currentPage === i + 1 ? "btn-primary" : "btn-primary"}`}
                                onClick={() => setCurrentPage(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                    {/* Modal */}
                    {showModal && (
                        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Add New User</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                    </div>
                                    <div className="modal-body">
                                        {error && <div className="alert alert-danger">{error}</div>}
                                        {success && <div className="alert alert-success">{success}</div>}

                                        <form onSubmit={handleAddUser}>
                                            <div className="mb-3">
                                                <label className="form-label">Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Email</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Password</label>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Role</label>
                                                <select
                                                    className="form-select"
                                                    value={role}
                                                    onChange={(e) => setRole(e.target.value)}
                                                >
                                                    <option value="admin">Admin</option>
                                                    <option value="user">User</option>
                                                </select>
                                            </div>
                                            <button type="submit" className="btn btn-primary w-100">
                                                Add User
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <Footer />
            </div>
        </Layout>
    );
};

export default UserSettings;
