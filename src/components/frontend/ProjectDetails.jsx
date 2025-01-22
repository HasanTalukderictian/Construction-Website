import { useEffect, useState } from 'react';
import Footer from '../common/Footer';
import Header from '../common/Header';
import { useParams } from 'react-router-dom';

import '../../assets/css/ServiceDetails.scss';

const ProjectDetails = () => {
  const { id } = useParams(); // Extract project ID from URL
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/get-projects/${id}`) // API endpoint for specific project
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
        <div className="row align-items-center p-2">
          <div className="col-md-7">
            <div className="image-zoom-wrapper"> 
            <img src={`http://127.0.0.1:8000/storage/${project.image}`}
             alt={project.title}
             className="img-fluid rounded-2 image-zoom"
                onMouseMove={handleMouseMove} // Adjust zoom origin dynamically
                onMouseEnter={handleMouseEnter} // Zoom in on hover
                onMouseLeave={handleMouseLeave} 
             />
            </div>
          </div>
          <div className="col-md-5 px-4">
            <h1 className="text-warning mb-2">{project.title}</h1>
            <p>{project.description}</p>
            <p>{project.text}</p>
            <p>
              <strong>Owner:</strong> {project.owner?.name || 'N/A'}
            </p>
            <p>
              <strong>Address:</strong> {project.owner?.address || 'N/A'}
            </p>
            <p>
              <strong>Phone:</strong> {project.owner?.phone || 'N/A'}
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProjectDetails;
