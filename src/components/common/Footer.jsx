import { useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/css/footer.scss';

const Footer = () => {
    const [headerData, setHeaderData] = useState(null); // For company name & logo
    const [contactData, setContactData] = useState(null); // For phone, email, address

    // Fetch header info (Company name + logo)
    const fetchHeader = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/api/get-header');
            if (res.data.status && res.data.data.length > 0) {
                setHeaderData(res.data.data[0]);
            } else {
                setHeaderData(null);
            }
        } catch (err) {
            console.error("Failed to fetch header info:", err);
            setHeaderData(null);
        }
    };

    // Fetch contact info
    const fetchContact = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/api/get-contact');
            if (res.data.status && res.data.data) {
                setContactData(res.data.data);
            } else {
                setContactData(null);
            }
        } catch (err) {
            console.error("Failed to fetch contact info:", err);
            setContactData(null);
        }
    };

    useEffect(() => {
        fetchHeader();
        fetchContact();
    }, []);

    return (
        <footer style={{ background: "#1a1c1d", padding: "40px 0" }}>
            <div className="container">
                <div className="row align-items-start">
                    {/* Logo + Text */}
                    <div className="col-md-4 text-center mb-4 mb-md-0">
                        {headerData?.image ? (
                            <img
                                src={headerData.image}
                                alt={headerData.Companyname || "Logo"}
                                style={{
                                    maxHeight: "120px",
                                    width: "auto",
                                    display: "block",
                                    margin: "0 auto 10px auto"
                                }}
                                className="img-fluid"
                            />
                        ) : (
                            <div
                                style={{
                                    width: "120px",
                                    height: "120px",
                                    margin: "0 auto 10px auto",
                                    background: "#333",
                                    borderRadius: "8px"
                                }}
                            />
                        )}

                        <div
                            style={{
                                display: "flex",
                                gap: "15px",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                            className="footer-tags"
                        >
                            <p style={{ margin: 0, color: 'white', fontWeight: '500' }}>Quality</p>
                            <p style={{ margin: 0, color: 'white', fontWeight: '500' }}>Trust</p>
                            <p style={{ margin: 0, color: 'white', fontWeight: '500' }}>Satisfaction</p>
                        </div>
                    </div>

                    {/* Our Services */}
                    <div className='col-md-4 mb-4 mb-md-0'>
                        <h3 className='text-success'>Our Services</h3>
                        <ul className="menu-list">
                            <li><a href='/about'>About us</a></li>
                            <li><a href='/contact'>Contact us</a></li>
                        </ul>
                    </div>

                    {/* Contact Section */}
                    <div className='col-md-4 text-white'>
                        <h3 className='text-success'>Contact Us</h3>
                        <p style={{ margin: "0", color: "white" }}>
                            {contactData?.phone || "Loading..."}
                        </p>
                        <p style={{ margin: "0", color: "white" }}>
                            {contactData?.email || "Loading..."}
                        </p>
                        <p style={{ margin: "0", color: "white" }}>
                            {contactData?.address || "Loading..."}
                        </p>
                    </div>
                </div>

                <hr style={{ borderColor: "#fff", margin: "30px 0" }} />
                
                {/* Dynamic Copyright */}
                <p className='text-center text-white mb-0'>
                    Copyright by {headerData?.Companyname || 'BD Stall'} {new Date().getFullYear()} | Design & Develop by <a href='https://hasan-portfilo.netlify.app/'><span style={{ color: "#0cdb2f" }}>Hasan Talukder</span></a>
                </p>
            </div>
        </footer>
    );
};

export default Footer;