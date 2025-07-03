import { useEffect, useState } from 'react';
import Footer from '../common/Footer';
import Header from '../common/Header';
import { useParams } from 'react-router-dom';

import '../../assets/css/ServiceDetails.scss';

import '../../assets/css/style.scss';

const BlogsDetails = () => {
    const { id } = useParams(); // Extract project ID from URL
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const BASE_URL = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        fetch(`${BASE_URL}/api/get-blog/${id}`) // API endpoint for specific project
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                console.log(data); // Log to check response structure
                setProject(data.data);  // Assuming 'data' is the field containing the project
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching project details:', error);
                setLoading(false);
            });
    }, [id]);

    // Utility function to strip HTML tags from a string
    const stripHtmlTags = (html) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        return tempDiv.textContent || tempDiv.innerText || '';
    };



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
  

    if (loading) return <div>Loading...</div>;
    if (!project) return <div>No Project Found</div>;

    return (
        <>
            <Header />
            <div className="container">
            <h1 className="text-warning text-center" style={{ marginBottom: '20px', fontSize: '2.5rem' }}>
                            {project.title}
                        </h1>
                <div className="row align-items-center p-2">
                    <div className="col-md-6 col-12">
                        <div className='image-zoom-wrapper'>
                            <img
                                src={`${BASE_URL}/storage/${project.image}`}
                                alt={project.title}
                                className="img-fluid rounded-2 image-zoom"
                                onMouseMove={handleMouseMove} // Adjust zoom origin dynamically
                                onMouseEnter={handleMouseEnter} // Zoom in on hover
                                onMouseLeave={handleMouseLeave}
                            // Adjusted height for responsiveness
                            />
                        </div>
                    </div>

                    <div
                        className="col-md-6 col-12"
                        style={{
                            marginTop: '20px',  // Adjusted margin for mobile responsiveness
                            position: 'relative',
                            overflow: 'hidden',
                            textAlign: 'justify',
                        }}
                    >
                       
                        <p style={{ marginBottom: '15px', lineHeight: '1.6', fontSize: '1.1rem' }}>
                            {stripHtmlTags(project.description)}
                        </p> {/* HTML tags removed */}
                        <p style={{ marginBottom: '0', lineHeight: '1.6', fontSize: '1.1rem' }}>
                            {stripHtmlTags(project.text)}
                        </p> {/* HTML tags removed */}
                    </div>

                </div>
            </div>
            <Footer />
        </>
    );
};

export default BlogsDetails;
