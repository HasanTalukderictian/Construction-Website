import { useEffect, useState } from 'react';
import Common from "../common/Common";
import Footer from "../common/Footer";
import Header from "../common/Header";
import { Link } from 'react-router-dom';
import Whatsapp from './Whatsapp';


const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    fetch(`${BASE_URL}/api/get-service`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setServices(data.data); // Access the 'data' field in the response
        console.log('Services Data:', data.data);
        setLoading(false); // Set loading to false
      })
      .catch((error) => {
        console.error('Error fetching services:', error);
        setLoading(false); // Set loading to false even if there’s an error
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <Common
        preHeading='Quality, Integrity, Value'
        heading='Services'
        text='We excel at transforming visions into reality through outstanding and precise execution.'
      />

      <section className='section-3 py-5'>
        <div className='container py-5'>
          <div className='section-header text-center'>
            <span>Our Services</span>
            <h2>Our Constructions Services</h2>
            <p>We offer a diverse array of construction services, spanning residential, commercial, and industrial projects.</p>
          </div>

          <div className='row mt-5 mb-4'>
            {services.map(service => (
              <div className='col-md-4 col-lg-4' key={service.id}>
                <div className='item'>
                  <div className='service-image'>
                    <img
                      src={`${BASE_URL}/storage/${service.image}`} // Assuming your images are in storage
                      alt={service.title}
                      className="w-100"
                    />
                    <div className='service-title'>
                      <h3>{service.title}</h3>
                    </div>
                  </div>

                  <div className='service-body'>
                    <div className='service-content'>
                      <p className='text-white'>
                        {service.description.replace(/<[^>]+>/g, '')}
                      </p>

                      <Link to={`/services/${service.id}`} className='btn btn-primary'>Read More</Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Whatsapp/>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Services;
