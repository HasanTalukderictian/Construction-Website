import { useState, useEffect } from "react";
import axios from "axios";

const Footer = () => {
  const currentYear = new Date().getFullYear(); // Get the current year dynamically
  const [companyName, setCompanyName] = useState("Gazi Builders"); // default fallback

  // Fetch company name from API
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/get-header")
      .then((res) => {
        if (res.data.status && res.data.data.length > 0) {
          setCompanyName(res.data.data[0].Companyname);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch company name:", err);
      });
  }, []);

  return (
    <div className="container">
      <footer className="bg-success p-5 text-dark bg-opacity-25 text-center py-3 my-4">
        <div className="container p-5">
          <p className="mb-0">
            © {currentYear} Copyright <span>{companyName}</span>
          </p>
          <p>
            Design and Developed by{" "}
            <a
              href="https://hasan-portfilo.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-dark text-decoration-none fw-bold"
            >
              Hasan Talukder
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;