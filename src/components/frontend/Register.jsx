import Header from '../common/Header';
import Footer from '../common/Footer';
import { useState } from 'react';
import '../../../src/assets/css/Login.scss'; // Assuming you use an external CSS file

const Register = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate fields
    if (!name || !phone || !email || !password) {
      setErrorMessage('All fields are required.');
      return;
    }

    // Validate phone number
    const phoneRegex = /^\d{11}$/;
    if (!phoneRegex.test(phone)) {
      setErrorMessage('Phone number must be exactly 11 digits.');
      return;
    }

    // Simulate registration process
    console.log('Registering with:', { name, phone, email, password });
    setErrorMessage('');
    alert('Registration Successful!');
  };

  return (
    <>
      <Header />
      <div className="container mb-4">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <h2 className="text-center">Register Your Account</h2>
            <form
              onSubmit={handleSubmit}
              className="border p-4 rounded shadow-sm custom-form-height-register"
            >
              {errorMessage && (
                <div className="alert alert-danger" role="alert">
                  {errorMessage}
                </div>
              )}
              <div className="form-group mb-3 px-2">
                <label htmlFor="name"><p>Name</p></label>
                <input
                  type="text"
                  id="name"
                  className="form-control"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group mb-3 px-2">
                <label htmlFor="phone"><p>Phone</p></label>
                <input
                  type="text"
                  id="phone"
                  className="form-control"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="form-group mb-3 px-2">
                <label htmlFor="email"><p>Email Address</p></label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group mb-3 px-2">
                <label htmlFor="password"><p>Password</p></label>
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="px-2 mt-4">
                <button type="submit" className="btn btn-primary w-100">
                  Register
                </button>
              </div>
              <p className="text-center mt-3">
                Already have an account? <a href="/login">Login Here</a>
              </p>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;
