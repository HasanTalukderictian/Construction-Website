import { useEffect, useState } from 'react';
import Footer from '../common/Footer';
import Header from '../common/Header';
import { useParams } from 'react-router-dom';

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

  if (loading) return <div>Loading...</div>;
  if (!project) return <div>No Project Found</div>;

  return (
    <>
      <Header />
      <div className="container">
        <div className="row align-items-center p-2">
          <div className="col-md-6">
            <img src={`http://127.0.0.1:8000/storage/${project.image}`} alt={project.title} className="img-fluid rounded-2" />
          </div>
          <div className="col-md-6 px-4">
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
