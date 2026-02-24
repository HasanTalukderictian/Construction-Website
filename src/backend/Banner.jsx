import Layout from "../components/Layout"
import DashNav from "./DasNav"
import Footer from "./Footer"


const Banner = () => {
  return (
   <Layout>
      <div className="d-flex">
        <div className="flex-grow-1">
          <DashNav />
          <div className="container mt-4">
               <h2>Banner Section</h2>
            </div>
            </div>
            </div>

            <Footer/>
            </Layout>
  )
}

export default Banner
