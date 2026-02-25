
import { useState, useEffect } from "react";
import axios from "axios";
import "../../../src/assets/css/banner.scss";

const Banner = ({ scrollToItem }) => {
    const [slides, setSlides] = useState([]);
    const [active, setActive] = useState(0);

    // 🎯 Random background (design same rakhar jonno)
    const backgrounds = [
        "linear-gradient(90deg,#24006b,#0f0060)",
        "linear-gradient(90deg,#001f4d,#000814)",
        "linear-gradient(90deg,#3a0072,#140028)"
    ];

    // ✅ Fetch Banner Data from API
    useEffect(() => {
        axios
            .get("http://127.0.0.1:8000/api/get-banner")
            .then((res) => {
                if (res.data.status) {
                    const apiData = res.data.data.map((item, index) => ({
                        id: item.id,
                        title: item.title,
                        price: `Starting at ৳ ${item.price}`,
                        image: item.image,
                        bg: backgrounds[index % backgrounds.length]
                    }));

                    setSlides(apiData);
                }
            })
            .catch((err) => {
                console.error("Banner fetch error:", err);
            });
    }, []);

    // ✅ Auto Slide Every 3 Seconds
    useEffect(() => {
        if (slides.length === 0) return;

        const interval = setInterval(() => {
            setActive((prev) =>
                prev === slides.length - 1 ? 0 : prev + 1
            );
        }, 3000);

        return () => clearInterval(interval);
    }, [slides]);

    if (slides.length === 0) return null;

    return (
        <section
            className="hero-section"
            style={{ background: slides[active].bg }}
        >
            <div className="container hero-wrapper">
                <div className="hero-left">
                    <span className="offer">SPECIAL OFFER TODAY!!</span>

                    <h1>{slides[active].title}</h1>
                    <h4 className="price">{slides[active].price}</h4>

                    <button
                        className="shop-btn w-80 ms-2"
                        onClick={scrollToItem}
                        style={{
                            backgroundColor: "#e4032e",
                            color: "#fff",
                            fontWeight: "bold",
                            borderRadius: "12px"
                        }}
                    >
                        SHOP NOW
                    </button>
                </div>

                <div className="hero-right">
                    <img
                        src={slides[active].image}
                        alt="product"
                        className="products-img"
                    />
                    <div className="discount-badge">
                        UP TO 50% OFF
                    </div>
                </div>
            </div>

            <div className="pagination">
                <button
                    className="arrow-btn"
                    onClick={() =>
                        setActive(
                            active === 0
                                ? slides.length - 1
                                : active - 1
                        )
                    }
                >
                    &#8592;
                </button>

                {slides.map((slide, index) => (
                    <span
                        key={slide.id}
                        className={active === index ? "active-dot" : ""}
                        onClick={() => setActive(index)}
                    >
                        {index + 1}
                    </span>
                ))}

                <button
                    className="arrow-btn"
                    onClick={() =>
                        setActive(
                            active === slides.length - 1
                                ? 0
                                : active + 1
                        )
                    }
                >
                    &#8594;
                </button>
            </div>
        </section>
    );
};

export default Banner;