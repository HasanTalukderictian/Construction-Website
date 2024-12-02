

import Footer from '../common/Footer';
import Header from '../common/Header';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css/pagination';

import { Link } from 'react-router-dom';

import About from '../common/About';

import { useState, useEffect } from 'react';


const Home = () => {

    const [services, setServices] = useState([]);
    const [features, setFeatures] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [projects, setProjects] = useState([]);

    const [testimonials, setTestimonials] = useState([]);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {

        fetch('services.json')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => setServices(data))
            .catch((error) => console.error('Error fetching services:', error));
    }, []);


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
                const response = await fetch("blogs.json"); // Replace with your API endpoint
                const data = await response.json();
                setBlogs(data); // Assume `data` is an array of blogs
            } catch (error) {
                console.error("Error fetching blog data:", error);
            }
        };

        fetchBlogs();
    }, []);


    useEffect(() => {
        // Fetch data from the JSON file
        fetch('projects.json')
            .then((response) => response.json())
            .then((data) => setProjects(data))
            .catch((error) => console.error("Error fetching projects:", error));
    }, []);


    useEffect(() => {
        // Define the fetch function
        const fetchTestimonials = async () => {
            try {
                const response = await fetch('testomonial.json'); // Replace with your API URL

                const data = await response.json();
                setTestimonials(data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching testimonials:', error);
                setIsLoading(false);
            }
        };

        fetchTestimonials(); // Call the fetch function
    }, []);


    return (
        <>
            <Header />

            <main>

                {/* hero Section  */}
                <section className='section-1'>
                    <div className='hero d-flex align-items-center'>
                        <div className='container-fluid'>
                            <div className='text-center'>
                                <span>Welcome Amazing Construction</span>
                                <h1>Crafitng dreams with <br /> precision and excellence</h1>
                                <p>We execd at transforming visions into ready through outstanding and precise <br />
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

                <section className="section-3 py-5">
                    <div className="container-fluid py-5">
                        <div className="section-header text-center">
                            <span>Our Services</span>
                            <h2>Our Construction Services</h2>
                            <p>We Offer a diverse array of construction services, spanning residential, commercial, and industrial projects.</p>
                        </div>

                        <div className="row mt-5 mb-4">
                            {services.map((service, index) => (
                                <div className="col-md-3 col-lg-3" key={index}>
                                    <div className="item">
                                        <div className="service-image">
                                            <img src={service.image} alt={service.title} className="w-100" />
                                            <div className="service-title">
                                                <h3>{service.title}</h3>
                                            </div>
                                        </div>

                                        <div className="service-body">
                                            <div className="service-content">
                                                <p>{service.description}</p>
                                                <a href={service.link} className="btn btn-primary">
                                                    Read More
                                                </a>
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
                    <div className="container py-5">
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
                                <div className="col-md-4 mt-2 d-flex align-items-stretch" key={index}>
                                    <div
                                        className="card shadow p-4"
                                        style={{
                                            width: '100%',
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
                                            <h3>{feature.title}</h3>
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
                    <div className="container-fluid py-5">
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
                                            <img src={project.image} alt={project.title} className="w-100" />
                                            <div className="service-title">
                                                <h3 className="text-warning">{project.title}</h3>

                                            </div>
                                        </div>
                                        <div className="service-body">
                                            <div className="service-content">
                                                <p>{project.description}</p>
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

            <section className='section-5 py-5'>
                <div className='container'>
                    <div className='section-header text-center mb-4'>
                        <span>Testimonial</span>
                        <h2>What People are saying about us</h2>
                        <p>We offer a diverse array of construction services, spanning residential, commercial, and industrial projects.</p>
                    </div>

                    {isLoading ? (
                        <div className="text-center">Loading...</div>
                    ) : (
                        <Swiper
                            modules={[Pagination]}
                            spaceBetween={30}
                            slidesPerView={3}
                            pagination={{ clickable: true }}
                            breakpoints={{
                                640: { slidesPerView: 1, spaceBetween: 10 },
                                768: { slidesPerView: 2, spaceBetween: 20 },
                                1024: { slidesPerView: 3, spaceBetween: 30 },
                            }}
                        >
                            {testimonials.map((testimonial, index) => (
                                <SwiperSlide key={index}>
                                    <div className='card shadow border-0'>
                                        <div className='card-body p-4'>
                                            <div className='rating'>
                                                {[...Array(testimonial.rating)].map((_, i) => (
                                                    <svg
                                                        key={i}
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="20"
                                                        height="20"
                                                        fill="currentColor"
                                                        className="bi bi-star-fill"
                                                        viewBox="0 0 16 16"
                                                    >
                                                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                                    </svg>
                                                ))}
                                            </div>
                                            <div className='content pt-4 pb-3'>
                                                <p>{testimonial.comment}</p>
                                            </div>
                                            <hr />
                                            <div className='d-flex'>
                                                <div>
                                                    <img
                                                        src={testimonial.image}
                                                        width={60}
                                                        className="rounded-circle"
                                                        alt={testimonial.name}
                                                    />
                                                </div>
                                                <div className='pt-2 px-3'>
                                                    <div className='name'>{testimonial.name}</div>
                                                    <div>{testimonial.designation}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}
                </div>
            </section>

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
                        {blogs.map((blog, index) => (
                            <div className="col-md-4 mb-3 d-flex align-items-stretch" key={index}>
                                <div
                                    className="card shadow border-0"
                                    style={{
                                        width: "100%",
                                        height: "500px", // Set consistent height
                                    }}
                                >
                                    <div className="card-img-top">
                                        <img
                                            src={blog.image} // Assuming `blog.image` contains the image URL
                                            className="w-100"
                                            alt={blog.title}
                                            style={{ height: "300px", objectFit: "cover" }}
                                        />
                                    </div>
                                    <div className="card-body p-4 text-center p-4">
                                        <div>
                                            <a href={blog.link} className="title">
                                                {blog.title} {/* Assuming `blog.title` contains the title */}
                                            </a>
                                        </div>
                                        <a href={blog.link} className="btn btn-primary mt-2">
                                            Read More
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>



        </main >

            <Footer />


        </>
    )
}

export default Home
