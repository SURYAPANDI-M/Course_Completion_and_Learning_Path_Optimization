import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        try {
            const response = await axios.get('http://localhost:3000/api/getalluser');
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
        <div className="flex flex-col items-center justify-start h-screen bg-gray-100 relative p-4">
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
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
            >
                Add User
            </button>

            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm">
                        <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">{editingUser ? 'Edit User' : 'Create User'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-1" htmlFor="name">Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={user.name}
                                    onChange={handleChange}
                                    required
                                    className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-1" htmlFor="employeeId">Employee ID:</label>
                                <input
                                    type="text"
                                    name="employeeId"
                                    id="employeeId"
                                    value={user.employeeId}
                                    onChange={handleChange}
                                    required
                                    className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-1" htmlFor="password">Password:</label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    value={user.password}
                                    onChange={handleChange}
                                    required={!editingUser} // Password is required only when creating
                                    className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-1" htmlFor="email">Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={user.email}
                                    onChange={handleChange}
                                    required
                                    className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
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

            <div className="mt-6 w-full max-w-2xl bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full border border-gray-300">
                    <thead className="bg-blue-500 text-white">
                        <tr>
                            <th className="px-4 py-2 text-left border-b border-gray-300">ID</th>
                            <th className="px-4 py-2 text-left border-b border-gray-300">Name</th>
                            <th className="px-4 py-2 text-left border-b border-gray-300">Email</th>
                            <th className="px-4 py-2 text-left border-b border-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map((user, index) => (
                            <tr key={user.employeeId} className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                <td className="border px-4 py-2">{user.employeeId}</td>
                                <td className="border px-4 py-2">{user.name}</td>
                                <td className="border px-4 py-2">{user.email}</td>
                                <td className="border px-4 py-2">
                                    <button
                                        onClick={() => handleEdit(user)}
                                        className="text-blue-500 hover:underline"
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {currentUsers.length === 0 && (
                            <tr>
                                <td colSpan="4" className="text-center py-4">No users found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between mt-4 w-full max-w-2xl">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="bg-gray-300 text-black py-1 px-3 rounded-md disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="self-center">{`Page ${currentPage} of ${Math.ceil(users.length / usersPerPage)}`}</span>
                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(users.length / usersPerPage)))}
                    disabled={currentPage === Math.ceil(users.length / usersPerPage)}
                    className="bg-gray-300 text-black py-1 px-3 rounded-md disabled:opacity-50"
                >
                    Next
                </button>
            </div>

            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
        </div>
    );
};

export default CreateUser;
