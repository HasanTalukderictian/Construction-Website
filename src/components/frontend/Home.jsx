import Footer from '../common/Footer';
import Header from '../common/Header';

import 'swiper/css/pagination';

import { Link } from 'react-router-dom';

import About from '../common/About';

import { useState, useEffect } from 'react';
import Testominal from './Testominal';

import '../../assets/css/style.scss'

import whatsapp from '../../assets/images/whatsapp-icon.png';



const Home = () => {

    const [services, setServices] = useState([]);
    const [features, setFeatures] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [projects, setProjects] = useState([]);
    const [visibleBlogs, setVisibleBlogs] = useState(6);


    useEffect(() => {
        // Fetch service data from the API
        fetch('http://127.0.0.1:8000/api/get-service')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setServices(data.data); // Access the 'data' field in the response
            })
            .catch((error) => console.error('Error fetching services:', error));
    }, []); // Empty dependency array means this effect runs only once on mount


    useEffect(() => {
        // Fetch data from the JSON file or API endpoint
        fetch('whyChooseUs.json')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => setFeatures(data))
            .catch((error) => console.error('Error fetching features:', error));
    }, []);




    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/get-blogs");
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                // console.log(result.data); // Log the fetched data
                setBlogs(result.data); // Assuming `result.data` contains the array of blogs
            } catch (error) {
                console.error("Error fetching blog data:", error);
            }
        };

        fetchBlogs();
    }, []);


    useEffect(() => {
        // Fetch service data from the API
        fetch('http://127.0.0.1:8000/api/get-projects')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setProjects(data.data); // Access the 'data' field in the response
            })
            .catch((error) => console.error('Error fetching services:', error));
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
                                                src={`http://127.0.0.1:8000/storage/${service.image}`} // Assuming your images are in storage
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
                    <div className="container-fluid py-5 px-5 ">
                        <div className="section-header text-center mb-4">
                            <span>Why Choose Us</span>
                            <h2>Discover our wide variety of projects</h2>
                            <p>
                                Created in close partnership with our clients and collaborators, this approach merges industry expertise,
                                decades of experience, innovation, and flexibility to consistently deliver excellence.
                            </p>
                        </div>

                        <div className="row ">
                            {features.map((feature, index) => (
                                <div className="col-md-4 mt-5 d-flex align-items-stretch" key={index}>
                                    <div
                                        className="card shadow p-4"
                                        style={{
                                            width: '80%',
                                            height: '400px', // Set a consistent height for all cards
                                        }}
                                    >
                                        <div className="card-icon text-center mt-2">
                                            <img
                                                src={feature.icon}
                                                alt={feature.title}
                                                style={{ maxWidth: '80px', maxHeight: '80px' }}
                                            />
                                        </div>
                                        <div className="card-title mt-3">
                                            <h3 className='text-center'>{feature.title}</h3>
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
                                                src={`http://127.0.0.1:8000/storage/${project.image}`} // Assuming your images are in storage
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
                                        src={`http://127.0.0.1:8000/storage/${blog.image}`}
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
    <a 
        href="https://wa.me/01758672876?text=Hi,How can I help you!" 
        className="whatsapp-sticky" 
        target="_blank"
        style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: '9999'
        }}
    >
        <img 
            src={whatsapp} 
            alt="WhatsApp Chat" 
            style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                cursor: 'pointer'
            }} 
        />
    </a>
</section>





            </main >

            <Footer />

        </>
    )
}

export default Home
