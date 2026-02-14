import { useEffect, useState } from 'react';
import '../assets/css/nav.scss'

const DashNav = () => {
    const [showModal, setShowModal] = useState(false);
    const [companyName, setCompanyName] = useState('');
    const [yourName, setYourName] = useState('');
    const [image, setImage] = useState(null);
    const [userId, setUserId] = useState(null);


    const [formCompanyName, setFormCompanyName] = useState('');
    const [formYourName, setFormYourName] = useState('');
    const [formImage, setFormImage] = useState(null);

    const fetchUserInfo = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/get-userInfo`, {
                headers: { 'Accept': 'application/json' },
            });
            const data = await response.json();

            console.log("Fetched user info response:", data);

            if (response.ok && data.data && data.data.length > 0) {
                const user = data.data[0];
                console.log("User object:", user);

                setCompanyName(user.company_name || '');
                setYourName(user.your_name || '');
                setImage(user.image ? `http://127.0.0.1:8000/storage/${user.image}` : null);
                setUserId(user.id);
                console.log("Set userId:", user.id);
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
        setFormImage(null);
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    // Image optimization function
    const optimizeImage = (file, maxWidth = 800, maxHeight = 800, quality = 0.7) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    let { width, height } = img;

                    // Maintain aspect ratio
                    if (width > height) {
                        if (width > maxWidth) {
                            height = (height * maxWidth) / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width = (width * maxHeight) / height;
                            height = maxHeight;
                        }
                    }

                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        resolve(blob);
                    }, 'image/jpeg', quality);
                };
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('CompanyName', formCompanyName);
        formData.append('YourName', formYourName);

        if (formImage instanceof File) {
            const optimizedBlob = await optimizeImage(formImage);
            const optimizedFile = new File([optimizedBlob], formImage.name, { type: 'image/jpeg' });
            formData.append('image', optimizedFile);
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/edit-userInfo/${userId}`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                alert('User info updated successfully!');
                setShowModal(false);
                fetchUserInfo();
                setFormCompanyName('');
                setFormYourName('');
                setFormImage(null);
            } else {
                console.error('Error response:', data);
                alert('Update failed: ' + (data.message || 'Check console.'));
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

                        <div className="profile-image-wrapper me-2">
                            <img
                                src={image ? `${image}?${new Date().getTime()}` : "https://i.ibb.co.com/rK7RzDJk/MY-pic-02.jpg"}
                                alt="User"
                                className="profile-image"
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
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    setFormImage(e.target.files[0]);
                                                }
                                            }}
                                            accept="image/*"
                                        />

                                        {/* Image preview */}
                                        {formImage && (
                                            <div className="mt-2 position-relative d-inline-block">
                                                <img
                                                    src={typeof formImage === "string" ? formImage : URL.createObjectURL(formImage)}
                                                    alt="Preview"
                                                    style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "5px" }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setFormImage(null)}
                                                    style={{
                                                        position: "absolute",
                                                        top: "-5px",
                                                        right: "-5px",
                                                        borderRadius: "50%",
                                                        border: "none",
                                                        background: "red",
                                                        color: "white",
                                                        width: "20px",
                                                        height: "20px",
                                                        cursor: "pointer",
                                                        padding: 0,
                                                        lineHeight: "18px",
                                                        fontSize: "14px"
                                                    }}
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        )}
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
