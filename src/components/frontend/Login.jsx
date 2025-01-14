import Header from '../common/Header';
import Footer from '../common/Footer';
import { useState } from 'react';
import '../../../src/assets/css/Login.scss'; // Assuming you use an external CSS file

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Add your login logic here
    if (!email || !password) {
      setErrorMessage('Both fields are required.');
      return;
    }

    // Simulate login process
    console.log('Logging in with:', { email, password });
    setErrorMessage('');
    alert('Login Successful!');
  };

  return (
    <>
      <Header />
      <div className="container mb-4">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <h2 className="text-center">Login Here</h2>
            <form
              onSubmit={handleSubmit}
              className="border p-4 rounded shadow-sm custom-form-height"
            >
              {errorMessage && (
                <div className="alert alert-danger" role="alert">
                  {errorMessage}
                </div>
              )}
              <div className="form-group mb-3 px-2">
                <label htmlFor="email">Email Address</label>
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
              <div className="form-group mb-3 px-2 ">
                <label htmlFor="password">Password</label>
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
                  Login
                </button>
              </div>
              <p className="text-center mt-3">
                Do you have an account? <a href="/register"> Register Here</a>
              </p>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
