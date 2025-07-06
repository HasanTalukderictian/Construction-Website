import { useEffect, useState } from 'react';

const DashNav = () => {
    const [showModal, setShowModal] = useState(false);
    const [companyName, setCompanyName] = useState('');
    const [yourName, setYourName] = useState('');
    const [image, setImage] = useState(null);
    const [userId, setUserId] = useState(null); // store user id

    const BASE_URL = import.meta.env.VITE_BASE_URL;

    // Local form state
    const [formCompanyName, setFormCompanyName] = useState('');
    const [formYourName, setFormYourName] = useState('');
    const [formImage, setFormImage] = useState(null);

    const fetchUserInfo = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/get-userInfo`, {
                headers: {
                    'Accept': 'application/json',
                },
            });
            const data = await response.json();

            console.log("API response data:", data);

            if (response.ok && data.data && data.data.length > 0) {
                const user = data.data[0];
                setCompanyName(user.CompanyName || '');
                setYourName(user.YourName || '');
                setImage(user.image ? `${BASE_URL}/storage/${user.image}` : null);
                setUserId(user.id); // set user id for update
            } else {
                console.error('Failed to fetch user info:', data);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const handleOpenModal = () => {
        setFormCompanyName(companyName);
        setFormYourName(yourName);
        setFormImage(null); // Reset image input
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('CompanyName', formCompanyName);
        formData.append('YourName', formYourName);
        if (formImage instanceof File) {
            formData.append('image', formImage);
        }

        try {
            const response = await fetch(`${BASE_URL}/api/edit-userInfo/${userId}`, {
                method: 'POST', // use 'PUT' if your backend expects it
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                alert('User info updated successfully!');
                setShowModal(false);

                await fetchUserInfo(); // Refresh data after update

                // Reset form state
                setFormCompanyName('');
                setFormYourName('');
                setFormImage(null);
            } else {
                alert('Update failed: ' + (data.message || 'Check console for details.'));
                console.error(data);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            alert('An error occurred while updating the form.');
        }
    };

    return (
        <>
            <div className="d-flex container justify-content-center">
                <nav className="navbar bg-white shadow-sm py-2 px-4 d-flex justify-content-between align-items-center" style={{ maxWidth: "1500px", width: "100%" }}>
                    <div className="d-flex align-items-center">
                        <img
                            src="https://i.ibb.co.com/kgghmZfy/Flying-Bird-logo-design-template.png"
                            alt="Paperfly Logo"
                            className="me-2"
                            style={{ height: "40px" }}
                        />
                        <h4 className="fw-bold text-primary">{companyName || 'Gazi Builders'}</h4>
                        <span className="text-muted small ms-1">Make your House more Happiness</span>
                    </div>

                    <div className="d-flex align-items-center">
                        <div
                            className="rounded-circle bg-primary d-flex justify-content-center align-items-center me-2"
                            style={{ width: "100px", height: "100px", overflow: "hidden" }}
                        >
                            <img
                                src={
                                    image
                                        ? `${image}?${new Date().getTime()}`
                                        : "https://i.ibb.co.com/rK7RzDJk/MY-pic-02.jpg"
                                }
                                alt="User"
                                style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "50%" }}
                            />
                        </div>
                        <div className="mt-1 mb-1">
                            <span className="d-block text-muted">Hello,</span>
                            <span className="fw-bold" style={{ cursor: "pointer", color: "#0d6efd" }} onClick={handleOpenModal}>
                                {yourName || 'Admin'}
                            </span>
                            <p className="small text-muted m-0 d-flex align-items-center">
                                Welcome to our panel
                                <span className="ms-2">😊</span>
                            </p>
                        </div>
                    </div>
                </nav>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">User Info</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Company Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formCompanyName}
                                            onChange={(e) => setFormCompanyName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Your Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formYourName}
                                            onChange={(e) => setFormYourName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Image</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            onChange={(e) => setFormImage(e.target.files[0])}
                                            accept="image/*"
                                        />
                                    </div>
                                    <div className="modal-footer px-0">
                                        <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
                                        <button type="submit" className="btn btn-primary">Save</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DashNav;
