import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="d-flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-grow-1 p-4" style={{ backgroundColor: "#f8f9fa" }}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
