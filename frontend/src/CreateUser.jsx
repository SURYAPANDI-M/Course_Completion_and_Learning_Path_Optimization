// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { FaEdit, FaTrash } from 'react-icons/fa';
// import { toast } from 'react-toastify';

// const CreateUser = () => {
//     const [users, setUsers] = useState([]);
//     const [currentUsers, setCurrentUsers] = useState([]);
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         fetchUsers();
//     }, []);

//     const fetchUsers = async () => {
//         setLoading(true);
//         try {
//             const response = await axios.get('http://localhost:3000/api/getalluser');
//             console.log('Users:', response.data); // Log the users
//             setUsers(response.data);
//             setCurrentUsers(response.data);
//         } catch (error) {
//             console.error('Error fetching users:', error);
//             toast.error('Error fetching users.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleEdit = (user) => {
//         // Logic for editing a user
//         console.log('Edit user:', user);
//     };

//     const handleDelete = async (employeeId) => {
//         try {
//             await axios.delete(`http://localhost:3000/api/deleteuser/${employeeId}`);
//             toast.success('User deleted successfully');
//             fetchUsers(); // Refresh the user list
//         } catch (error) {
//             console.error('Error deleting user:', error);
//             toast.error('Error deleting user.');
//         }
//     };

//     if (loading) return <div>Loading...</div>;

//     return (
//         <div className="overflow-hidden shadow sm:rounded-lg">
//             <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                     <tr>
//                         <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
//                         <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//                         <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
//                         <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
//                         <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
//                         <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                     {currentUsers.map(user => (
//                         <tr key={user.id}>
//                             <td className="px-4 py-2">{user.employeeId}</td>
//                             <td className="px-4 py-2">{user.name}</td>
//                             <td className="px-4 py-2">{user.email}</td>
//                             <td className="px-4 py-2">{user.designation ? user.designation.title : 'N/A'}</td>
//                             <td className="px-4 py-2">{user.department ? user.department.name : 'N/A'}</td>
//                             <td className="px-4 py-2 flex space-x-2">
//                                 <button onClick={() => handleEdit(user)} className="text-yellow-500 hover:text-yellow-600">
//                                     <FaEdit />
//                                 </button>
//                                 <button onClick={async () => {
//                                     const confirmDelete = window.confirm(`Are you sure you want to delete ${user.name}?`);
//                                     if (confirmDelete) {
//                                         await handleDelete(user.employeeId);
//                                     }
//                                 }} className="text-red-500 hover:text-red-600">
//                                     <FaTrash />
//                                 </button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default CreateUser;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUserPlus, FaEdit, FaEye, FaTrash } from 'react-icons/fa';

const CreateUser = ({ adminDomain }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState({
        id: null,
        name: '',
        employeeId: '',
        password: '',
        email: '',
        designationId: '',
        departmentId: '',
        roleId: '', // Added for roles
    });
    const [designations, setDesignations] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [roles, setRoles] = useState([]); // State for roles
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(8);
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
        fetchDesignations();
        fetchDepartments();
        fetchRoles(); // Fetch roles
        fetchUsers();
    }, []);

    const fetchDesignations = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/designations');
            setDesignations(response.data);
        } catch (error) {
            console.error('Error fetching designations:', error);
            toast.error('Error fetching designations.');
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/assign/departments');
            setDepartments(response.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
            toast.error('Error fetching departments.');
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/roles'); // Endpoint for roles
            setRoles(response.data);
        } catch (error) {
            console.error('Error fetching roles:', error);
            toast.error('Error fetching roles.');
        }
    };

    const fetchUsers = async () => {
        const domain = sessionStorage.getItem("domain");
        try {
            const response = await axios.get(`http://localhost:3000/api/getalluser/${domain}`);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Error fetching users.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const domain = sessionStorage.getItem("domain");
        try {
            if (editingUser) {
                // Update user
                const response = await axios.put(`http://localhost:3000/api/users/${editingUser.employeeId}`, {
                    ...user,
                    organizationDomain: domain,
                    designationId: parseInt(user.designationId),
                    departmentId: parseInt(user.departmentId),
                });
                toast.success('User updated successfully!');
                await fetchUsers(); 
                
            } else {
                // Create user
                const response = await axios.post('http://localhost:3000/api/users', {
                    ...user,
                    organizationDomain: domain,
                    designationId: parseInt(user.designationId),
                    departmentId: parseInt(user.departmentId),
                });
                toast.success('User created successfully!');
                setUsers((prev) => [...prev, response.data]);
            }
            resetForm();
        } catch (error) {
            console.error('Error saving user:', error);
            toast.error('Error saving user. Please check your inputs.');
        }
    };

    const resetForm = () => {
        setUser({ id: null, name: '', employeeId: '', password: '', email: '', designationId: '', departmentId: '', roleId: '' });
        setIsOpen(false);
        setEditingUser(null);
    };

    const handleEdit = (user) => {
        setUser(user);
        setEditingUser(user);
        setIsOpen(true);
    };

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    return (
        <div className="flex flex-col items-center justify-start h-screen bg-transparent p-4 relative">
            <div className="flex justify-between w-full max-w-2xl mb-4">
                <div className="bg-white shadow-md rounded-lg p-4">
                    <h2 className="text-lg font-semibold">Total Users</h2>
                    <p className="text-2xl">{users.length}</p>
                </div>
            </div>
            <button
                onClick={() => {
                    resetForm();
                    setIsOpen(true);
                }}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 flex items-center"
            >
                <FaUserPlus className="mr-2" /> Add User
            </button>

            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm">
                        <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">{editingUser ? 'Edit User' : 'Create User'}</h2>
                        <form onSubmit={handleSubmit}>
                            {['name', 'employeeId', 'password', 'email'].map((field) => (
                                <div className="mb-4" key={field}>
                                    <label className="block text-gray-700 font-medium mb-1" htmlFor={field}>
                                        {field.charAt(0).toUpperCase() + field.slice(1).replace('Id', ' ID')}:
                                    </label>
                                    <input
                                        type={field === 'password' ? 'password' : 'text'}
                                        name={field}
                                        id={field}
                                        value={user[field]}
                                        onChange={handleChange}
                                        required={field === 'password' ? !editingUser : true} // Password is required only when creating
                                        className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            ))}
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-1" htmlFor="designationId">Select Designation:</label>
                                <select
                                    name="designationId"
                                    id="designationId"
                                    value={user.designationId}
                                    onChange={handleChange}
                                    required
                                    className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select a designation</option>
                                    {designations.map(designation => (
                                        <option key={designation.id} value={designation.id}>
                                            {designation.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-1" htmlFor="departmentId">Select Department:</label>
                                <select
                                    name="departmentId"
                                    id="departmentId"
                                    value={user.departmentId}
                                    onChange={handleChange}
                                    required
                                    className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select a department</option>
                                    {departments.map(department => (
                                        <option key={department.id} value={department.id}>
                                            {department.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-1" htmlFor="roleId">Select Role:</label>
                                <select
                                    name="roleId"
                                    id="roleId"
                                    value={user.roleId}
                                    onChange={handleChange}
                                    required
                                    className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select a role</option>
                                    {roles.map(role => (
                                        <option key={role.id} value={role.id}>
                                            {role.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="mr-2 bg-gray-300 text-black py-1 px-3 rounded-md hover:bg-gray-400 transition duration-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                                >
                                    {editingUser ? 'Update User' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <table className="mt-4 w-full max-w-2xl bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-blue-500 text-white">
                    <tr>
                        <th className="p-4">Name</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Actions</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.map((user) => (
                        <tr key={user.id} className="border-b">
                            <td className="p-4">{user.name}</td>
                            <td className="p-4">{user.email}</td>
                            <td className="p-4">{user.email}</td>
                            <td className="p-4 flex space-x-2">
                                <button onClick={() => handleEdit(user)} className="text-blue-500 hover:text-blue-700">
                                    <FaEdit />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-between items-center mt-4">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className={`px-4 py-2 ${currentPage === 1 ? 'bg-gray-300' : 'bg-blue-500 text-white'} rounded-md`}
                >
                    Previous
                </button>
                <button
                    disabled={indexOfLastUser >= users.length}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className={`px-4 py-2 ${indexOfLastUser >= users.length ? 'bg-gray-300' : 'bg-blue-500 text-white'} rounded-md`}
                >
                    Next
                </button>
            </div>
            <ToastContainer />
        </div>
    );
};

export default CreateUser;
