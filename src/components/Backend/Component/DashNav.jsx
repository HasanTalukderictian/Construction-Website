

const DashNav = () => {
    return (
        <>
            <div className="d-flex container justify-content-center"> {/* Centers the navbar */}
                <nav className="navbar bg-white shadow-sm py-2 px-4 d-flex justify-content-between align-items-center" style={{ maxWidth: "1500px", width: "100%" }}>
                    {/* Left - Logo */}
                    <div className="d-flex align-items-center">
                        <img
                            src="https://i.ibb.co.com/kgghmZfy/Flying-Bird-logo-design-template.png"
                            alt="Paperfly Logo"
                            className="me-2"
                            style={{ height: "40px" }}
                        />
                        <h4 className="fw-bold text-primary">Gazi Builders</h4>
                        <span className="text-muted small ms-1">Make your House more Happiness</span>
                    </div>

                    {/* Middle - User Profile */}
                    <div className="d-flex align-items-center">
                        <div
                            className="rounded-circle bg-primary d-flex justify-content-center align-items-center me-2"
                            style={{ width: "100px", height: "100px", overflow: "hidden" }}
                        >
                            <img
                                src="https://i.ibb.co.com/rK7RzDJk/MY-pic-02.jpg"
                                alt="User"
                                style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "50%" }}
                            />
                        </div>
                        <div className="mt-1 mb-1">
                            <span className="d-block text-muted">Hello,</span>
                            <span className="fw-bold">Hasan Talukder</span>
                            <p className="small text-muted m-0 d-flex align-items-center">
                                Welcome to our panel
                                <span className="ms-2">😊</span>
                            </p>

                        </div>
                    </div>

                </nav>
            </div>
        </>
    )
}

export default DashNav
