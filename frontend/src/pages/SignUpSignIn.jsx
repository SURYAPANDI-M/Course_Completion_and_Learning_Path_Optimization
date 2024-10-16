import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUserPlus, FaSignInAlt } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUpSignIn = () => {
  const navigate = useNavigate();
  const [domain, setDomain] = useState('');
  const [isDomainAvailable, setIsDomainAvailable] = useState(null);
  const [superadminData, setSuperadminData] = useState({
    employeeId: '',
    name: '',
    email: '',
    password: '',
    department: '',
    designation: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const checkDomain = async () => {
    if (!domain.trim()) {
      toast.error('Domain field cannot be empty', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
      });
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/auth/check-domain', { domain });
      if (response.data.available) {
        setIsDomainAvailable(true);
        setIsModalOpen(true);
      } else {
        setIsDomainAvailable(false);
        toast.success('WELCOME BACK ADMIN', {
          position: 'top-center',
          autoClose: 500,
          hideProgressBar: true,
        });
        setTimeout(() => {
          navigate('/signin');
        }, 1000);
      }
    } catch (error) {
      console.error(error);
      toast.error('Error checking domain', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
      });
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

  const handleSuperadminSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/auth/create-superadmin', {
        ...superadminData,
        domain,
      });
      toast.success('SuperAdmin created successfully!');
      setIsModalOpen(false);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      toast.error('Error creating SuperAdmin', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-200 to-purple-300">
      <ToastContainer />
      <h1 className="text-4xl font-bold text-white mb-8">MSP</h1>

      <div className="mb-6 flex space-x-4">
        <button
          className="flex items-center justify-center bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
          onClick={() => navigate('/signup')}
        >
          <FaUserPlus className="mr-2" /> Sign Up
        </button>
        <button
          className="flex items-center justify-center bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-green-600 transition duration-300"
          onClick={() => navigate('/signin')}
        >
          <FaSignInAlt className="mr-2" /> Sign In
        </button>
      </div>

      <form className="mb-6 flex flex-col items-center" onSubmit={handleSubmit}>
        <input
          className="py-2 px-4 mb-4 border border-gray-300 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="Enter organization domain"
          value={domain}
          onChange={handleDomainChange}
        />
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
          type="submit"
        >
          Check Domain
        </button>
      </form>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-center">SuperAdmin Sign Up</h2>
            <form onSubmit={handleSuperadminSubmit} className="flex flex-col space-y-4">
              {['employeeId', 'name', 'email', 'password', 'department', 'designation'].map((field) => (
                <input
                  key={field}
                  className="py-2 px-4 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type={field === 'password' ? 'password' : 'text'}
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={superadminData[field]}
                  onChange={handleSuperadminChange}
                  required
                />
              ))}
              <div className="flex justify-between">
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
                  type="submit"
                >
                  Create SuperAdmin
                </button>
                <button
                  type="button"
                  className="bg-gray-300 text-black py-2 px-4 rounded-lg shadow-lg hover:bg-gray-400 transition duration-300"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUpSignIn;
