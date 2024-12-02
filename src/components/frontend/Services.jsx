import { useEffect, useState } from 'react';
import Common from "../common/Common";
import Footer from "../common/Footer";
import Header from "../common/Header";




const Services = () => {
  const [services, setServices] = useState([]); 
  const [loading, setLoading] = useState(true); 

  // Fetching services data when the component mounts
  useEffect(() => {
    fetch('service.json') 
      .then(response => response.json()) 
      .then(data => {
        setServices(data); 
        setLoading(false); 
      })
      .catch(error => {
        console.error('Error fetching services:', error); 
        setLoading(false); 
      });
  }, []); 

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <>
      <Header />
      <Common preHeading='Quality, Integrity, Value'
        heading='Services'
        text='We excel at transforming visions into reality through outstanding and precise execution.' />

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
                    <img src={service.image } alt='Service Images' className='w-100' />
                    <div className='service-title'>
                      <h3>{service.title}</h3>
                    </div>
                  </div>

                  <div className='service-body'>
                    <div className='service-content'>
                      <p>{service.description}</p>
                      <a href='#' className='btn btn-primary'>Read More</a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Services;
