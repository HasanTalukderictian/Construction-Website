import { useState } from "react";
import "../../../src/assets/css/banner.scss"

import Img1 from "../../assets/images/gamingpc.png";
import Img2 from "../../assets/images/pc22.png";
import Img3 from "../../assets/images/pc33.png";

const slides = [
    {
        id: 1,
        title: "ALIENWARE GAMING DESKTOPS",
        price: "Starting at $1,999",
        image: Img1,
        bg: "linear-gradient(90deg,#24006b,#0f0060)"
    },
    {
        id: 2,
        title: "NEXT GEN SMART WATCH",
        price: "Starting at $299",
        image: Img2,
        bg: "linear-gradient(90deg,#001f4d,#000814)"
    },
    {
        id: 3,
        title: "PRO GAMING WATCH",
        price: "Starting at $1,499",
        image: Img3,
        bg: "linear-gradient(90deg,#3a0072,#140028)"
    }
];

const Banner = ({ scrollToItem }) => {
    const [active, setActive] = useState(0);

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

                    {/* Use onClick instead of Link */}
                    <button className="shop-btn w-80 ms-2" onClick={scrollToItem}
                    style={{ backgroundColor: "#e4032e", color: "#fff", fontWeight: "bold",  borderRadius: "12px"}}>
                        SHOP NOW
                    </button>
                </div>

                <div className="hero-right">
                    <img
                        src={slides[active].image}
                        alt="product"
                        className="product-img"
                    />
                    <div className="discount-badge">UP TO 50% OFF</div>
                </div>
            </div>

            <div className="pagination">
                <button
                    className="arrow-btn"
                    onClick={() =>
                        setActive(active === 0 ? slides.length - 1 : active - 1)
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
                        setActive(active === slides.length - 1 ? 0 : active + 1)
                    }
                >
                    &#8594;
                </button>
            </div>
        </section>
    );
};


export default Banner;
