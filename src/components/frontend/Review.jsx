import React, { useState, useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "../../../src/assets/css/testo.scss";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const API_STORE = import.meta.env.VITE_API_STORAGE_URL;

const Review = () => {
  const [slides, setSlides] = useState([]);

  // Carousel Responsive settings
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4, // ডেক্সটপে ৪টি স্লাইড দেখাবে
      slidesToSlide: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2, // ট্যাবলেটে ২টি স্লাইড
      slidesToSlide: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1, // মোবাইলে ১টি স্লাইড
      slidesToSlide: 1,
    },
  };

  // API থেকে ডাটা ফেচ করা
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
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };
    fetchSlides();
  }, []);

  return (
    <div className="carousel-container mt-5 mb-5 container">
      <div className="section-header text-center mb-4">
        <span className="text-primary fw-bold">Testimonial</span>
        <h2 className="fw-bold">Customer Reviews</h2>
      </div>

      {slides.length > 0 ? (
        <Carousel
          responsive={responsive}
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={5000}
          keyBoardControl={true}
          customTransition="transform 700ms ease-in-out"
          transitionDuration={700}
          containerClass="carousel-container"
          removeArrowOnDeviceType={["tablet", "mobile"]}
          dotListClass="custom-dot-list-style"
          itemClass="px-2" // কার্ডগুলোর মাঝখানে গ্যাপ রাখার জন্য
        >
          {slides.map((slide, idx) => (
            <div key={idx} className="testimonial-card shadow-sm border p-3 bg-white rounded text-center">
              <div className="image-wrapper mb-3">
                <img 
                  src={slide.image} 
                  alt={slide.name} 
                  className="rounded-circle mx-auto" 
                  style={{ width: "80px", height: "80px", objectFit: "cover" }}
                />
              </div>
              <h4 className="fw-bold mb-1">{slide.name}</h4>
              <p className="text-muted small mb-2">{slide.designation}</p>

              <div className="rating text-warning mb-2">
                {"★".repeat(Math.floor(slide.rating))}
                {"☆".repeat(5 - Math.floor(slide.rating))}
              </div>

              <p className="text-secondary font-italic">
                <i className="bi bi-quote"></i> {slide.comment} <i className="bi bi-quote"></i>
              </p>
            </div>
          ))}
        </Carousel>
      ) : (
        <div className="text-center">Loading reviews...</div>
      )}
    </div>
  );
};

export default Review;