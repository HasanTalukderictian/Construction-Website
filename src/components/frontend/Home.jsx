import { useRef } from "react";
import Footer from '../common/Footer';
import Header from '../common/Header';
import Banner from './Banner';
import Item from './Item';

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
                <Banner scrollToItem={scrollToItem} /> {/* pass scroll function */}

                <div ref={itemRef}>
                    <Item/>
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default Home;
