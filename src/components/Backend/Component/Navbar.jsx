
const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm p-3">
    <div className="container-fluid">
      <input
        type="text"
        className="form-control me-2"
        placeholder="Search here"
        style={{ maxWidth: "300px" }}
      />
      <div className="d-flex align-items-center">
        <button className="btn btn-primary me-3">Filter</button>
        <img
          src="/path/to/profile.jpg"
          alt="Profile"
          className="rounded-circle"
          style={{ width: "40px", height: "40px" }}
        />
      </div>
    </div>
  </nav>
  )
}

export default Navbar
