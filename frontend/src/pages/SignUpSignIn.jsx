import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import './SignUpSignIn.css';

const SignUpSignIn = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [domain, setDomain] = useState('');
  const [isDomainAvailable, setIsDomainAvailable] = useState(null);
  const [formType, setFormType] = useState('');

  // State for superadmin sign-up
  const [superadminData, setSuperadminData] = useState({
    employeeId: '',
    name: '',
    email: '',
    password: '',
    department: '',
    designation: '',
  });

  // State for employee sign-in
  const [employeeData, setEmployeeData] = useState({
    email: '',
    password: '',
  });

  const checkDomain = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/check-domain', { domain });
      if (response.data.available) {
        setIsDomainAvailable(true);
        setFormType('admin');
      } else {
        setIsDomainAvailable(false);
        setFormType('employee');
      }
    } catch (error) {
      console.error(error);
      alert('Error checking domain');
    }
  };

  const handleDomainChange = (e) => {
    setDomain(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    checkDomain();
  };

  const handleSuperadminChange = (e) => {
    setSuperadminData({ ...superadminData, [e.target.name]: e.target.value });
  };

  const handleEmployeeChange = (e) => {
    setEmployeeData({ ...employeeData, [e.target.name]: e.target.value });
  };

  const handleSuperadminSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/auth/create-organization-domain', {
        ...superadminData,
        domain,
      });
      alert(response.data.message);
    } catch (error) {
      console.error(error);
      alert('Error creating superadmin');
    }
  };

  const handleEmployeeSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/login', employeeData);
      alert(response.data.message);
    } catch (error) {
      console.error(error);
      alert('Error signing in employee');
    }
  };

  // Handle navigation
  const handleSignInClick = () => {
    navigate('/signin'); // Navigate to the sign-in page
  };

  const handleSignUpClick = () => {
    navigate('/signup'); // Navigate to the sign-up page
  };

  return (
    <div className="signup-signin-container">
      <div className="button-container">
        <button className="toggle-button" onClick={handleSignUpClick}>Sign Up</button>
        <button className="toggle-button" onClick={handleSignInClick}>Sign In</button>
      </div>

      <form className="domain-check-form" onSubmit={handleSubmit}>
        <input
          className="input-field"
          type="text"
          placeholder="Enter organization domain"
          value={domain}
          onChange={handleDomainChange}
        />
        <button className="submit-button" type="submit">Check Domain</button>
      </form>

      {isDomainAvailable !== null && (
        <div>
          {isDomainAvailable ? (
            <div className="signup-section">
              <h2>SuperAdmin Sign Up</h2>
              <form onSubmit={handleSuperadminSubmit}>
                <input
                  className="input-field"
                  type="text"
                  name="employeeId"
                  placeholder="Employee ID"
                  value={superadminData.employeeId}
                  onChange={handleSuperadminChange}
                  required
                />
                <input
                  className="input-field"
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={superadminData.name}
                  onChange={handleSuperadminChange}
                  required
                />
                <input
                  className="input-field"
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={superadminData.email}
                  onChange={handleSuperadminChange}
                  required
                />
                <input
                  className="input-field"
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={superadminData.password}
                  onChange={handleSuperadminChange}
                  required
                />
                <input
                  className="input-field"
                  type="text"
                  name="department"
                  placeholder="Department"
                  value={superadminData.department}
                  onChange={handleSuperadminChange}
                  required
                />
                <input
                  className="input-field"
                  type="text"
                  name="designation"
                  placeholder="Designation"
                  value={superadminData.designation}
                  onChange={handleSuperadminChange}
                  required
                />
                <button className="submit-button" type="submit">Create SuperAdmin</button>
              </form>
            </div>
          ) : (
            <div className="signin-section">
              <h2>Employee Sign In</h2>
              <form onSubmit={handleEmployeeSubmit}>
                <input
                  className="input-field"
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={employeeData.email}
                  onChange={handleEmployeeChange}
                  required
                />
                <input
                  className="input-field"
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={employeeData.password}
                  onChange={handleEmployeeChange}
                  required
                />
                <button className="submit-button" type="submit">Sign In</button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SignUpSignIn;
