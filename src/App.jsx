

import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter,  Route,  Routes } from 'react-router-dom';
import Home from './components/frontend/Home';
import About from './components/frontend/About';
import './assets/css/style.scss';
import Services from './components/frontend/Services';
import Projects from './components/frontend/Projects';
import Blogs from './components/frontend/Blogs';
import Contact from './components/frontend/Contact';
import Portfilo from './components/frontend/Portfilo';
import ProjectDetails from './components/frontend/ProjectDetails';


function App() {


  return (
    <>
       <BrowserRouter>
         <Routes>
              <Route path='/' element={<Home></Home>}></Route>
              <Route path='/about' element={<About></About>}></Route>
              <Route path='/service' element={<Services></Services>}></Route>
              <Route path='/projects' element={<Projects></Projects>}></Route>
              <Route path="/project/:id" element={<ProjectDetails />} />
              <Route path='/blogs' element={<Blogs></Blogs>}></Route>
              <Route path='/contact' element={<Contact></Contact>}></Route>
              <Route path='/protfilo' element={<Portfilo></Portfilo>}></Route>
         </Routes>
       </BrowserRouter>

    </>
  )
}

export default App
