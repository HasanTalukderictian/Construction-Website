import { Navbar } from "react-bootstrap"
import Dashboard from "./Component/Dashboard"
import Layout from "./Component/Layout"
import Footer from "./Footer"


const BackendHome = () => {
  return (
    <Layout>
        <div className="d-flex">
      
      <div className="flex-grow-1">
        <Navbar />
        <Dashboard />
        <Footer/>
      </div>
    </div>
    </Layout>
  )
}

export default BackendHome
