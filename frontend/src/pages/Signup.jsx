import React, { useState } from 'react';
import axios from 'axios';
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    employeeId: '',
    name: '',
    email: '',
    password: '',
    organizationDomain: '',
    designation: '',
    department: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:3000/api/auth/signup', formData);
      alert(response.data.message);
      setFormData({
        employeeId: '',
        name: '',
        email: '',
        password: '',
        organizationDomain: '',
        designation: '',
        department: '',
      });
    } catch (error) {
      console.error('Error signing up:', error);
      alert('Signup failed. Please check your inputs.');
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">Create Your Account</h2>
      <form className="signup-form" onSubmit={handleSubmit}>
        {Object.keys(formData).map((key) => (
          <div className="form-group" key={key}>
            <label className="form-label">
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
              <input
                className="form-input"
                type={key === 'password' ? 'password' : 'text'}
                name={key}
                value={formData[key]}
                onChange={handleChange}
                required
              />
            </label>
          </div>
        ))}
        <button className="signup-button" type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
