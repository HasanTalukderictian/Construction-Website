// import '../../assets/css/footer.scss';
// import Logo from '../../assets/images/logo1.png';

// const Footer = () => {
//     return (
//         <footer style={{ background: "#1a1c1d", padding: "40px 0" }}>
//             <div className="container">
//                 <div className="row align-items-start">
//                     {/* Logo + Text */}
//                     <div className="col-md-4 text-center mb-4 mb-md-0">
//                         <img
//                             src={Logo}
//                             alt="BDStall Logo"
//                             style={{
//                                 maxHeight: "120px",
//                                 width: "auto",
//                                 display: "block",
//                                 margin: "0 auto 10px auto" // center logo
//                             }}
//                             className="img-fluid"
//                         />
//                         <div style={{
//                             display: "flex",
//                             gap: "15px",
//                             justifyContent: "center", // horizontal center
//                             alignItems: "center", // vertical align center
//                         }} className="footer-tags">
//                             <p style={{ margin: 0, color: 'white', fontWeight: '500' }}>Quality</p>
//                             <p style={{ margin: 0, color: 'white', fontWeight: '500' }}>Trust</p>
//                             <p style={{ margin: 0, color: 'white', fontWeight: '500' }}>Satisfaction</p>
//                         </div>
//                     </div>


//                     {/* Gazi Builders */}
//                     {/* <div className='col-md-3 mb-4 mb-md-0'>
//                         <h5 className='text-white'>Gazi Builders</h5>
//                         <ul className='menu-list'>
//                             <li><a>Speciality Construction</a></li>
//                             <li><a>Civil Construction</a></li>
//                             <li><a>Residental Construction</a></li>
//                             <li><a>Corporate Construction</a></li>
//                             <li><a>Building Construction</a></li>
//                             <li><a>Industrial Construction</a></li>
//                         </ul>
//                     </div> */}

//                     {/* Our Services */}
//                     <div className='col-md-4 mb-4 mb-md-0'>
//                         <h3 className='text-success'>Our Services</h3>
//                         <ul className="menu-list">
//                             <li><a href='/about'>About us</a></li>
//                             {/* <li><a href='/product'>Product</a></li> */}
//                             <li><a href='/contact'>Contact us</a></li>
//                         </ul>
//                     </div>

//                     {/* Contact */}
//                     <div className='col-md-4 text-white'>
//                         <h3 className='text-success'>Contact Us</h3>
//                         <p style={{ margin: "0", color: "white" }}>01768712230</p>
//                         <p style={{ margin: "0", color: "white" }}>hasantalukdercou@gmail.com</p>
//                         <p style={{ margin: "0", color: "white" }}>Mohammadpur Dhaka, 1202</p>
//                     </div>
//                 </div>

//                 <hr style={{ borderColor: "#fff", margin: "30px 0" }} />
//                 <p className='text-center text-white mb-0'>
//                     Copyright by BD Stall {new Date().getFullYear()} | Design & Develop by <a href='https://hasan-portfilo.netlify.app/'><span style={{ color: "#0cdb2f" }}>Hasan Talukder</span></a>
//                 </p>
//             </div>
//         </footer>
//     );
// }

// export default Footer;



import { useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/css/footer.scss';

const Footer = () => {
    const [contactData, setContactData] = useState(null);

    // Fetch contact info from API
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
        fetchContact();
    }, []);

    return (
        <footer style={{ background: "#1a1c1d", padding: "40px 0" }}>
            <div className="container">
                <div className="row align-items-start">
                    {/* Logo + Text */}
                    <div className="col-md-4 text-center mb-4 mb-md-0">
                        {contactData?.image ? (
                            <img
                                src={contactData.image}
                                alt="BDStall Logo"
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
                            {contactData ? contactData.phone : 'Loading...'}
                        </p>
                        <p style={{ margin: "0", color: "white" }}>
                            {contactData ? contactData.email : 'Loading...'}
                        </p>
                        <p style={{ margin: "0", color: "white" }}>
                            {contactData ? contactData.address : 'Loading...'}
                        </p>
                    </div>
                </div>

                <hr style={{ borderColor: "#fff", margin: "30px 0" }} />
                <p className='text-center text-white mb-0'>
                    Copyright by BD Stall {new Date().getFullYear()} | Design & Develop by <a href='https://hasan-portfilo.netlify.app/'><span style={{ color: "#0cdb2f" }}>Hasan Talukder</span></a>
                </p>
            </div>
        </footer>
    );
};

export default Footer;