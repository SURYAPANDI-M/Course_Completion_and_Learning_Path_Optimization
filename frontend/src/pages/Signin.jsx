import Spinner from "../components/Spinner";
import { useState } from "react";
import axios from 'axios';
import './Signin.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Signin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate(); // Initialize navigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:3000/api/auth/login', {
                email,
                password
            });
            if (response.status === 200) {
                const token = response.data.token;
                const domain = response.data.domain;
                const role = response.data.role;
                const userId = response.data.userId
                console.log(response)
                sessionStorage.setItem('token', token);
                sessionStorage.setItem('domain', domain);
                sessionStorage.setItem('role', role);
                sessionStorage.setItem('userId',userId)
                // Redirect based on role
                if (role === "Employee") {
                    navigate('/employee');
                }
                if (role === "Admin") {
                    navigate('/admin/home');
                }
            }
        } catch (err) {
            console.error('Login failed:', err);
            toast.error("Invalid User");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading} className='login-btn'>
                    {loading ? <Spinner /> : 'Login'}
                </button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default Signin;
