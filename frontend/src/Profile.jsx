// const response = await axios.get(`http://localhost:3000/api/user/profile/${userId}`);


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for React Toastify

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [role,setRole] = useState({});
  const [department, setDepartment] = useState({});
  const [designation ,setDesignation] = useState({});
  const fetchRoles = async () => {
    try {
        const response = await axios.get('http://localhost:3000/api/roles'); // Endpoint for roles
        setRole(()=> response.data.reduce((obj,item)=>({...obj, [item.id]:item.name}),{}));
    } catch (error) {
        console.error('Error fetching roles:', error);
        toast.error('Error fetching roles.');
    }
};
const fetchDesignations = async () => {
  try {
      const response = await axios.get('http://localhost:3000/api/designations');
      setDesignation(()=> response.data.reduce((obj,item)=>({...obj, [item.id]:item.title}),{}));
  } catch (error) {
      console.error('Error fetching designations:', error);
      toast.error('Error fetching designations.');
  }
};
const fetchDepartments = async () => {
  try {
      const response = await axios.get('http://localhost:3000/api/assign/departments');
      setDepartment(()=> response.data.reduce((obj,item)=>({...obj, [item.id]:item.name}),{}));
  } catch (error) {
      console.error('Error fetching departments:', error);
      toast.error('Error fetching departments.');
  }
};

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userId = sessionStorage.getItem('userId'); // Retrieve userId from sessionStorage
        const response = await axios.get(`http://localhost:3000/api/user/profile/${userId}`);
        setUserDetails(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
        toast.error('Failed to fetch user details!'); // Notify on error
      }
    };

    fetchUserDetails();
    fetchRoles();
    fetchDepartments();
    fetchDesignations();
  }, []);

  console.log(designation);
  if (!userDetails) {
    return <div className="text-center text-gray-500 mt-6">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6  min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">User Profile</h2>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-100 rounded-lg p-4 shadow">
            <p className="text-lg font-semibold text-gray-700"><strong>Name:</strong> {userDetails.name}</p>
          </div>
          <div className="bg-gray-100 rounded-lg p-4 shadow">
            <p className="text-lg font-semibold text-gray-700"><strong>Employee ID:</strong> {userDetails.employeeId}</p>
          </div>

          <div className="bg-gray-100 rounded-lg p-4 shadow">
            <p className="text-lg font-semibold text-gray-700"><strong>Email:</strong> {userDetails.email}</p>
          </div>
          <div className="bg-gray-100 rounded-lg p-4 shadow">
            <p className="text-lg font-semibold text-gray-700"><strong>Organization Domain:</strong> {userDetails.organizationDomain}</p>
          </div>

          <div className="bg-gray-100 rounded-lg p-4 shadow">
            <p className="text-lg font-semibold text-gray-700"><strong>Role:</strong> {role[userDetails.roleId]}</p>
          </div>
          <div className="bg-gray-100 rounded-lg p-4 shadow">
            <p className="text-lg font-semibold text-gray-700"><strong>Joining Date:</strong> {new Date(userDetails.joiningDate).toLocaleDateString()}</p>
          </div>

          <div className="bg-gray-100 rounded-lg p-4 shadow">
            <p className="text-lg font-semibold text-gray-700"><strong>Designation ID:</strong> {designation[userDetails.designationId]}</p>
          </div>
          <div className="bg-gray-100 rounded-lg p-4 shadow">
            <p className="text-lg font-semibold text-gray-700"><strong>Department ID:</strong> {department[userDetails.departmentId]}</p>
          </div>
        </div>
      </div>

      <ToastContainer /> {/* Toast container for notifications */}
    </div>
  );
};

export default Profile;
