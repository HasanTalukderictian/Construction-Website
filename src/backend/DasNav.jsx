// import { useEffect, useState } from 'react';
// import '../assets/css/nav.scss'


// export const API_BASE = import.meta.env.VITE_API_BASE_URL;
// export const API_STORE = import.meta.env.VITE_API_STORAGE_URL;

// const DashNav = () => {
//     const [showModal, setShowModal] = useState(false);
//     const [companyName, setCompanyName] = useState('Gazi Builders'); // fallback name
//     const [logo, setLogo] = useState('https://i.ibb.co.com/kgghmZfy/Flying-Bird-logo-design-template.png'); // fallback logo
//     const [yourName, setYourName] = useState('');
//     const [image, setImage] = useState(null);
//     const [userId, setUserId] = useState(null);

//     const [formCompanyName, setFormCompanyName] = useState('');
//     const [formYourName, setFormYourName] = useState('');
//     const [formImage, setFormImage] = useState(null);

//     // ================================
//     // Fetch company info from API
//     // ================================
//     const fetchCompanyInfo = async () => {
//         try {
//             const response = await fetch(`${API_BASE}/get-header`);
//             const data = await response.json();
//             if (response.ok && data.status && data.data.length > 0) {
//                 const header = data.data[0];
//                 setCompanyName(header.Companyname || 'Gazi Builders');
//                 setLogo(header.image || 'https://i.ibb.co.com/kgghmZfy/Flying-Bird-logo-design-template.png');
//             }
//         } catch (err) {
//             console.error("Failed to fetch company info:", err);
//         }
//     };

//     // ================================
//     // Fetch user info (existing)
//     // ================================
//     const fetchUserInfo = async () => {
//         try {
//             const response = await fetch(`${API_BASE}/get-userInfo`, {
//                 headers: { 'Accept': 'application/json' },
//             });
//             const data = await response.json();

//             if (response.ok && data.data && data.data.length > 0) {
//                 const user = data.data[0];
//                 setCompanyName(prev => prev); // keep API company name unchanged
//                 setYourName(user.your_name || '');
//                 setImage(user.image ? `${API_STORE}/storage/${user.image}` : null);
//                 setUserId(user.id);
//             }
//         } catch (error) {
//             console.error('Fetch error:', error);
//         }
//     };

//     useEffect(() => {
//         fetchCompanyInfo();
//         fetchUserInfo();
//     }, []);

//     const handleOpenModal = () => {
//         setFormCompanyName(companyName);
//         setFormYourName(yourName);
//         setFormImage(null);
//         setShowModal(true);
//     };

//     const handleCloseModal = () => setShowModal(false);

//     // Image optimization function
//     const optimizeImage = (file, maxWidth = 800, maxHeight = 800, quality = 0.7) => {
//         return new Promise((resolve) => {
//             const reader = new FileReader();
//             reader.readAsDataURL(file);
//             reader.onload = (event) => {
//                 const img = new Image();
//                 img.src = event.target.result;
//                 img.onload = () => {
//                     let { width, height } = img;

//                     if (width > height) {
//                         if (width > maxWidth) {
//                             height = (height * maxWidth) / width;
//                             width = maxWidth;
//                         }
//                     } else {
//                         if (height > maxHeight) {
//                             width = (width * maxHeight) / height;
//                             height = maxHeight;
//                         }
//                     }

//                     const canvas = document.createElement('canvas');
//                     canvas.width = width;
//                     canvas.height = height;
//                     const ctx = canvas.getContext('2d');
//                     ctx.drawImage(img, 0, 0, width, height);

//                     canvas.toBlob((blob) => {
//                         resolve(blob);
//                     }, 'image/jpeg', quality);
//                 };
//             };
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         formData.append('CompanyName', formCompanyName);
//         formData.append('YourName', formYourName);

//         if (formImage instanceof File) {
//             const optimizedBlob = await optimizeImage(formImage);
//             const optimizedFile = new File([optimizedBlob], formImage.name, { type: 'image/jpeg' });
//             formData.append('image', optimizedFile);
//         }

//         try {
//             const response = await fetch(`${API_BASE}/edit-userInfo/${userId}`, {
//                 method: 'POST',
//                 body: formData,
//             });

//             const data = await response.json();

//             if (response.ok) {
//                 alert('User info updated successfully!');
//                 setShowModal(false);
//                 fetchUserInfo();
//                 setFormCompanyName('');
//                 setFormYourName('');
//                 setFormImage(null);
//             } else {
//                 console.error('Error response:', data);
//                 alert('Update failed: ' + (data.message || 'Check console.'));
//             }
//         } catch (error) {
//             console.error('Fetch error:', error);
//             alert('An error occurred while updating the form.');
//         }
//     };

//     return (
//         <>
//             <div className="d-flex container justify-content-center">
//                 <nav className="navbar bg-white shadow-sm py-2 px-4 d-flex justify-content-between align-items-center" style={{ maxWidth: "1500px", width: "100%" }}>
//                     <div className="d-flex align-items-center">
//                         <img
//                             src={logo}
//                             alt="Company Logo"
//                             className="me-2"
//                             style={{ height: "40px" }}
//                         />
//                         <h4 className="fw-bold text-primary">{companyName}</h4>
//                         <span className="text-muted small ms-1">Make your Shopping more Happiness</span>
//                     </div>

//                     <div className="d-flex align-items-center">
//                         <div className="profile-image-wrapper me-2">
//                             <img
//                                 src={image ? `${image}?${new Date().getTime()}` : "https://i.ibb.co.com/rK7RzDJk/MY-pic-02.jpg"}
//                                 alt="User"
//                                 className="profile-image"
//                             />
//                         </div>

//                         <div className="mt-1 mb-1">
//                             <span className="d-block text-muted">Hello,</span>
//                             <span className="fw-bold" style={{ cursor: "pointer", color: "#0d6efd" }} onClick={handleOpenModal}>
//                                 {yourName || 'Admin'}
//                             </span>
//                             <p className="small text-muted m-0 d-flex align-items-center">
//                                 Welcome to our panel
//                                 <span className="ms-2">😊</span>
//                             </p>
//                         </div>
//                     </div>
//                 </nav>
//             </div>

//             {/* Modal */}
//             {showModal && (
//                 <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
//                     <div className="modal-dialog" role="document">
//                         <div className="modal-content">
//                             <div className="modal-header">
//                                 <h5 className="modal-title">User Info</h5>
//                                 <button type="button" className="btn-close" onClick={handleCloseModal}></button>
//                             </div>
//                             <div className="modal-body">
//                                 <form onSubmit={handleSubmit}>
//                                     <div className="mb-3">
//                                         <label className="form-label">Company Name</label>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             value={formCompanyName}
//                                             onChange={(e) => setFormCompanyName(e.target.value)}
//                                             required
//                                         />
//                                     </div>
//                                     <div className="mb-3">
//                                         <label className="form-label">Your Name</label>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             value={formYourName}
//                                             onChange={(e) => setFormYourName(e.target.value)}
//                                             required
//                                         />
//                                     </div>

//                                     <div className="mb-3">
//                                         <label className="form-label">Image</label>
//                                         <input
//                                             type="file"
//                                             className="form-control"
//                                             onChange={(e) => {
//                                                 if (e.target.files && e.target.files[0]) {
//                                                     setFormImage(e.target.files[0]);
//                                                 }
//                                             }}
//                                             accept="image/*"
//                                         />
//                                         {formImage && (
//                                             <div className="mt-2 position-relative d-inline-block">
//                                                 <img
//                                                     src={typeof formImage === "string" ? formImage : URL.createObjectURL(formImage)}
//                                                     alt="Preview"
//                                                     style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "5px" }}
//                                                 />
//                                                 <button
//                                                     type="button"
//                                                     onClick={() => setFormImage(null)}
//                                                     style={{
//                                                         position: "absolute",
//                                                         top: "-5px",
//                                                         right: "-5px",
//                                                         borderRadius: "50%",
//                                                         border: "none",
//                                                         background: "red",
//                                                         color: "white",
//                                                         width: "20px",
//                                                         height: "20px",
//                                                         cursor: "pointer",
//                                                         padding: 0,
//                                                         lineHeight: "18px",
//                                                         fontSize: "14px"
//                                                     }}
//                                                 >
//                                                     &times;
//                                                 </button>
//                                             </div>
//                                         )}
//                                     </div>

//                                     <div className="modal-footer px-0">
//                                         <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
//                                         <button type="submit" className="btn btn-primary">Save</button>
//                                     </div>
//                                 </form>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// };

// export default DashNav;

import { useEffect, useState } from 'react';
import '../assets/css/nav.scss'

export const API_BASE = import.meta.env.VITE_API_BASE_URL;
export const API_STORE = import.meta.env.VITE_API_STORAGE_URL;

const DashNav = () => {
    const [showModal, setShowModal] = useState(false);
    const [companyName, setCompanyName] = useState('Gazi Builders');
    const [logo, setLogo] = useState('https://i.ibb.co.com/kgghmZfy/Flying-Bird-logo-design-template.png');
    const [yourName, setYourName] = useState('');
    const [image, setImage] = useState(null);
    const [userId, setUserId] = useState(null);
    const [notifications, setNotifications] = useState([
        { id: 1, text: "New order received", time: "5 min ago", read: false },
        { id: 2, text: "Payment completed", time: "1 hour ago", read: false },
        { id: 3, text: "Product out of stock", time: "2 hours ago", read: true }
    ]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    const [formCompanyName, setFormCompanyName] = useState('');
    const [formYourName, setFormYourName] = useState('');
    const [formImage, setFormImage] = useState(null);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const fetchCompanyInfo = async () => {
        try {
            const response = await fetch(`${API_BASE}/get-header`);
            const data = await response.json();
            if (response.ok && data.status && data.data.length > 0) {
                const header = data.data[0];
                setCompanyName(header.Companyname || 'Gazi Builders');
                setLogo(header.image || 'https://i.ibb.co.com/kgghmZfy/Flying-Bird-logo-design-template.png');
            }
        } catch (err) {
            console.error("Failed to fetch company info:", err);
        }
    };

    const fetchUserInfo = async () => {
        try {
            const response = await fetch(`${API_BASE}/get-userInfo`, {
                headers: { 'Accept': 'application/json' },
            });
            const data = await response.json();

            if (response.ok && data.data && data.data.length > 0) {
                const user = data.data[0];
                setYourName(user.your_name || '');
                setImage(user.image ? `${API_STORE}/storage/${user.image}` : null);
                setUserId(user.id);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    useEffect(() => {
        fetchCompanyInfo();
        fetchUserInfo();
    }, []);

    const handleOpenModal = () => {
        setFormCompanyName(companyName);
        setFormYourName(yourName);
        setFormImage(null);
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    const optimizeImage = (file, maxWidth = 800, maxHeight = 800, quality = 0.7) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    let { width, height } = img;

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
            const response = await fetch(`${API_BASE}/edit-userInfo/${userId}`, {
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

    const markAsRead = (id) => {
        setNotifications(notifications.map(notif => 
            notif.id === id ? { ...notif, read: true } : notif
        ));
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <>
            <nav className="modern-navbar">
                <div className="nav-container">
                    {/* Logo Section */}
                    <div className="nav-brand">
                        <div className="logo-wrapper">
                            <img src={logo} alt="Company Logo" className="brand-logo" />
                            <div className="brand-info">
                                <h4 className="brand-name">{companyName}</h4>
                                <span className="brand-tagline">Make your Shopping more Happiness</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="nav-actions">
                        {/* Date & Time */}
                        <div className="datetime-widget">
                            <i className="bi bi-calendar3"></i>
                            <div className="datetime-info">
                                <span className="date">{currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                <span className="time">{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>

                        {/* Notifications */}
                        <div className="notification-dropdown">
                            <button 
                                className="notification-btn"
                                onClick={() => setShowNotifications(!showNotifications)}
                            >
                                <i className="bi bi-bell"></i>
                                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                            </button>
                            
                            {showNotifications && (
                                <div className="dropdown-menu notifications-menu">
                                    <div className="menu-header">
                                        <h6>Notifications</h6>
                                        <button className="mark-all-btn">Mark all as read</button>
                                    </div>
                                    <div className="menu-items">
                                        {notifications.map(notif => (
                                            <div 
                                                key={notif.id} 
                                                className={`notification-item ${!notif.read ? 'unread' : ''}`}
                                                onClick={() => markAsRead(notif.id)}
                                            >
                                                <div className="notification-icon">
                                                    <i className="bi bi-bell-fill"></i>
                                                </div>
                                                <div className="notification-content">
                                                    <p>{notif.text}</p>
                                                    <span>{notif.time}</span>
                                                </div>
                                                {!notif.read && <div className="unread-dot"></div>}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="menu-footer">
                                        <a href="#">View all notifications</a>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* User Profile */}
                        <div className="user-dropdown">
                            <button 
                                className="user-profile-btn"
                                onClick={() => setShowUserMenu(!showUserMenu)}
                            >
                                <div className="profile-image-wrapper">
                                    <img
                                        src={image ? `${image}?${new Date().getTime()}` : "https://i.ibb.co.com/rK7RzDJk/MY-pic-02.jpg"}
                                        alt="User"
                                        className="profile-image"
                                    />
                                    <div className="online-status"></div>
                                </div>
                                <div className="user-info">
                                    <span className="user-greeting">Hello,</span>
                                    <span className="user-name">{yourName || 'Admin'}</span>
                                </div>
                                <i className="bi bi-chevron-down dropdown-arrow"></i>
                            </button>

                            {showUserMenu && (
                                <div className="dropdown-menu user-menu">
                                    <div className="user-header">
                                        <img src={image || "https://i.ibb.co.com/rK7RzDJk/MY-pic-02.jpg"} alt="User" />
                                        <div>
                                            <h6>{yourName || 'Admin'}</h6>
                                            <span>Administrator</span>
                                        </div>
                                    </div>
                                    <div className="menu-divider"></div>
                                    <button className="menu-item" onClick={handleOpenModal}>
                                        <i className="bi bi-person-circle"></i>
                                        <span>Edit Profile</span>
                                    </button>
                                    <button className="menu-item">
                                        <i className="bi bi-gear"></i>
                                        <span>Settings</span>
                                    </button>
                                    <div className="menu-divider"></div>
                                    <button className="menu-item logout">
                                        <i className="bi bi-box-arrow-right"></i>
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Edit Profile Modal */}
            {showModal && (
                <div className="modern-modal-overlay" onClick={handleCloseModal}>
                    <div className="modern-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-icon">
                                <i className="bi bi-person-badge"></i>
                            </div>
                            <h5 className="modal-title">Edit Profile</h5>
                            <button className="modal-close" onClick={handleCloseModal}>
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label">
                                        <i className="bi bi-building"></i>
                                        Company Name
                                    </label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formCompanyName}
                                        onChange={(e) => setFormCompanyName(e.target.value)}
                                        required
                                        placeholder="Enter company name"
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label className="form-label">
                                        <i className="bi bi-person"></i>
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formYourName}
                                        onChange={(e) => setFormYourName(e.target.value)}
                                        required
                                        placeholder="Enter your name"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        <i className="bi bi-image"></i>
                                        Profile Image
                                    </label>
                                    <div className="image-upload-area">
                                        <input
                                            type="file"
                                            id="imageUpload"
                                            className="image-input"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    setFormImage(e.target.files[0]);
                                                }
                                            }}
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                        />
                                        <label htmlFor="imageUpload" className="upload-label">
                                            {formImage ? (
                                                <div className="image-preview">
                                                    <img src={URL.createObjectURL(formImage)} alt="Preview" />
                                                    <div className="preview-overlay">
                                                        <i className="bi bi-pencil"></i>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="upload-placeholder">
                                                    <i className="bi bi-cloud-upload"></i>
                                                    <span>Click to upload image</span>
                                                    <small>PNG, JPG up to 2MB</small>
                                                </div>
                                            )}
                                        </label>
                                        {formImage && (
                                            <button
                                                type="button"
                                                className="remove-image"
                                                onClick={() => setFormImage(null)}
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <button type="button" className="btn-secondary" onClick={handleCloseModal}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-primary">
                                        <i className="bi bi-check-lg"></i>
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .modern-navbar {
                    background: white;
                    box-shadow: 0 2px 15px rgba(0,0,0,0.08);
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                    backdrop-filter: blur(10px);
                    background: rgba(255,255,255,0.95);
                }

                .nav-container {
                    max-width: 1600px;
                    margin: 0 auto;
                    padding: 12px 24px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                /* Brand Section */
                .nav-brand {
                    display: flex;
                    align-items: center;
                }

                .logo-wrapper {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .brand-logo {
                    height: 45px;
                    width: auto;
                    border-radius: 12px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    transition: transform 0.3s ease;
                }

                .brand-logo:hover {
                    transform: scale(1.05);
                }

                .brand-info {
                    display: flex;
                    flex-direction: column;
                }

                .brand-name {
                    font-size: 20px;
                    font-weight: 700;
                    margin: 0;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .brand-tagline {
                    font-size: 11px;
                    color: #6c757d;
                    letter-spacing: 0.3px;
                }

                /* Actions Section */
                .nav-actions {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }

                /* DateTime Widget */
                .datetime-widget {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 8px 15px;
                    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                    border-radius: 12px;
                    cursor: default;
                }

                .datetime-widget i {
                    font-size: 20px;
                    color: #667eea;
                }

                .datetime-info {
                    display: flex;
                    flex-direction: column;
                }

                .date {
                    font-size: 11px;
                    color: #6c757d;
                    font-weight: 500;
                }

                .time {
                    font-size: 14px;
                    font-weight: 600;
                    color: #2c3e50;
                }

                /* Notifications */
                .notification-dropdown {
                    position: relative;
                }

                .notification-btn {
                    position: relative;
                    background: none;
                    border: none;
                    font-size: 22px;
                    color: #6c757d;
                    cursor: pointer;
                    padding: 8px;
                    border-radius: 10px;
                    transition: all 0.3s ease;
                }

                .notification-btn:hover {
                    background: #f8f9fa;
                    color: #667eea;
                }

                .notification-badge {
                    position: absolute;
                    top: 0;
                    right: 0;
                    background: #ef4444;
                    color: white;
                    font-size: 10px;
                    font-weight: 600;
                    padding: 2px 6px;
                    border-radius: 20px;
                    min-width: 18px;
                }

                /* User Profile */
                .user-dropdown {
                    position: relative;
                }

                .user-profile-btn {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 6px 12px;
                    border-radius: 50px;
                    transition: all 0.3s ease;
                }

                .user-profile-btn:hover {
                    background: #f8f9fa;
                }

                .profile-image-wrapper {
                    position: relative;
                }

                .profile-image {
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 2px solid #667eea;
                }

                .online-status {
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    width: 12px;
                    height: 12px;
                    background: #10b981;
                    border: 2px solid white;
                    border-radius: 50%;
                }

                .user-info {
                    display: flex;
                    flex-direction: column;
                    text-align: left;
                }

                .user-greeting {
                    font-size: 11px;
                    color: #6c757d;
                }

                .user-name {
                    font-size: 14px;
                    font-weight: 600;
                    color: #2c3e50;
                }

                .dropdown-arrow {
                    font-size: 12px;
                    color: #6c757d;
                    transition: transform 0.3s ease;
                }

                /* Dropdown Menus */
                .dropdown-menu {
                    position: absolute;
                    top: 100%;
                    right: 0;
                    margin-top: 10px;
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.15);
                    min-width: 320px;
                    z-index: 1000;
                    animation: slideDown 0.3s ease;
                    overflow: hidden;
                }

                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .notifications-menu {
                    right: 0;
                }

                .menu-header {
                    padding: 16px;
                    border-bottom: 1px solid #e9ecef;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .menu-header h6 {
                    margin: 0;
                    font-weight: 600;
                    color: #2c3e50;
                }

                .mark-all-btn {
                    background: none;
                    border: none;
                    color: #667eea;
                    font-size: 12px;
                    cursor: pointer;
                }

                .menu-items {
                    max-height: 400px;
                    overflow-y: auto;
                }

                .notification-item {
                    padding: 12px 16px;
                    display: flex;
                    gap: 12px;
                    cursor: pointer;
                    transition: background 0.3s ease;
                    position: relative;
                }

                .notification-item:hover {
                    background: #f8f9fa;
                }

                .notification-item.unread {
                    background: #eff6ff;
                }

                .notification-icon {
                    width: 40px;
                    height: 40px;
                    background: #e9ecef;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #667eea;
                }

                .notification-content {
                    flex: 1;
                }

                .notification-content p {
                    margin: 0;
                    font-size: 13px;
                    color: #2c3e50;
                }

                .notification-content span {
                    font-size: 11px;
                    color: #6c757d;
                }

                .unread-dot {
                    width: 8px;
                    height: 8px;
                    background: #ef4444;
                    border-radius: 50%;
                    position: absolute;
                    top: 20px;
                    right: 16px;
                }

                .menu-footer {
                    padding: 12px 16px;
                    border-top: 1px solid #e9ecef;
                    text-align: center;
                }

                .menu-footer a {
                    color: #667eea;
                    text-decoration: none;
                    font-size: 12px;
                }

                .user-menu {
                    min-width: 260px;
                }

                .user-header {
                    padding: 20px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }

                .user-header img {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    border: 2px solid white;
                }

                .user-header h6 {
                    margin: 0;
                    font-weight: 600;
                }

                .user-header span {
                    font-size: 11px;
                    opacity: 0.9;
                }

                .menu-item {
                    width: 100%;
                    padding: 12px 20px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: none;
                    border: none;
                    cursor: pointer;
                    transition: background 0.3s ease;
                    font-size: 14px;
                    color: #2c3e50;
                }

                .menu-item:hover {
                    background: #f8f9fa;
                }

                .menu-item.logout {
                    color: #ef4444;
                }

                .menu-divider {
                    height: 1px;
                    background: #e9ecef;
                    margin: 8px 0;
                }

                /* Modal Styles */
                .modern-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    backdrop-filter: blur(5px);
                    z-index: 1050;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: fadeIn 0.3s ease;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .modern-modal {
                    background: white;
                    border-radius: 24px;
                    width: 90%;
                    max-width: 550px;
                    max-height: 90vh;
                    overflow-y: auto;
                    animation: slideUp 0.3s ease;
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .modal-header {
                    padding: 24px 28px;
                    border-bottom: 1px solid #e9ecef;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    position: relative;
                }

                .modal-icon {
                    width: 45px;
                    height: 45px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 22px;
                }

                .modal-title {
                    font-size: 20px;
                    font-weight: 600;
                    margin: 0;
                    color: #2c3e50;
                }

                .modal-close {
                    position: absolute;
                    right: 24px;
                    top: 24px;
                    background: none;
                    border: none;
                    font-size: 20px;
                    cursor: pointer;
                    color: #6c757d;
                    transition: all 0.3s ease;
                }

                .modal-close:hover {
                    color: #ef4444;
                    transform: rotate(90deg);
                }

                .modal-body {
                    padding: 28px;
                }

                .form-group {
                    margin-bottom: 24px;
                }

                .form-label {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 8px;
                    font-weight: 500;
                    color: #2c3e50;
                }

                .form-label i {
                    color: #667eea;
                }

                .form-input {
                    width: 100%;
                    padding: 12px 16px;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    font-size: 14px;
                    transition: all 0.3s ease;
                }

                .form-input:focus {
                    outline: none;
                    border-color: #667eea;
                    box-shadow: 0 0 0 3px rgba(102,126,234,0.1);
                }

                .image-upload-area {
                    position: relative;
                }

                .upload-label {
                    display: block;
                    cursor: pointer;
                }

                .upload-placeholder {
                    border: 2px dashed #cbd5e1;
                    border-radius: 16px;
                    padding: 40px;
                    text-align: center;
                    transition: all 0.3s ease;
                }

                .upload-placeholder:hover {
                    border-color: #667eea;
                    background: #f8f9fa;
                }

                .upload-placeholder i {
                    font-size: 40px;
                    color: #667eea;
                    margin-bottom: 12px;
                    display: block;
                }

                .upload-placeholder span {
                    display: block;
                    color: #2c3e50;
                    margin-bottom: 8px;
                }

                .upload-placeholder small {
                    color: #6c757d;
                    font-size: 11px;
                }

                .image-preview {
                    position: relative;
                    display: inline-block;
                }

                .image-preview img {
                    width: 150px;
                    height: 150px;
                    object-fit: cover;
                    border-radius: 16px;
                }

                .preview-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .image-preview:hover .preview-overlay {
                    opacity: 1;
                }

                .preview-overlay i {
                    color: white;
                    font-size: 24px;
                }

                .remove-image {
                    position: absolute;
                    top: -10px;
                    right: -10px;
                    background: #ef4444;
                    border: none;
                    color: white;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                }

                .remove-image:hover {
                    transform: scale(1.1);
                }

                .modal-footer {
                    padding: 20px 28px;
                    border-top: 1px solid #e9ecef;
                    display: flex;
                    justify-content: flex-end;
                    gap: 12px;
                }

                .btn-secondary, .btn-primary {
                    padding: 10px 24px;
                    border: none;
                    border-radius: 10px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .btn-secondary {
                    background: #f1f3f5;
                    color: #495057;
                }

                .btn-secondary:hover {
                    background: #e9ecef;
                }

                .btn-primary {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(102,126,234,0.4);
                }

                @media (max-width: 768px) {
                    .nav-container {
                        padding: 10px 16px;
                    }
                    
                    .brand-tagline, .datetime-widget, .user-greeting {
                        display: none;
                    }
                    
                    .user-info {
                        display: none;
                    }
                    
                    .brand-name {
                        font-size: 16px;
                    }
                    
                    .brand-logo {
                        height: 35px;
                    }
                }
            `}</style>
        </>
    );
};

export default DashNav;