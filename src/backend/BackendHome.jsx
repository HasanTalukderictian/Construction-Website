import Layout from "../components/Layout";
import Dashboard from "./Dashboard";
import DashNav from "./DasNav";
import Footer from "./Footer";





const BackendHome = () => {
    return (
        <Layout>
            <div className="d-flex">

                <div className="flex-grow-1">

                
                     <DashNav/>
                    <Dashboard />
                    <Footer /> 
                </div>
            </div>
        </Layout>
    )
}

export default BackendHome;