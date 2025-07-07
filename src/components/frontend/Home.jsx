import Footer from '../common/Footer';
import Header from '../common/Header';

import 'swiper/css/pagination';

import { Link } from 'react-router-dom';

import About from '../common/About';

import { useState, useEffect } from 'react';
import Testominal from './Testominal';

import '../../assets/css/style.scss'

import Video from './Video';

import API from '../../config/api.js';
import Whatsapp from './Whatsapp.jsx';



const Home = () => {

    const [services, setServices] = useState([]);
    const [features, setFeatures] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [projects, setProjects] = useState([]);
    const [visibleBlogs, setVisibleBlogs] = useState(6);

      const BASE_URL = import.meta.env.VITE_BASE_URL;


    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch(API.GET_SERVICES);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setServices(data.data); // Access the 'data' field in the response
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        };

        fetchServices();
    }, []); // Empty dependency array means this effect runs only once on mount


    useEffect(() => {
        const fetchFeatures = async () => {
            try {

                const response = await fetch(API.GET_FEATURES);
                if (!response.ok) {
                    throw new Error(`Network response was not ok. Status: ${response.status}`);
                }

                const data = await response.json();
                setFeatures(data);
            } catch (error) {
                console.error('Error fetching features:', error.message);
            }
        };

        fetchFeatures();
    }, []);





    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch(API.GET_BLOGS);

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();

                // Optional: Check if result.data is an array
                if (!Array.isArray(result.data)) {
                    throw new Error('Invalid data format: Expected an array');
                }

                setBlogs(result.data);
            } catch (error) {
                console.error('Error fetching blog data:', error.message);
            }
        };

        fetchBlogs();
    }, []);



    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch(API.GET_PROJECTS);
                if (!response.ok) {
                    throw new Error(`Network response was not ok. Status: ${response.status}`);
                }

                const data = await response.json();
                setProjects(data.data); // Access the 'data' field in the response
            } catch (error) {
                console.error('Error fetching projects:', error.message);
            }
        };

        fetchProjects();
    }, []);


    const showMoreBlogs = () => {
        setVisibleBlogs((prevVisible) => prevVisible + 6); // Show 6 more blogs
    };

    return (
        <>
            <Header />

            <main>

                {/* hero Section  */}
                <section className='section-1'>
                    <div className='hero d-flex align-items-center'>
                        <div className='container-fluid px-5'>
                            <div className='text-center'>
                                <span>Welcome Amazing Construction</span>
                                <h1>Crafitng dreams with <br /> precision and excellence</h1>
                                <p className='text-white'>We execd at transforming visions into ready through outstanding and precise <br />
                                    attention to detailswith years of experience and a dedification to quality</p>

                                <div className='mt-4'>
                                    <a href='/contact' className='btn btn-primary'> Contact Now</a>
                                    <a href='/projects' className='btn btn-secondary ms-2'>View Projects</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* About Us Section */}

                <About />

                {/* Video Section */}

                <Video />
                {/* Our Services  */}

                <section className='section-3 py-5'>
                    <div className='container-fluid py-5 px-5'>
                        <div className='section-header text-center'>
                            <span>Our Services</span>
                            <h2>Our Constructions Services</h2>
                            <p>We offer a diverse array of construction services, spanning residential, commercial, and industrial projects.</p>
                        </div>

                        <div className='row mt-5 mb-4'>
                            {services.map(service => (
                                <div className='col-12 col-md-3 col-lg-3' key={service.id}>
                                    <div className='item'>
                                        <div className='service-image'>
                                            <img
                                                src={`${BASE_URL}/storage/${service.image}`} // Assuming your images are in storage
                                                alt={service.title}
                                                className="w-100"
                                            />
                                            <div className='service-title'>
                                                <h3>{service.title}</h3>
                                            </div>
                                        </div>

                                        <div className='service-body'>
                                            <div className='service-content'>
                                                <p className='text-white'>{service.description.replace(/<[^>]*>/g, '')}</p>

                                                <Link to={`/services/${service.id}`} className='btn btn-primary'>Read More</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>



                {/* Why Choose Us */}

                <section className="section-4 py-5">
                    <div className="container-fluid py-5 px-3 px-md-5">
                        <div className="section-header text-center mb-4">
                            <span>Why Choose Us</span>
                            <h2>Discover our wide variety of projects</h2>
                            <p>
                                Created in close partnership with our clients and collaborators, this approach merges industry expertise,
                                decades of experience, innovation, and flexibility to consistently deliver excellence.
                            </p>
                        </div>

                        <div className="row">
                            {features.map((feature, index) => (
                                <div className="col-12 col-sm-6 col-md-4 d-flex align-items-stretch mt-4" key={index}>
                                    <div className="card shadow p-4 w-100 h-100">
                                        <div className="card-icon text-center mt-2">
                                            <img
                                                src={feature.icon}
                                                alt={feature.title}
                                                style={{ maxWidth: '80px', maxHeight: '80px' }}
                                            />
                                        </div>
                                        <div className="card-title mt-3">
                                            <h3 className="text-center">{feature.title}</h3>
                                        </div>
                                        <div className="mb-3">
                                            <p>{feature.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Our Projects */}

                <section className="section-3 py-5">
                    <div className="container-fluid py-5 px-5">
                        <div className="section-header text-center">
                            <span>Our Projects</span>
                            <h2>Discover our diverse range of projects</h2>
                            <p>We offer a diverse array of construction services, spanning residential, commercial, and industrial projects</p>
                        </div>

                        <div className="row mt-5 mb-4">
                            {projects.map((project) => (
                                <div className="col-12 col-md-3 col-lg-3" key={project.id}>
                                    <div className="item">
                                        <div className="service-image">
                                            <img
                                                src={`${BASE_URL}/storage/${project.image}`} // Assuming your images are in storage
                                                alt={project.title}
                                                className="w-100"
                                            />
                                            <div className="service-title">
                                                <h3 className="text-warning">{project.title}</h3>
                                            </div>
                                        </div>
                                        <div className="service-body">
                                            <div className="service-content">
                                                <p className='text-white'>{project.description}</p>
                                                <Link to={`/project/${project.id}`} className="btn btn-primary">
                                                    Read More
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </section>




                {/* testomonial section  */}

                <Testominal />

                {/* blogs section */}

                <section className="section-6 bg-light py-5">
                    <div className="container">
                        <div className="section-header text-center mb-4">
                            <span>Blog & News</span>
                            <h2>Articles & Blog Posts</h2>
                            <p>
                                We specialize in a wide range of construction services, including residential and industrial
                                projects.
                            </p>
                        </div>

                        <div className="row pt-3">
                            {blogs.slice(0, visibleBlogs).map((blog) => (
                                <div className="col-md-4 mb-3 d-flex align-items-stretch" key={blog.id}>
                                    <div className="card shadow border-0" style={{ width: "100%", height: "500px" }}>
                                        <div className="card-img-top">
                                            <img
                                                src={`${BASE_URL}/storage/${blog.image}`}
                                                className="w-100"
                                                alt={blog.title}
                                                style={{ height: "300px", objectFit: "cover" }}
                                            />
                                        </div>
                                        <div className="card-body p-4 text-center">
                                            <h5 className="card-title">
                                                <a
                                                    href="#"
                                                    className="text-dark text-decoration-none"
                                                    style={{ fontWeight: "600" }}
                                                >
                                                    {blog.title}
                                                </a>
                                            </h5>

                                            <Link to={`/blog/${blog.id}`} className="btn btn-primary">
                                                Read More
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* More Button */}
                        {visibleBlogs < blogs.length && (
                            <div className="text-center mt-4">
                                <button className="btn btn-primary" onClick={showMoreBlogs}>
                                    More
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                <section className="section-6 bg-light py-5">
                

                    <Whatsapp/>




                </section>





            </main >

            <Footer />

        </>
    )
}

export default Home
