

const Footer = () => {
    return (
        <>
            <footer>
                <div className='container'>
                    <div className='container mt-10 p-1'>
                        <div className='row mt-5'>
                            <div className='col-md-3'>
                                <h3 className='text-white'>Gazi Builders</h3>
                                <p className='text-white'>
                                    Our post-construction services give you peace of mind knowing that we are still here for you even after.
                                </p>
                            </div>
                            <div className='col-md-3'>
                                <h3 className='text-white'>Gazi Builders</h3>
                                <ul className='text-white'>
                                    <li><a>Speciality Construction</a></li>
                                    <li><a>Civil Construction</a></li>
                                    <li><a>Residental Construction</a></li>
                                    <li><a>Corporate Construction</a></li>
                                    <li><a>Building Construction</a></li>
                                    <li><a>Industrial Construction</a></li>
                                </ul>
                            </div>
                            <div className='col-md-3'>
                                <h3 className='text-white'>Our Services</h3>
                                <ul className='text-white'>
                                    <li>About us</li>
                                    <li>Services</li>
                                    <li>Projects</li>
                                    <li>Blog</li>
                                    <li>Contact us</li>
                                </ul>
                            </div>
                            <div className='col-md-3 text-white'>
                                <h3>Contact Us</h3>
                                <p className="text-white">01768712230</p>
                                <p className="text-warning">info.gazibulider@gmail.com</p>
                                <p className="text-white">Mohammadpur Dhaka, 1202</p>
                            </div>
                        </div>
                        <hr className='text-white' />
                        <p className='text-center text-white pt-4'>
                            Copyright by Gazi Construction {new Date().getFullYear()} Design and Develop by
                            <a href="https://hasan-portfilo.netlify.app/" target="_blank" rel="noopener noreferrer">
                                <span> Hasan Talukder</span>
                            </a>
                        </p>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer
