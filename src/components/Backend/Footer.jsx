

const Footer = () => {
  const currentYear = new Date().getFullYear(); // Get the current year dynamically

  return (
    <footer className="bg-light text-center text-dark py-3 my-4">
      <div className="container">
        <p className="mb-0">© {currentYear} Copyright <span>Gazi Builders</span> </p>
        <p>Design and Develop by <span> <a href="https://hasan-portfilo.netlify.app/" target="_blank" rel="noopener noreferrer">
                                <span> Hasan Talukder</span>
                            </a></span></p>
      </div>
    </footer>
  );
};

export default Footer;
