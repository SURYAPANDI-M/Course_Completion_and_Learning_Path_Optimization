import React, { useState,useEffect } from 'react'; 
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { FaHome, FaUser, FaBook, FaSignOutAlt } from 'react-icons/fa';

const EmployeeDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Start with sidebar open
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const logout = () => {
    setTimeout(() => {
      localStorage.clear();
      sessionStorage.clear();
      navigate('/');
    }, 1000);
  };
  useEffect(()=>{
    if(!sessionStorage.getItem('role')) {
      navigate('/');
    }
  },[])
  return (
    <div className="flex h-screen bg-gradient-to-r from-blue-200 to-purple-300">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-gray-800 text-white p-4 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button className="absolute top-4 right-4 md:hidden" onClick={toggleSidebar}>
          <span className="text-white text-xl">{isSidebarOpen ? '✖' : '☰'}</span>
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">Employee Menu</h2>
        <ul className="space-y-2">
        <li>
            <Link to="/employee/home" className="flex items-center p-2 hover:bg-blue-600 rounded transition duration-300">
              <FaHome className="mr-2" /> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/employee/enrollments" className="flex items-center p-2 hover:bg-blue-600 rounded transition duration-300">
              <FaBook className="mr-2" /> Enrollments
            </Link>
          </li>
          <li>
            <Link to="/employee/profile" className="flex items-center p-2 hover:bg-blue-600 rounded transition duration-300">
              <FaUser className="mr-2" /> Profile
            </Link>
          </li>
        </ul>
        <div className='mt-4'>
          <button className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300 flex items-center" onClick={logout}>
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-grow p-4 transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : ''}`}>
        <button
          className="mb-4 bg-blue-500 text-white py-2 px-4 rounded transition duration-300 hover:bg-blue-600 md:hidden"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? 'Hide Menu' : 'Show Menu'}
        </button>
        
        {/* Render nested routes */}
        <Outlet />
      </main>
    </div>
  );
};

export default EmployeeDashboard;
