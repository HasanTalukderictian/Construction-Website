import { useState, useEffect, useRef } from 'react';
import '../../../src/assets/css/testo.scss';

const Review = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [slides, setSlides] = useState([]);
  const intervalRef = useRef(null); // Ref to hold interval

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Dummy fallback data
  const dummySlides = [
    { id: 1, name: "John Doe", designation: "Construction Manager", rating: 5, comment: "Amazing service! Highly recommend.", image: "dummy1.jpg" },
    { id: 2, name: "Jane Smith", designation: "Architect", rating: 4.5, comment: "Very professional and reliable team.", image: "dummy2.jpg" },
    { id: 3, name: "Mike Johnson", designation: "Engineer", rating: 4, comment: "Great experience from start to finish.", image: "dummy3.jpg" },
    { id: 4, name: "Alice Brown", designation: "Designer", rating: 4.8, comment: "Excellent and timely work.", image: "dummy4.jpg" },
     { id: 5, name: "Alice Brown", designation: "Designer", rating: 4.8, comment: "Excellent and timely work.", image: "dummy4.jpg" },
     { id: 6, name: "Alice Brown", designation: "Designer", rating: 4.8, comment: "Excellent and timely work.", image: "dummy4.jpg" },
     { id: 7, name: "Alice Brown", designation: "Designer", rating: 4.8, comment: "Excellent and timely work.", image: "dummy4.jpg" },
     { id: 8, name: "Alice Brown", designation: "Designer", rating: 4.8, comment: "Excellent and timely work.", image: "dummy4.jpg" },
     { id: 9, name: "Alice Brown", designation: "Designer", rating: 4.8, comment: "Excellent and timely work.", image: "dummy4.jpg" },
     { id: 10, name: "Alice Brown", designation: "Designer", rating: 4.8, comment: "Excellent and timely work.", image: "dummy4.jpg" },
     { id: 11, name: "Alice Brown", designation: "Designer", rating: 4.8, comment: "Excellent and timely work.", image: "dummy4.jpg" },
  ];

  // Fetch slides from API
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/get-testominal`);
        const data = await response.json();
        if (data.data && data.data.length > 0) setSlides(data.data);
        else setSlides(dummySlides);
      } catch (error) {
        console.error("Error fetching slides:", error);
        setSlides(dummySlides);
      }
    };
    fetchSlides();
  }, []);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (slides.length === 0) return;

    intervalRef.current = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000); // Change to 5s

    return () => clearInterval(intervalRef.current); // Cleanup
  }, [slides]);

  // Manual next slide
  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
    resetInterval();
  };

  // Manual prev slide
  const prevSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    resetInterval();
  };

  // Reset interval when user clicks prev/next
  const resetInterval = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
  };

  return (
    <div className="swiper-container mt-5 mb-5">
      <div className="section-header text-center mb-4">
        <span>Testimonial</span>
        <h2>Customer Reviews</h2>
        {/* <p>
          We specialize in a wide range of construction services, including residential and industrial projects.
        </p> */}
      </div>

      <div
        className="swiper-wrapper"
        style={{
          transform: `translateX(-${activeIndex * 100}%)`,
          transition: 'transform 0.5s ease-in-out',
        }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="swiper-slide">
            <div className="testimonial-card">
              <img
                src={slide.image.startsWith("http") ? slide.image : `${BASE_URL}/storage/${slide.image}`}
                alt={slide.name}
                className="testimonial-image"
              />
              <h3>{slide.name}</h3>
              <p>{slide.designation}</p>
              <div className="rating">
                {'⭐'.repeat(Math.floor(slide.rating))}
                {slide.rating % 1 !== 0 && '⭐'}
              </div>
              <p>{slide.comment}</p>
            </div>
          </div>
        ))}
      </div>

      <button onClick={prevSlide} className="swiper-button prev-button">
        ◀
      </button>
      <button onClick={nextSlide} className="swiper-button next-button">
        ▶
      </button>
    </div>
  );
};

export default Review;
