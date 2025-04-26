
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from './components/frontend/Home';
import About from './components/frontend/About';
import './assets/css/style.scss';
import Services from './components/frontend/Services';
import Projects from './components/frontend/Projects';
import Blogs from './components/frontend/Blogs';
import Contact from './components/frontend/Contact';
import Portfilo from './components/frontend/Portfilo';
import ProjectDetails from './components/frontend/ProjectDetails';
import BackendHome from './components/Backend/BackendHome';
import Dashboard from './components/Backend/Component/Dashboard';
import Orderlist from './components/Backend/Component/Orderlist';
import Banner from './components/Backend/Component/Page/Banner';
import AboutUs from './components/Backend/Component/Page/AboutUs';
import Service from './components/Backend/Component/Page/Service';
import Project from './components/Backend/Component/Page/Project';
import Testominal from './components/Backend/Component/Page/Testominal';
import CustomerFeedback from './components/Backend/Component/Page/CustomerFeedback';
import BackendBlogs from './components/Backend/Component/Blogs';
import Fortfilo from './components/Backend/Component/Fortfilo';
import Admin from './components/Backend/Admin';
import ServiceDetails from './components/frontend/ServiceDetails';
import BlogsDetails from './components/frontend/BlogsDetails';
import Employee from './components/Backend/Component/Employee';
import AddEmployee from './components/Backend/Component/AddEmployee';


function App() {


  const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn');


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home></Home>}></Route>
          <Route path='/about' element={<About></About>}></Route>
          <Route path='/service' element={<Services></Services>}></Route>
          <Route path='/services/:id' element={<ServiceDetails />} />
          <Route path='/projects' element={<Projects></Projects>}></Route>
          <Route path="/project/:id" element={<ProjectDetails />} />
          <Route path='/blogs' element={<Blogs></Blogs>}></Route>
          <Route path='/blog/:id' element={<BlogsDetails></BlogsDetails>}></Route>
          <Route path='/contact' element={<Contact></Contact>}></Route>
          <Route path='/protfilo' element={<Portfilo></Portfilo>}></Route>


          {/* Admin Panel Routes */}

          <Route path='/admin' element={<Admin></Admin>}></Route>

          <Route
            path='/admin-home'
            element={isAdminLoggedIn ? <BackendHome /> : <Navigate to="/admin" />}
          />
          <Route
            path='/admin/dashbord'
            element={isAdminLoggedIn ? <Dashboard /> : <Navigate to="/admin/dashbord" />}
          />
          <Route
            path="/admin/orders"
            element={isAdminLoggedIn ? <Orderlist /> : <Navigate to="/admin" />}
          />

          <Route
            path="/admin/employee"
            element={isAdminLoggedIn ? <Employee /> : <Navigate to="/admin" />}
          />

          <Route
            path="/admin/add-employee"
            element={isAdminLoggedIn ? <AddEmployee /> : <Navigate to="/admin" />}
          />
          <Route
            path="/admin/page/banner"
            element={isAdminLoggedIn ? <Banner /> : <Navigate to="/admin" />}
          />
          <Route
            path="/admin/page/about"
            element={isAdminLoggedIn ? <AboutUs /> : <Navigate to="/admin" />}
          />
          <Route
            path="/admin/page/services"
            element={isAdminLoggedIn ? <Service /> : <Navigate to="/admin" />}
          />
          <Route
            path="/admin/page/projects"
            element={isAdminLoggedIn ? <Project /> : <Navigate to="/admin" />}
          />
          <Route
            path="/admin/page/testominal"
            element={isAdminLoggedIn ? <Testominal /> : <Navigate to="/admin" />}
          />

          <Route
            path="/admin/page/customerfeedback"
            element={isAdminLoggedIn ? <CustomerFeedback /> : <Navigate to="/admin" />}
          />
          <Route
            path="/admin/blogs"
            element={isAdminLoggedIn ? <BackendBlogs /> : <Navigate to="/admin" />}
          />
          <Route
            path="/admin/portfilo"
            element={isAdminLoggedIn ? <Fortfilo /> : <Navigate to="/admin" />}
          />

        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
