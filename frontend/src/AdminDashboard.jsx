import React, { useState } from 'react'; // Ensure useState is imported
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaBook, FaClipboardList, FaChartPie, FaSignOutAlt } from 'react-icons/fa'; // Importing icons for sidebar

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Start with sidebar open
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const logout = () => {
    setTimeout(() => {
      localStorage.clear();
      navigate('/');
    }, 1000);
  };

  return (
    <div className="flex h-screen bg-gradient-to-r from-blue-200 to-purple-300"> {/* Changed to match the SignUpSignIn component */}
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-gray-800 text-white p-4 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button className="absolute top-4 right-4 md:hidden" onClick={toggleSidebar}>
          <span className="text-white text-xl">{isSidebarOpen ? '✖' : '☰'}</span>
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">MSP Admin Menu</h2>
        <ul className="space-y-2">
          <li>
            <Link to="/admin/home" className="flex items-center p-2 hover:bg-blue-600 rounded transition duration-300">
              <FaTachometerAlt className="mr-2" /> Home
            </Link>
          </li>
          <li>
            <Link to="/admin/users" className="flex items-center p-2 hover:bg-blue-600 rounded transition duration-300">
              <FaUsers className="mr-2" /> User
            </Link>
          </li>
          <li>
            <Link to="/admin/courses" className="flex items-center p-2 hover:bg-blue-600 rounded transition duration-300">
              <FaBook className="mr-2" /> Course
            </Link>
          </li>
          <li>
            <Link to="/admin/assign-course" className="flex items-center p-2 hover:bg-blue-600 rounded transition duration-300">
              <FaClipboardList className="mr-2" /> Assign Course
            </Link>
          </li>
          <li>
            <Link to="/admin/add-learning-path" className="flex items-center p-2 hover:bg-blue-600 rounded transition duration-300">
              <FaClipboardList className="mr-2" /> Add Learning Path
            </Link>
          </li>
          <li>
            <Link to="/admin/report" className="flex items-center p-2 hover:bg-blue-600 rounded transition duration-300">
              <FaChartPie className="mr-2" /> Report
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
          className="mb-4 bg-blue-500 text-white py-2 px-4 rounded transition duration-300 hover:bg-blue-600"
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

export default AdminDashboard;
