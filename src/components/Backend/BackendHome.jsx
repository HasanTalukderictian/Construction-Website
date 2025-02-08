
import Dashboard from "./Component/Dashboard"
import DashNav from "./Component/DashNav"
import Layout from "./Component/Layout"
import Footer from "./Footer"


const BackendHome = () => {
  return (
    <Layout>
        <div className="d-flex">
      
      <div className="flex-grow-1">
        <DashNav/>
        <Dashboard />
        <Footer/>
      </div>
    </div>
    </Layout>
  )
}

export default BackendHome
