import AboutImg from '../../assets/images/imagebdstall.png';

const About = () => {
    return (
        <>
            <section className='section-2 py-5 bg-light'>

                <div className='container'>

                    {/* Image + Text Row */}
                    <div className='row align-items-center'>
                        <div className='col-md-6'>
                            <img src={AboutImg} className='w-100 rounded' alt="About BDStall" />
                        </div>

                        <div className='col-md-6'>
                            <p className="text-success fs-4 fw-semibold">
                                About Us
                            </p>

                            <p className='mt-4 text-black'>
                                BDStall is a trusted online shopping platform in Bangladesh where you can discover trendy fashion, traditional wear, daily essentials, and lifestyle products — all in one place. We deliver quality products directly to your doorstep anywhere in the country.

                                From everyday needs to special occasions, BDStall makes shopping simple with secure checkout, easy payment options, and customer-friendly return policies.

                                We are not just a marketplace — we aim to be a part of your lifestyle.
                            </p>
                        </div>
                    </div>

                    {/* New Horizontal Div Below */}
                    <div className='row mt-5 text-center'>
                        <div className='col-md-4 text-start'>
                            <h5 className='text-success fs-4 fw-semibold mb-2'>Our Mission</h5>
                            <p className='text-black'>
                                Our mission is to make online shopping simple, secure, and reliable for every customer in Bangladesh.
                                We strive to connect trusted sellers with real buyers while ensuring quality products, fair pricing,
                                and a smooth shopping experience from order to delivery.
                            </p>
                        </div>

                        <div className='col-md-4 text-start'>
                            <h5 className='text-success fs-4 fw-semibold mb-2'>Our Vision</h5>
                            <p className='text-black'>
                                Our vision is to become one of Bangladesh’s most customer-trusted online marketplaces,
                                where people confidently shop for their daily needs and lifestyle products.
                                We aim to build long-term relationships based on transparency, reliability, and satisfaction.
                            </p>
                        </div>

                        <div className='col-md-4 text-start'>
                            <h5 className='text-success fs-4 fw-semibold mb-2'>History</h5>
                            <p className='text-black'>
                                BDStall was established in  2025 with a vision to create a reliable and customer-focused online marketplace in Bangladesh.
                                Since the beginning, our goal has been to make online shopping simple, trustworthy, and accessible for everyone.
                            </p>
                        </div>
                    </div>

                </div>
            </section>
        </>
    )
}

export default About
