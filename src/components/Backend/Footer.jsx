const Footer = () => {
  const currentYear = new Date().getFullYear(); // Get the current year dynamically

  return (
    <footer className="bg-success text-dark bg-opacity-25 text-center py-3 my-4">
      <div className="container p-5">
        <p className="mb-0">
          © {currentYear} Copyright <span>Gazi Builders</span>
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
  );
};

export default Footer;
