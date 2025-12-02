import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/frontend/Home';
import About from './components/frontend/About';
import './assets/css/style.scss';
import Services from './components/frontend/Services';
import Projects from './components/frontend/Projects';
import Blogs from './components/frontend/Blogs';
import Contact from './components/frontend/Contact';
import Item from './components/frontend/Item';
import Productdetails from './components/frontend/Productdetails';
import Cart from './components/frontend/Cart'; // we'll create this page
import { CartProvider } from './components/frontend/CartContext.jsx';
import Checkout from './components/frontend/Checkout.jsx';
import Login from './backend/login.jsx';
import BackendHome from './backend/BackendHome.jsx';



function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/service' element={<Services />} />
          <Route path='/projects' element={<Projects />} />
          <Route path='/blogs' element={<Blogs />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/items' element={<Item />} />
          <Route path='/product/:id' element={<Productdetails />} />
          <Route path='/cart' element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
           <Route path="/admin" element={<Login />} />
            <Route path="/admin-home" element={<BackendHome />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
