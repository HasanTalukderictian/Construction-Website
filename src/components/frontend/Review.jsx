import { useState, useEffect, useRef } from "react";
import "../../../src/assets/css/testo.scss";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const API_STORE = import.meta.env.VITE_API_STORAGE_URL;

const Review = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [slides, setSlides] = useState([]);
  const intervalRef = useRef(null);

  const slidesToShow = 4;

  // Fetch slides from API
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch(`${API_BASE}/get-reviews`);
        const data = await response.json();

        if (data?.data?.length > 0) {
          const apiSlides = data.data.map((slide) => ({
            ...slide,
            image: slide.image
              ? slide.image.startsWith("http")
                ? slide.image
                : `${API_STORE}/${slide.image}`
              : null,
          }));

          setSlides(apiSlides);
        } else {
          setSlides([]);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setSlides([]);
      }
    };

    fetchSlides();
  }, []);

  // Auto-slide
  useEffect(() => {
    if (slides.length === 0) return;

    intervalRef.current = setInterval(nextSlide, 5000);
    return () => clearInterval(intervalRef.current);
  }, [slides]);

  const resetInterval = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(nextSlide, 5000);
  };

  const nextSlide = () => {
    setActiveIndex((prevIndex) => {
      const newIndex = prevIndex + slidesToShow;
      return newIndex >= slides.length ? 0 : newIndex;
    });
    resetInterval();
  };

  const prevSlide = () => {
    setActiveIndex((prevIndex) => {
      const newIndex = prevIndex - slidesToShow;
      return newIndex < 0
        ? slides.length - (slides.length % slidesToShow || slidesToShow)
        : newIndex;
    });
    resetInterval();
  };

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
          transition: "transform 0.7s ease-in-out",
          display: "flex",
          gap: "10px",
        }}
      >
        {displaySlides.map((slide, idx) => (
          <div key={idx} className="swiper-slide">

            <div className="testimonial-card">
              <img src={slide.image} alt={slide.name} className="testimonial-image" />
              <h3 className="fw-bold">{slide.name}</h3>
              <small className="text-muted">{slide.designation}</small>

              <div className="rating my-2">
                {"★".repeat(Math.floor(slide.rating))}
              </div>

              <p className="text-center px-3">"{slide.comment}"</p>
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