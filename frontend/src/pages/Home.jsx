import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Line } from 'react-chartjs-2'; // Import Line from react-chartjs-2
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables); // Register Chart.js components

const Home = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [learningPaths, setLearningPaths] = useState(0);
  const [completionRate, setCompletionRate] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [completionHistory, setCompletionHistory] = useState([]); // New state for historical data

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch total user count
        const usersResponse = await axios.get('http://localhost:3000/api/reports/users/count');
        setTotalUsers(usersResponse.data.totalUsers);
        // Fetch total employee count
        const employeesResponse = await axios.get('http://localhost:3000/api/reports/employees/count');
        setTotalEmployees(employeesResponse.data.count);

        // Fetch total admin count
        const adminResponse = await axios.get('http://localhost:3000/api/reports/admin/count');
        setTotalAdmins(adminResponse.data.count);

        // Fetch learning paths count
        const pathsResponse = await axios.get('http://localhost:3000/api/reports/learning-paths/count');
        setLearningPaths(pathsResponse.data.count);

        // Fetch course completion rate
        const completionResponse = await axios.get('http://localhost:3000/api/reports/completion-rate');
        setCompletionRate(completionResponse.data.completionRate);
        console.log(completionResponse.data)

        // Fetch historical completion rates
        const historyResponse = await axios.get('http://localhost:3000/api/reports/reports/completion-history');
        setCompletionHistory(historyResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError("An error occurred while fetching data.");
        toast.error("Error fetching data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = {
    labels: completionHistory.map(item => item.date), // Extract dates for x-axis
    datasets: [
      {
        label: 'Completion Rate (%)',
        data: completionHistory.map(item => item.completionRate), // Extract completion rates for y-axis
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Admin Dashboard</h1>
      {error && <div className="text-red-500 text-center">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
        <div className="bg-white shadow-lg p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-700">Total Users</h2>
          <p className="mt-2 text-3xl font-bold text-blue-600">{totalUsers}</p>
        </div>
        <div className="bg-white shadow-lg p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-700">Total Employees</h2>
          <p className="mt-2 text-3xl font-bold text-green-600">{totalEmployees}</p>
        </div>
        <div className="bg-white shadow-lg p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-700">Total Admins</h2>
          <p className="mt-2 text-3xl font-bold text-red-600">{totalAdmins}</p>
        </div>
        <div className="bg-white shadow-lg p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-700">Learning Paths</h2>
          <p className="mt-2 text-3xl font-bold text-purple-600">{learningPaths}</p>
        </div>
        <div className="bg-white shadow-lg p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-700">Course Completion Rate</h2>
          <p className="mt-2 text-3xl font-bold text-orange-600">{completionRate}%</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Course Completion Rate Over Time</h2>
        <div className="chart-container" style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
          <Line data={chartData} height={250} width={500} />
        </div>
      </div>
    </div>
  );
};

export default Home;
