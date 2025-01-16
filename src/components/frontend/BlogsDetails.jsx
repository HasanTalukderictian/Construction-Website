import { useEffect, useState } from 'react';
import Footer from '../common/Footer';
import Header from '../common/Header';
import { useParams } from 'react-router-dom';

import '../../assets/css/style.scss';

const BlogsDetails = () => {
    const { id } = useParams(); // Extract project ID from URL
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/get-blog/${id}`) // API endpoint for specific project
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

    if (loading) return <div>Loading...</div>;
    if (!project) return <div>No Project Found</div>;

    return (
        <>
            <Header />
            <div className="container">
                <div className="row align-items-center p-2">
                    <div className="col-md-6 col-12">
                        <img
                            src={`http://127.0.0.1:8000/storage/${project.image}`}
                            alt={project.title}
                            className="img-fluid rounded-2"
                            style={{ height: '400px', objectFit: 'cover' }} // Adjusted height for responsiveness
                        />
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
                        <h1 className="text-warning" style={{ marginBottom: '20px', fontSize: '2.5rem' }}>
                            {project.title}
                        </h1>
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
