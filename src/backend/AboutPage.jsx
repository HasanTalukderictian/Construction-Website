import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import DashNav from './DasNav'
import Footer from './Footer'
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import axios from 'axios';

const AboutPage = () => {
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [listLoading, setListLoading] = useState(false);
    const [aboutData, setAboutData] = useState([]);

    // Update States
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    // Form States
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const handleClose = () => {
        setShow(false);
        setIsEdit(false);
        setEditId(null);
        setTitle('');
        setDescription('');
        setImage(null);
    };
    
    const handleShow = () => setShow(true);

    // 1. GET: Fetch Data
    const fetchData = async () => {
        setListLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/about/index`);
            if(response.data.success){
                setAboutData(response.data.data);
            }
        } catch (error) {
            console.error("Fetch Error:", error);
        } finally {
            setListLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 2. POST/UPDATE: Submit Logic
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        if (image) {
            formData.append('image', image);
        }

        try {
            let response;
            if (isEdit) {
                // Update Route
                response = await axios.post(`${API_BASE_URL}/about/update/${editId}`, formData);
            } else {
                // Store Route
                response = await axios.post(`${API_BASE_URL}/about/store`, formData);
            }

            if (response.data.success) {
                alert(isEdit ? "Updated Successfully!" : "Saved Successfully!");
                handleClose();
                fetchData();
            }
        } catch (error) {
            console.error("Submission Error:", error.response?.data);
            alert("Process failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // 3. EDIT: Open Modal with Data
    const handleEdit = (item) => {
        setIsEdit(true);
        setEditId(item.id);
        setTitle(item.title);
        setDescription(item.description);
        setShow(true);
    };

    // 4. DELETE: Functionality
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this?")) {
            try {
                const response = await axios.delete(`${API_BASE_URL}/about/delete/${id}`);
                if (response.data.success) {
                    alert("Deleted Successfully!");
                    fetchData();
                }
            } catch (error) {
                console.error("Delete Error:", error);
                alert("Could not delete.");
            }
        }
    };

    return (
        <Layout>
            <div className="d-flex">
                <div className="flex-grow-1">
                    <DashNav />
                    <div className='container mt-4 mb-5'>
                        <div className="card shadow-sm border-0 rounded-4">
                            <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
                                <h5 className="mb-0 fw-bold text-success">About Information List</h5>
                                <button className="btn btn-success rounded-pill px-4 shadow-sm" onClick={handleShow}>
                                    <i className="bi bi-plus-circle me-2"></i> Add New
                                </button>
                            </div>

                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th className="ps-4">Image</th>
                                                <th>Title</th>
                                                <th>Description</th>
                                                <th className="text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {listLoading ? (
                                                <tr><td colSpan="4" className='text-center py-5'><Spinner animation="grow" variant="success" /></td></tr>
                                            ) : aboutData.length > 0 ? (
                                                aboutData.map((item) => (
                                                    <tr key={item.id}>
                                                        <td className="ps-4">
                                                            <img 
                                                                src={`http://localhost:8000/${item.image}`} 
                                                                alt={item.title} 
                                                                className="rounded-3 border"
                                                                style={{ width: "60px", height: "60px", objectFit: "cover" }}
                                                            />
                                                        </td>
                                                        <td><span className="fw-bold text-dark">{item.title}</span></td>
                                                        <td><p className="text-muted mb-0 small" style={{ maxWidth: "400px" }}>{item.description}</p></td>
                                                        <td className="text-center">
                                                            <button 
                                                                onClick={() => handleEdit(item)}
                                                                className="btn btn-sm btn-outline-primary me-2"
                                                            >
                                                                <i className="bi bi-pencil-square"></i>
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDelete(item.id)}
                                                                className="btn btn-sm btn-outline-danger"
                                                            >
                                                                <i className="bi bi-trash"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr><td colSpan="4" className='text-center py-5 text-muted'>No data found.</td></tr>
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

            {/* --- MODAL FOR BOTH ADD & EDIT --- */}
            <Modal show={show} onHide={handleClose} centered backdrop="static">
                <Modal.Header closeButton className='bg-light border-0'>
                    <Modal.Title className='fw-bold text-success small text-uppercase'>
                        {isEdit ? 'Update About Info' : 'Add New About Info'}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body className='p-4'>
                        <Form.Group className="mb-3">
                            <Form.Label className='fw-bold small text-muted'>TITLE</Form.Label>
                            <Form.Control 
                                type="text" 
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Our Mission" 
                                className='rounded-3' 
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className='fw-bold small text-muted'>DESCRIPTION</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={4} 
                                required
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe details..." 
                                className='rounded-3' 
                            />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label className='fw-bold small text-muted'>IMAGE</Form.Label>
                            <Form.Control 
                                type="file" 
                                accept="image/*"
                                onChange={(e) => setImage(e.target.files[0])}
                                className='rounded-3' 
                            />
                            {isEdit && <small className="text-info">Leave blank to keep existing image</small>}
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer className='border-0 pt-0 px-4 pb-4'>
                        <Button variant="light" onClick={handleClose} className='rounded-pill px-4 border'>Cancel</Button>
                        <Button variant="success" type="submit" disabled={loading} className='rounded-pill px-4'>
                            {loading ? <><Spinner animation="border" size="sm" className="me-2" /> Processing...</> : (isEdit ? 'Update Information' : 'Save Information')}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Layout>
    )
}

export default AboutPage