import { useState, useEffect } from "react";
import axios from "axios";

export const API_BASE = import.meta.env.VITE_API_BASE_URL;

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [companyName, setCompanyName] = useState("Gazi Builders");
  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    twitter: "",
    linkedin: "",
    github: ""
  });

  useEffect(() => {
    axios
      .get(`${API_BASE}/get-header`)
      .then((res) => {
        if (res.data.status && res.data.data.length > 0) {
          setCompanyName(res.data.data[0].Companyname);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch company name:", err);
      });
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <footer className="modern-footer">
        <div className="footer-wave">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#1e1e2f" fillOpacity="1" d="M0,192L48,197.3C96,203,192,213,288,208C384,203,480,181,576,170.7C672,160,768,160,864,170.7C960,181,1056,203,1152,208C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
        
        <div className="footer-content">
          <div className="container">
            <div className="row g-4">
              {/* Company Info Section */}
              <div className="col-lg-4 col-md-6">
                <div className="footer-section">
                  <div className="footer-logo">
                    <div className="logo-icon">
                      <i className="bi bi-building"></i>
                    </div>
                    <h3>{companyName}</h3>
                  </div>
                  <p className="company-desc">
                    Providing quality services and solutions to our valued customers since establishment.
                    We strive for excellence in everything we do.
                  </p>
                  <div className="contact-info">
                    <div className="contact-item">
                      <i className="bi bi-envelope"></i>
                      <span>info@{companyName.toLowerCase().replace(/\s/g, '')}.com</span>
                    </div>
                    <div className="contact-item">
                      <i className="bi bi-telephone"></i>
                      <span>+880 1234 567890</span>
                    </div>
                    <div className="contact-item">
                      <i className="bi bi-geo-alt"></i>
                      <span>Dhaka, Bangladesh</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links Section */}
              <div className="col-lg-2 col-md-6">
                <div className="footer-section">
                  <h4 className="section-title">
                    <i className="bi bi-link-45deg"></i>
                    Quick Links
                  </h4>
                  <ul className="footer-links">
                    <li><a href="/"><i className="bi bi-chevron-right"></i> Home</a></li>
                    <li><a href="/about"><i className="bi bi-chevron-right"></i> About Us</a></li>
                    <li><a href="/services"><i className="bi bi-chevron-right"></i> Services</a></li>
                    <li><a href="/contact"><i className="bi bi-chevron-right"></i> Contact</a></li>
                    <li><a href="/privacy"><i className="bi bi-chevron-right"></i> Privacy Policy</a></li>
                  </ul>
                </div>
              </div>

              {/* Support Section */}
              <div className="col-lg-3 col-md-6">
                <div className="footer-section">
                  <h4 className="section-title">
                    <i className="bi bi-headset"></i>
                    Support
                  </h4>
                  <ul className="footer-links">
                    <li><a href="/faq"><i className="bi bi-question-circle"></i> FAQ</a></li>
                    <li><a href="/support"><i className="bi bi-life-preserver"></i> Customer Support</a></li>
                    <li><a href="/returns"><i className="bi bi-arrow-return-left"></i> Returns & Refunds</a></li>
                    <li><a href="/shipping"><i className="bi bi-truck"></i> Shipping Info</a></li>
                    <li><a href="/terms"><i className="bi bi-file-text"></i> Terms of Service</a></li>
                  </ul>
                </div>
              </div>

              {/* Newsletter Section */}
              <div className="col-lg-3 col-md-6">
                <div className="footer-section">
                  <h4 className="section-title">
                    <i className="bi bi-envelope-paper"></i>
                    Newsletter
                  </h4>
                  <p className="newsletter-text">
                    Subscribe to get latest updates and offers
                  </p>
                  <div className="newsletter-form">
                    <input 
                      type="email" 
                      placeholder="Your email address"
                      className="newsletter-input"
                    />
                    <button className="subscribe-btn">
                      <i className="bi bi-send"></i>
                    </button>
                  </div>
                  <div className="social-links">
                    <a href="#" className="social-link facebook">
                      <i className="bi bi-facebook"></i>
                    </a>
                    <a href="#" className="social-link twitter">
                      <i className="bi bi-twitter-x"></i>
                    </a>
                    <a href="#" className="social-link linkedin">
                      <i className="bi bi-linkedin"></i>
                    </a>
                    <a href="#" className="social-link instagram">
                      <i className="bi bi-instagram"></i>
                    </a>
                    <a href="#" className="social-link github">
                      <i className="bi bi-github"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="footer-bottom">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <p className="copyright">
                    <i className="bi bi-c-circle"></i> {currentYear} {companyName}. 
                    All rights reserved.
                  </p>
                </div>
                <div className="col-md-6 text-md-end">
                  <p className="developer-credit">
                    Design & Developed with <i className="bi bi-heart-fill text-danger"></i> by 
                    <a 
                      href="https://hasan-portfilo.netlify.app/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="developer-link"
                    >
                      Hasan Talukder
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll to Top Button */}
        <button className="scroll-to-top" onClick={scrollToTop}>
          <i className="bi bi-arrow-up"></i>
        </button>
      </footer>

      <style jsx>{`
        .modern-footer {
          position: relative;
          background: linear-gradient(135deg, #1e1e2f 0%, #1a1a2e 100%);
          color: #e2e8f0;
          margin-top: 60px;
          overflow: hidden;
        }

        .footer-wave {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          transform: translateY(-98%);
        }

        .footer-wave svg {
          width: 100%;
          display: block;
        }

        .footer-content {
          position: relative;
          z-index: 1;
          padding: 60px 0 20px;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .logo-icon {
          width: 45px;
          height: 45px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: white;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .footer-logo h3 {
          font-size: 22px;
          font-weight: 600;
          margin: 0;
          background: linear-gradient(135deg, #fff 0%, #a78bfa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .company-desc {
          color: #a0aec0;
          line-height: 1.6;
          margin-bottom: 20px;
          font-size: 14px;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: #cbd5e1;
        }

        .contact-item i {
          width: 20px;
          color: #667eea;
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: white;
        }

        .section-title i {
          color: #667eea;
          font-size: 20px;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-links li {
          margin-bottom: 12px;
        }

        .footer-links a {
          color: #cbd5e1;
          text-decoration: none;
          font-size: 14px;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .footer-links a:hover {
          color: #667eea;
          transform: translateX(5px);
        }

        .footer-links a i {
          font-size: 12px;
        }

        .newsletter-text {
          color: #a0aec0;
          font-size: 13px;
          margin-bottom: 15px;
        }

        .newsletter-form {
          display: flex;
          gap: 10px;
          margin-bottom: 25px;
        }

        .newsletter-input {
          flex: 1;
          padding: 10px 15px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          color: white;
          font-size: 13px;
          transition: all 0.3s ease;
        }

        .newsletter-input:focus {
          outline: none;
          border-color: #667eea;
          background: rgba(255,255,255,0.08);
        }

        .newsletter-input::placeholder {
          color: #718096;
        }

        .subscribe-btn {
          padding: 10px 18px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 10px;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .subscribe-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .social-links {
          display: flex;
          gap: 12px;
        }

        .social-link {
          width: 38px;
          height: 38px;
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #cbd5e1;
          text-decoration: none;
          transition: all 0.3s ease;
          font-size: 18px;
        }

        .social-link:hover {
          transform: translateY(-3px);
        }

        .social-link.facebook:hover {
          background: #1877f2;
          color: white;
        }

        .social-link.twitter:hover {
          background: #000000;
          color: white;
        }

        .social-link.linkedin:hover {
          background: #0077b5;
          color: white;
        }

        .social-link.instagram:hover {
          background: #e4405f;
          color: white;
        }

        .social-link.github:hover {
          background: #333;
          color: white;
        }

        .footer-bottom {
          margin-top: 50px;
          padding-top: 20px;
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        .copyright, .developer-credit {
          font-size: 13px;
          color: #a0aec0;
          margin: 0;
        }

        .developer-link {
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
          margin-left: 5px;
          transition: all 0.3s ease;
        }

        .developer-link:hover {
          color: #a78bfa;
          text-decoration: underline;
        }

        .scroll-to-top {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 45px;
          height: 45px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 50%;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
          z-index: 1000;
          opacity: 0;
          visibility: hidden;
        }

        .scroll-to-top.show {
          opacity: 1;
          visibility: visible;
        }

        .scroll-to-top:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
        }

        @media (max-width: 768px) {
          .footer-content {
            padding: 40px 0 20px;
          }
          
          .footer-section {
            text-align: center;
          }
          
          .footer-logo {
            justify-content: center;
          }
          
          .contact-item {
            justify-content: center;
          }
          
          .social-links {
            justify-content: center;
          }
          
          .footer-bottom {
            text-align: center;
          }
          
          .text-md-end {
            text-align: center !important;
            margin-top: 10px;
          }
        }
      `}</style>

      <script>
        {`
          // Show/hide scroll button
          window.addEventListener('scroll', function() {
            const scrollBtn = document.querySelector('.scroll-to-top');
            if (scrollBtn) {
              if (window.scrollY > 300) {
                scrollBtn.classList.add('show');
              } else {
                scrollBtn.classList.remove('show');
              }
            }
          });
        `}
      </script>
    </>
  );
};

export default Footer;