import Header from "../common/Header";

import Common from "../common/Common";

import Protflio from '../../assets/images/construction122.jpg';
import Footer from "../common/Footer";
import '../../assets/css/ServiceDetails.scss';


const Portfilo = () => {

    // Function to handle mouse movement for zooming
    const handleMouseMove = (e) => {
        const rect = e.target.getBoundingClientRect(); // Get the bounding box of the image
        const x = ((e.clientX - rect.left) / rect.width) * 100; // Calculate X percentage
        const y = ((e.clientY - rect.top) / rect.height) * 100; // Calculate Y percentage
        e.target.style.transformOrigin = `${x}% ${y}%`; // Dynamically set the zoom origin
    };

    const handleMouseEnter = (e) => {
        e.target.style.transform = 'scale(4.0)'; // Zoom in when the mouse enters
    };

    const handleMouseLeave = (e) => {
        e.target.style.transform = 'scale(1)'; // Reset zoom when the mouse leaves
    };




    return (
        < >
            <Header />
            <div className="mt-4">

                <main>
                    <Common preHeading='Quality,Integrity,Value'
                        heading='Our Fortfilo'
                        text='We execd at transforming visions into ready <br />
                        through outstanding and precise'/>

                    <section className='section-6 bg-light py-4'>
                        <div className=''>
                            <div className="row d-flex align-items-center px-4">
                                <div className="col-md-7 ">
                                    <div className="image-zoom-wrapper">
                                        <img src={Protflio} alt="here visible image"
                                            className="img-fluid rounded-2 image-zoom"
                                            onMouseMove={handleMouseMove} // Adjust zoom origin dynamically
                                            onMouseEnter={handleMouseEnter} // Zoom in on hover
                                            onMouseLeave={handleMouseLeave}

                                        />
                                    </div>
                                </div>

                                <div className="col-md-5">
                                    <h2 className="text-center mb-4 text-warning mt-5">About Our Company</h2>
                                    <p className="px-4">
                                        Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32
                                    </p>
                                </div>
                            </div>
                        </div>

                    </section>

                </main>

            </div>

            <Footer />
        </>
    )
}

export default Portfilo;
