import { useRef } from "react";
import Footer from '../common/Footer';
import Header from '../common/Header';
import Banner from './Banner';
import Item from './Item';
import Review from "./Review";
import '../../assets/css/Global.scss';

const Home = () => {
    const itemRef = useRef(null); // ref to Item section

    const scrollToItem = () => {
        if (itemRef.current) {
            itemRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="main-layout">
            <Header />

            <main className="content-area">
                <Banner scrollToItem={scrollToItem} />

                <div ref={itemRef}>
                    <Item />
                </div>

                <div>
                    <Review />
                </div>
            </main>

            {/* ✅ WhatsApp Floating Button */}
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
