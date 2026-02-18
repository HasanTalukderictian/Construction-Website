import { useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from '../common/Footer';
import Header from '../common/Header';
import Banner from './Banner';
import Item from './Item';
import Review from "./Review";
import '../../assets/css/Global.scss';

const Home = () => {

    const itemRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.state?.scrollTo === "items") {
            itemRef.current?.scrollIntoView({ behavior: "smooth" });

            // ✅ scroll করার পর state clear করে দিচ্ছি
            navigate("/", { replace: true });
        }
    }, [location, navigate]);

    const scrollToItem = () => {
        itemRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="main-layout">
            <Header />

            <main className="content-area">
                <Banner scrollToItem={scrollToItem} />

                <div ref={itemRef}>
                    <Item />
                </div>

                <Review />
            </main>

            <a
                href="https://wa.me/8801768712230?text=Hello%20I%20want%20to%20know%20about%20your%20products"
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-float"
            >
                <i className="bi bi-whatsapp"></i>
            </a>

            <Footer />
        </div>
    )
}

export default Home;
