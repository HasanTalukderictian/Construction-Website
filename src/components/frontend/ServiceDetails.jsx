import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // To get the ID from the URL
import Footer from '../common/Footer';
import Header from '../common/Header';
import '../../assets/css/ServiceDetails.scss'; // Import custom CSS

const ServiceDetails = () => {
  const { id } = useParams(); // Extract ID from the URL
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/get-service/${id}`) // Corrected template literal
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch service details');
        }
        return response.json();
      })
      .then((data) => {
        setService(data.data); // Extract only the `data` key from the response
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching service details:', error);
        setLoading(false);
      });
  }, [id]); // Dependency array includes id

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
  if (!service) return <div>Service not found</div>;

  return (
    <>
      <Header />
      <div className="container py-5">
        <h1 className="text-center mb-4">{service.title}</h1>
        <div className="row">
          <div className="col-md-7">
            <div className="image-zoom-wrapper">
              <img
                src={
                  service.image.startsWith('http')
                    ? service.image
                    : `http://127.0.0.1:8000/storage/${service.image}`
                }
                alt={service.title}
                className="img-fluid rounded image-zoom"
                onMouseMove={handleMouseMove} // Adjust zoom origin dynamically
                onMouseEnter={handleMouseEnter} // Zoom in on hover
                onMouseLeave={handleMouseLeave} // Reset zoom on leave
              />
            </div>
          </div>
          <div className="col-md-5">
            {/* Render HTML content in the description */}
            <div dangerouslySetInnerHTML={{ __html: service.description }}></div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ServiceDetails;
