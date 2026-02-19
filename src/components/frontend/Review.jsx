import { useState, useEffect, useRef } from 'react';
import '../../../src/assets/css/testo.scss';

import img1 from '../../assets/images/pexels-pixabay-220453.jpg';
import img2 from '../../assets/images/pexels-sindre-fs-1040880.jpg';
import img3 from '../../assets/images/author-2.jpg';

const Review = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [slides, setSlides] = useState([]);
  const intervalRef = useRef(null);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Dummy fallback data
  const dummySlides = [
    { id: 1, name: "John Doe", designation: "Construction Manager", rating: 5, comment: "Amazing service! Highly recommend.", image: img1 },
    { id: 2, name: "Jane Smith", designation: "Architect", rating: 4.5, comment: "Very professional and reliable team.", image: img2 },
    { id: 3, name: "Mike Johnson", designation: "Engineer", rating: 4, comment: "Great experience from start to finish.", image: img3 },
    { id: 4, name: "Alice Brown", designation: "Designer", rating: 4.8, comment: "Excellent and timely work.", image: img1 },
    { id: 5, name: "Bob Martin", designation: "Engineer", rating: 4.2, comment: "Reliable and skilled team.", image: img2 },
    { id: 6, name: "Carol Lee", designation: "Architect", rating: 4.5, comment: "Professional and timely.", image: img3 },
  ];

  // Fetch slides from API
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/get-testominal`);
        const data = await response.json();

        if (data.data && data.data.length > 0) {
          const apiSlides = data.data.map(slide => ({
            ...slide,
            image: slide.image.startsWith('http') ? slide.image : `${BASE_URL}/storage/${slide.image}`
          }));
          setSlides(apiSlides);
        } else {
          setSlides(dummySlides);
        }
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
    intervalRef.current = setInterval(() => nextSlide(), 5000);
    return () => clearInterval(intervalRef.current);
  }, [slides]);

  const slidesToShow = 4;

  // Circular next slide
  const nextSlide = () => {
    setActiveIndex(prevIndex => {
      const newIndex = prevIndex + slidesToShow;
      return newIndex >= slides.length ? 0 : newIndex; // wrap to start
    });
    resetInterval();
  };

  // Circular prev slide
  const prevSlide = () => {
    setActiveIndex(prevIndex => {
      const newIndex = prevIndex - slidesToShow;
      return newIndex < 0 ? slides.length - (slides.length % slidesToShow || slidesToShow) : newIndex; // wrap to end
    });
    resetInterval();
  };

  const resetInterval = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => nextSlide(), 5000);
  };

  // Duplicate slides for smooth circular effect
  const displaySlides = [...slides, ...slides];

  return (
    <div className="swiper-container mt-5 mb-5">
      <div className="section-header text-center mb-4">
        <span>Testimonial</span>
        <h2>Customer Reviews</h2>
      </div>

      <div
        className="swiper-wrapper"
        style={{
          transform: `translateX(-${(activeIndex / slidesToShow) * 100}%)`,
          transition: 'transform 0.7s ease-in-out',
          display: 'flex',
          gap: '10px',
        }}
      >
        {displaySlides.map((slide, idx) => (
          <div key={idx} className="swiper-slide">
            <div className="testimonial-card">
              <img src={slide.image} alt={slide.name} className="testimonial-image" />
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

      <button onClick={prevSlide} className="swiper-button prev-button">◀</button>
      <button onClick={nextSlide} className="swiper-button next-button">▶</button>
    </div>
  );
};

export default Review;
