import Footer from "./Footer";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import "../../assets/css/nullpage.scss"; // optional: create separate CSS

const Nullpage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="nullpage-container">
        <div className="nullpage-content">
          <h1>404</h1>
          <h2>Oops! Page Not Found</h2>
          <p>
            Sorry, the page you are looking for does not exist or has been moved.
          </p>
          <button className="btn-go-home" onClick={() => navigate("/")}>
            Go Back Home
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Nullpage;