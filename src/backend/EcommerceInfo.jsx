import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import DashNav from './DasNav'; // Ekhane file name 'DasNav' naki 'DashNav' check koro
import Footer from './Footer';

const EcommerceInfo = () => {
    const [showModal, setShowModal] = useState(false);
    const [contents, setContents] = useState([]); // Default empty array
    const [loading, setLoading] = useState(true); 
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        section: '',
        description: '',
        is_visible: 1
    });

    // 1. Data Fetch kora
   const fetchContents = async () => {
    try {
        const res = await axios.get('http://127.0.0.1:8000/api/get-contents'); // Full URL
        setContents(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
    } catch (err) {
        console.error("Error fetching data", err);
        setLoading(false);
    }
};

    useEffect(() => {
        fetchContents();
    }, []);

    // Form Handlers
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const resetForm = () => {
        setFormData({ name: '', section: '', description: '', is_visible: 1 });
        setEditId(null);
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const baseUrl = 'http://127.0.0.1:8000/api';
        if (editId) {
            await axios.put(`${baseUrl}/edit-contents/${editId}`, formData);
        } else {
            await axios.post(`${baseUrl}/add-contents`, formData);
        }
        setShowModal(false);
        resetForm();
        fetchContents();
    } catch (err) {
        alert("API Error! Check Laravel logs.");
    }
};

   const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/del-contents/${id}`);
            fetchContents();
        } catch (err) {
            console.error("Delete failed", err);
        }
    }
};

    const handleEdit = (item) => {
        setEditId(item.id);
        setFormData({
            name: item.name,
            section: item.section,
            description: item.description || '',
            is_visible: item.is_visible
        });
        setShowModal(true);
    };

    return (
        <Layout>
            <div className="d-flex">
                <div className="flex-grow-1">
                    <div className='container mt-4'>
                        <DashNav />

                        <div className="d-flex justify-content-between align-items-center mb-4 mt-4">
                            <h2 className="fw-bold text-secondary">Ecommerce Page Design</h2>
                            <button 
                                className="btn btn-success shadow-sm" 
                                onClick={() => { resetForm(); setShowModal(true); }}
                            >
                                <i className="bi bi-plus-lg me-2"></i> Add New
                            </button>
                        </div>

                        <div className="card shadow-sm border-0">
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th className="py-3 ps-4">Name</th>
                                                <th className="py-3">Section</th>
                                                <th className="py-3">IsVisible</th>
                                                <th className="py-3 text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loading ? (
                                                <tr><td colSpan="4" className="text-center py-4">Loading...</td></tr>
                                            ) : (
                                                contents && contents.length > 0 ? (
                                                    contents.map((item) => (
                                                        <tr key={item.id} className="align-middle">
                                                            <td className="ps-4">{item.name}</td>
                                                            <td>{item.section}</td>
                                                            <td>
                                                                <span className={`badge ${item.is_visible ? 'bg-success' : 'bg-danger'}`}>
                                                                    {item.is_visible ? 'True' : 'False'}
                                                                </span>
                                                            </td>
                                                            <td className="text-center">
                                                                <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(item)}>Edit</button>
                                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(item.id)}>Delete</button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr><td colSpan="4" className="text-center py-4">No data found.</td></tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <Footer />
                    </div>
                </div>
            </div>

            {/* Modal - Same as before but with form validation */}
            {showModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow">
                            <div className="modal-header bg-light">
                                <h5 className="modal-title fw-bold">{editId ? 'Update Content' : 'Content Basic'}</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body p-4">
                                    <div className="mb-3">
                                        <label className="form-label">Name</label>
                                        <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Section</label>
                                        <input type="text" name="section" className="form-control" value={formData.section} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Description</label>
                                        <textarea name="description" className="form-control" rows="3" value={formData.description} onChange={handleChange}></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">IsVisible</label>
                                        <select name="is_visible" className="form-select" value={formData.is_visible} onChange={handleChange}>
                                            <option value={1}>True</option>
                                            <option value={0}>False</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="modal-footer border-0">
                                    <button type="button" className="btn btn-danger" onClick={() => setShowModal(false)}>Close</button>
                                    <button type="submit" className="btn btn-success px-4">{editId ? 'Update' : 'Save'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default EcommerceInfo;