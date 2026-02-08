import Footer from '../common/Footer';
import Header from '../common/Header';
import Item from './Item';

const Home = () => {
    return (
        <div className="main-layout">
            <Header />

             

            <main className="content-area">
            
                <Item/>
            </main>

            <Footer />
        </div>
    )
}

export default Home
