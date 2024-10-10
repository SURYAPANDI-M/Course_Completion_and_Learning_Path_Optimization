import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Start with sidebar open

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-gray-800 text-white p-4 transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button className="absolute top-4 right-4 md:hidden" onClick={toggleSidebar}>
          <span className="text-white text-xl">✖</span>
        </button>
        <h2 className="text-2xl font-bold mb-4">Admin Menu</h2>
        <ul className="space-y-2">
          <li><Link to="/admin/home" className="hover:underline">Home</Link></li>
          <li><Link to="/admin/users" className="hover:underline">User</Link></li>
          <li><Link to="/admin/courses" className="hover:underline">Course</Link></li>
          <li><Link to="/admin/assign-course" className="hover:underline">Assign Course</Link></li>
          <li><Link to="/admin/add-learning-path" className="hover:underline">Add Learning Path</Link></li>
          <li><Link to="/admin/report" className="hover:underline">Report</Link></li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className={`flex-grow p-4 md:ml-64 transition-all duration-300 overflow-y-auto`}>
        <button
          className="md:hidden mb-4 bg-blue-500 text-white py-2 px-4 rounded transition duration-300 hover:bg-blue-600"
          onClick={toggleSidebar}
        >
          ☰ Open Menu
        </button>
   
        
        {/* Render nested routes */}
        <Outlet />
      </main>
    </div>
  );
}

export default AdminDashboard;
