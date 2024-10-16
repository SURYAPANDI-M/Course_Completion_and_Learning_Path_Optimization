import Spinner from "../components/Spinner";
import { useState } from "react";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from 'react-icons/fa';

const Signin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:3000/api/auth/login', {
                email,
                password
            });
            if (response.status === 200) {
                const { token, domain, role, userId } = response.data;
                sessionStorage.setItem('token', token);
                sessionStorage.setItem('domain', domain);
                sessionStorage.setItem('role', role);
                sessionStorage.setItem('userId', userId);
                navigate(role === "Employee" ? '/employee' : '/admin/home');
            }
        } catch (err) {
            console.error('Login failed:', err);
            toast.error("Invalid User");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-100 to-blue-300">
            <div className="bg-white shadow-lg rounded-lg p-10 w-96">
                <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group mb-4 flex items-center border border-gray-300 rounded-lg p-3 transition duration-300 hover:shadow-md">
                        <FaUser className="text-gray-400 mr-2" />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="flex-1 outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-md"
                        />
                    </div>
                    <div className="input-group mb-6 flex items-center border border-gray-300 rounded-lg p-3 transition duration-300 hover:shadow-md">
                        <FaLock className="text-gray-400 mr-2" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="flex-1 outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-md"
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading} 
                        className='w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 shadow-lg'
                    >
                        {loading ? <Spinner /> : 'Login'}
                    </button>
                    <button 
                        type="button" 
                        onClick={() => navigate('/')} 
                        className='w-full mt-4 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition duration-300'
                    >
                        Cancel
                    </button>
                </form>
                <ToastContainer />
            </div>
        </div>
    );
};

export default Signin;
