import Footer from "../common/Footer";
import Header from "../common/Header";
import { default as AboutNew } from '../common/About';
import '../../assets/css/about.scss';

import { useEffect, useState } from "react";
import axios from "axios";

export const API_BASE = import.meta.env.VITE_API_BASE_URL;

const About = () => {

    const [team, setTeam] = useState([]);

    // Fetch team data from API
    useEffect(() => {
        axios.get(`${API_BASE}/get-team`)
            .then((res) => {
                if (res.data.status) {
                    setTeam(res.data.data);
                }
            })
            .catch((err) => {
                console.log("API Error:", err);
            });
    }, []);

    return (
        <>
            <Header />

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

            <AboutNew />

            {/* Our Team */}
            <section className="section-8 py-5">
                <div className="container mt-5">

                    <div className='section-header text-center'>
                        <span className="mt-10">Team</span>
                        <h2>Our Team</h2>
                        <p>
                            We deliver modern IT gadgets, smart devices, and reliable technology solutions for everyday and professional needs
                        </p>
                    </div>

                    <div className='row pt-3'>

                        {team.length > 0 ? (
                            team.map((member) => (

                                <div className='col-md-6 col-lg-3 mb-3' key={member.id}>
                                    <div className='card shadow border-0'>

                                        <div
                                            className='card-img-top'
                                            style={{
                                                height: "260px",
                                                overflow: "hidden"
                                            }}
                                        >
                                            <img
                                                src={member.image}
                                                alt={member.name}
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover",   // main magic
                                                    objectPosition: "center"
                                                }}
                                            />
                                        </div>

                                        <div className="card-title pb-0 mb-0">
                                            {member.name}
                                        </div>

                                        <div className="card-sub-title">
                                            {member.designation}
                                        </div>

                                        <div className="card-icon mb-2">
                                            <a href="#" className="text-primary fs-4">
                                                <i className="bi bi-linkedin"></i>
                                            </a>
                                        </div>

                                    </div>
                                </div>

                            ))
                        ) : (
                            <div className="text-center">No team members found</div>
                        )}

                    </div>

                </div>
            </section>

            <Footer />
        </>
    );
};

export default About;