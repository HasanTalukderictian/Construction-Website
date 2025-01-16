import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // To get the ID from the URL
import Footer from '../common/Footer';
import Header from '../common/Header';

const ServiceDetails = () => {
  const { id } = useParams(); // Extract ID from the URL
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/get-service/${id}`) // Corrected template literal
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch service details');
        }
        return response.json();
      })
      .then(data => {
        setService(data.data); // Extract only the `data` key from the response
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching service details:', error);
        setLoading(false);
      });
  }, [id]); // Dependency array includes id

  if (loading) return <div>Loading...</div>;
  if (!service) return <div>Service not found</div>;

  return (
    <>
      <Header />
      <div className='container py-5'>
        <h1 className='text-center mb-4'>{service.title}</h1>
        <div className='row'>
          <div className='col-md-6'>
            <img
              src={service.image.startsWith('http') ? service.image : `http://127.0.0.1:8000/storage/${service.image}`} 
              alt={service.title} 
              className='img-fluid rounded' 
            />
          </div>
          <div className='col-md-6'>
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
