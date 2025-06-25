import Footer from "../../Footer"
import DashNav from "../DashNav"
import Layout from "../Layout"

const Banner = () => {
  return (
    <Layout>

      <DashNav />
      <div className="container">

         <div className="card rounded-5 shadow border-0">

          <h2>Hello Check</h2>

         </div>
      </div>
      <Footer />
    </Layout>
  )
}

export default Banner
