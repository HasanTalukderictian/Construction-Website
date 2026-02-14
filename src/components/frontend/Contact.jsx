import React, { useState } from 'react';
import Common from "../common/Common";
import Footer from "../common/Footer";
import Header from "../common/Header";
import '../../assets/css/map.scss';

const Contact = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        if (!form.name) newErrors.name = 'Name is required';
        if (!form.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = 'Email address is invalid';
        }
        if (!form.phone) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\d{11}$/.test(form.phone)) {
            newErrors.phone = 'Phone number must be 10 digits';
        }
        if (!form.subject) newErrors.subject = 'Subject is required';
        if (!form.message) newErrors.message = 'Message is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('Form submitted:', form);
            setForm({ name: '', email: '', phone: '', subject: '', message: '' });
            setErrors({});
        }
    };

    return (
        <>
            <Header />
            <main>
                <Common
                    preHeading="Quality, Integrity, Value"
                    heading="Contact Us"
                    text="We excel at transforming visions into reality through outstanding precision."
                />
                <section className="section-9 py-5">
                    <div className="container">
                        <div className="section-header text-center">
                            <h2>Contact Us</h2>
                            <p>Our dedicated experts are here to help you. Fill out the form below, and we’ll be in touch shortly.</p>
                        </div>
                        <div className="row">
                            <div className="col-md-3 mb-3">
                                <div className="card rounded-5 shadow border-0">
                                    <div className="card-body p-4">
                                        <h3>Call Us</h3>
                                        <div><a href="tel:000123678" style={{ textDecoration: 'none' }}>(000-123-678)</a></div>
                                        <h3 className="mt-4">Email Us</h3>
                                        <div><a href="mailto:example@gmail.com" style={{ textDecoration: 'none' }}>example@gmail.com</a></div>
                                        <h3 className="mt-4">Address</h3>
                                        <div>Mohampur 12/A/234</div>
                                        <div>Luckdown, Uttar, Paron</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-9">
                                <div className="card rounded-5 shadow border-0">
                                    <div className="card-body p-5">
                                        <form onSubmit={handleSubmit}>
                                            <div className="row mt-5">
                                                <div className="col-md-6 mb-4">
                                                    <label className="form-label">Name</label>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        placeholder="Enter Your Name"
                                                        className="form-control form-control-lg"
                                                        value={form.name}
                                                        onChange={handleChange}
                                                    />
                                                    {errors.name && <small className="text-danger">{errors.name}</small>}
                                                </div>
                                                <div className="col-md-6 mb-4">
                                                    <label className="form-label">Email</label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        placeholder="Enter Your Email"
                                                        className="form-control form-control-lg"
                                                        value={form.email}
                                                        onChange={handleChange}
                                                    />
                                                    {errors.email && <small className="text-danger">{errors.email}</small>}
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6 mb-4">
                                                    <label className="form-label">Phone</label>
                                                    <input
                                                        type="text"
                                                        name="phone"
                                                        placeholder="Enter Your Phone Number"
                                                        className="form-control form-control-lg"
                                                        value={form.phone}
                                                        onChange={handleChange}
                                                    />
                                                    {errors.phone && <small className="text-danger">{errors.phone}</small>}
                                                </div>
                                                <div className="col-md-6 mb-4">
                                                    <label className="form-label">Subject</label>
                                                    <input
                                                        type="text"
                                                        name="subject"
                                                        placeholder="Subject.."
                                                        className="form-control form-control-lg"
                                                        value={form.subject}
                                                        onChange={handleChange}
                                                    />
                                                    {errors.subject && <small className="text-danger">{errors.subject}</small>}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="form-label">Message</label>
                                                <textarea
                                                    name="message"
                                                    placeholder="Write Your Message"
                                                    rows={5}
                                                    className="form-control form-control-lg"
                                                    value={form.message}
                                                    onChange={handleChange}
                                                />
                                                {errors.message && <small className="text-danger">{errors.message}</small>}
                                            </div>
                                            <button className="btn btn-primary rounded-4 mt-4" type="submit">
                                                Submit
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Google map section */}

                <section className="py-5">
                    <div className="container"> {/* change from container-fuild to container */}
                        <h3 className="text-center mb-4">Our Location</h3>
                        <div className="map-responsive rounded-4 shadow-sm overflow-hidden">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.6329379236195!2d90.37009277410068!3d23.76046548839214!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755bf5506eb5c45%3A0x6d13d2265f074f5f!2sAsad%20Gate%20Bus%20Stand!5e0!3m2!1sen!2sbd!4v1730318755072!5m2!1sen!2sbd"
                                width="100%"
                                height="550"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>
                </section>

            </main>
            <Footer />
        </>
    );
};

export default Contact;
