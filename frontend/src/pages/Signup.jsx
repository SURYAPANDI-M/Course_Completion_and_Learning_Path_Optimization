import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import { FaUser, FaEnvelope, FaLock, FaBuilding, FaIdBadge } from 'react-icons/fa';

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

  const navigate = useNavigate();

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

  const handleCancel = () => {
    navigate('/'); // Redirect to the home page on cancel
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-100 to-blue-300">
      <div className="bg-white shadow-lg rounded-lg p-10 w-96">
        <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">Create Your Account</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {Object.keys(formData).map((key) => (
            <div className="input-group flex items-center border border-gray-300 rounded-lg p-3 transition duration-300 hover:shadow-md" key={key}>
              {key === 'employeeId' && <FaIdBadge className="text-gray-400 mr-2" />}
              {key === 'name' && <FaUser className="text-gray-400 mr-2" />}
              {key === 'email' && <FaEnvelope className="text-gray-400 mr-2" />}
              {key === 'password' && <FaLock className="text-gray-400 mr-2" />}
              {key === 'organizationDomain' && <FaBuilding className="text-gray-400 mr-2" />}
              {key === 'designation' && <FaUser className="text-gray-400 mr-2" />}
              {key === 'department' && <FaBuilding className="text-gray-400 mr-2" />}
              
              <input
                className="flex-1 outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-md"
                type={key === 'password' ? 'password' : 'text'}
                name={key}
                placeholder={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                value={formData[key]}
                onChange={handleChange}
                required
              />
            </div>
          ))}
          <div className="flex justify-between mt-4">
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 shadow-lg" type="submit">
              Sign Up
            </button>
            <button className="w-full ml-2 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition duration-300" type="button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
