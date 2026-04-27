import Footer from "../common/Footer";
import Header from "../common/Header";
import { default as AboutNew } from '../common/About';
import '../../assets/css/about.scss';

import { useEffect, useState } from "react";
import axios from "axios";

// Base URL configuration (backend location)
const BACKEND_URL = "http://localhost:8000";
export const API_BASE = `${BACKEND_URL}/api`;

const About = () => {
    const [team, setTeam] = useState([]);
    const [aboutData, setAboutData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Fetch About Data
        axios.get(`${API_BASE}/about/index`)
            .then((res) => {
                if (res.data.success) {
                    setAboutData(res.data.data);
                }
            })
            .catch((err) => console.log("About API Error:", err))
            .finally(() => setLoading(false));

        // 2. Fetch Team Data
        axios.get(`${API_BASE}/get-team`)
            .then((res) => {
                if (res.data.status) {
                    setTeam(res.data.data);
                }
            })
            .catch((err) => console.log("Team API Error:", err));
    }, []);

    return (
        <>
            <Header />

            {/* Banner Section */}
            <div className="about-section">
                <div className="container text-center">
                    <div className="py-5">
                        <h2 className="text-white m-0">About Us</h2>
                        <p className="text-white m-2">
                            Quality is our promise, and client satisfaction is our top priority.
                        </p>
                    </div>
                </div>
            </div>

            {/* Dynamic About Sections */}
            <section className="about-content-wrapper py-5 bg-light">
                <div className="container">
                    {loading ? (
                        <div className="text-center py-5">Loading...</div>
                    ) : (
                        aboutData.map((item, index) => (
                            <div className={`row align-items-center mb-5 ${index % 2 !== 0 ? 'flex-row-reverse' : ''}`} key={item.id}>
                                {/* Image Column */}
                                <div className="col-md-6 mb-4 mb-md-0">
                                    <div className="about-img-box shadow-sm rounded-4 overflow-hidden">
                                        {item.image ? (
                                            <img 
                                                src={`${BACKEND_URL}/${item.image}`} 
                                                alt={item.title} 
                                                className="img-fluid w-100"
                                                style={{ maxHeight: '400px', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <div className="bg-secondary text-white d-flex align-items-center justify-content-center" style={{ height: '300px' }}>
                                                No Image Available
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {/* Text Column */}
                                <div className="col-md-6 px-lg-5">
                                    <div className="section-header text-start mb-3">
                                        <h2 className="mt-2 fw-bold">{item.title}</h2>
                                    </div>
                                    <p className="text-muted lead-sm" style={{ textAlign: 'justify', lineHeight: '1.8' }}>
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Tomari existing AboutNew Component thakle ekhane thakbe */}
            {/* <AboutNew /> */}

            {/* Our Team Section */}
            <section className="section-8 py-5">
                <div className="container mt-5">
                    <div className='section-header text-center'>
                        <span className="mt-10">Team</span>
                        <h2>Our Team</h2>
                        <p>We deliver modern IT gadgets, smart devices, and technology solutions.</p>
                    </div>

                    <div className='row pt-3'>
                        {team.length > 0 ? (
                            team.map((member) => (
                                <div className='col-md-6 col-lg-3 mb-3' key={member.id}>
                                    <div className='card shadow border-0'>
                                        <div className='card-img-top' style={{ height: "260px", overflow: "hidden" }}>
                                            <img
                                                src={member.image}
                                                alt={member.name}
                                                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
                                            />
                                        </div>
                                        <div className="card-title text-center pt-3 pb-0 mb-0 fw-bold">{member.name}</div>
                                        <div className="card-sub-title text-center text-muted mb-2">{member.designation}</div>
                                        <div className="card-icon mb-3 text-center">
                                            <a href="#" className="text-primary fs-4"><i className="bi bi-linkedin"></i></a>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center col-12 text-muted">No team members found</div>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
};

export default About;