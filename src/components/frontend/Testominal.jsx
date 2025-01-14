import { useState, useEffect } from 'react';
import '../../../src/assets/css/testo.scss';

const Testominal = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [slides, setSlides] = useState([]);  // State to hold the fetched data

  // Fetching data from a JSON endpoint
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/get-testominal');  // Replace with your JSON URL
        const data = await response.json();
        console.log(data);
        setSlides(data.data);  // Set the fetched data to the state (accessing `data` array)
      } catch (error) {
        console.error("Error fetching slides:", error);
      }
    };

    fetchSlides();
  }, []);  // Empty dependency array to run the fetch once when the component mounts

  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const prevSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  return (
    <div className="swiper-container">
      <div className="section-header text-center mb-4">
        <span>Testominal</span>
        <h2>Customer Reviews</h2>
        <p>
          We specialize in a wide range of construction services, including residential and industrial
          projects.
        </p>
      </div>
      <div className="swiper-wrapper" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
        {slides.map((slide) => (
          <div key={slide.id} className="swiper-slide">
            <div className="testimonial-card">
              <img
                src={`http://127.0.0.1:8000/storage/${slide.image}`}  // Ensure correct path to image
                alt={slide.name}
                className="testimonial-image"
              />
              <h3>{slide.name}</h3>
              <p>{slide.designation}</p>
              <div className="rating">
                {'⭐'.repeat(Math.floor(slide.rating))} {/* Display full stars based on the rating */}
                {slide.rating % 1 !== 0 && '⭐'} {/* Display half star if applicable */}
              </div>
              <p>{slide.comment}</p>
            </div>
          </div>
        ))}
      </div>
      <button onClick={prevSlide} className="swiper-button prev-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
        </svg>
      </button>
      <button onClick={nextSlide} className="swiper-button next-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8" />
        </svg>
      </button>
    </div>
  );
};

export default Testominal;
