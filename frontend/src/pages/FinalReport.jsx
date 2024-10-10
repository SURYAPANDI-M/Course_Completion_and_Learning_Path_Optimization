import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FinalReport = () => {
  const [reportData, setReportData] = useState({});
  const [learningPaths, setLearningPaths] = useState([]);
  const [selectedLearningPath, setSelectedLearningPath] = useState('');


  // Fetching learning paths
  useEffect(() => {
    const fetchLearningPaths = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/finalreports/learning-paths');
        setLearningPaths(response.data);
      } catch (error) {
        console.error('Error fetching learning paths:', error);
      }
    };
    fetchLearningPaths();
  }, []);

  // Fetching the report data
  const fetchReportData = async (learningPathId = '') => {
    try {
      const response = await axios.get('http://localhost:3000/api/finalreports/finalreports', {
        params: {
          learningPathId: learningPathId || undefined,
        },
      });
      setReportData(response.data);
    } catch (error) {
      console.error('Error fetching report data:', error);
    }
  };

  // Handle the learning path change
  const handleLearningPathChange = (e) => {
    const learningPathId = e.target.value;
    setSelectedLearningPath(learningPathId);
    fetchReportData(learningPathId);
  };

  // Fetch the overall report data on initial render
  useEffect(() => {
    fetchReportData();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Report</h1>
      
      <label htmlFor="learningPath" className="block mb-2 text-lg font-semibold">
        Filter by Learning Path:
      </label>
      <select
        id="learningPath"
        value={selectedLearningPath}
        onChange={handleLearningPathChange}
        className="mb-6 p-2 border border-gray-300 rounded-md"
      >
        <option value="">All Learning Paths</option>
        {learningPaths.map((path) => (
          <option key={path.id} value={path.id}>
            {path.title}
          </option>
        ))}
      </select>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="Total Learning Paths" value={reportData.totalLearningPaths} />
        <Card title="Total Completed Courses" value={reportData.totalCompletedCourses} />
        <Card title="Learners in Progress" value={reportData.learnersInProgress} />
        <Card title="Total Users" value={reportData.totalUsers} />
        
        {selectedLearningPath && (
          <>
            <Card title="Completed Courses for Selected Learning Path" value={reportData.completedCoursesCount} />
            <Card title="Learners in Progress for Selected Learning Path" value={reportData.learnersInProgressCount} />
            <Card title="Users for Selected Learning Path" value={reportData.usersCount} />
          </>
        )}
      </div>
    </div>
  );
};

// Card component for report data
const Card = ({ title, value }) => (
  <div className="bg-white p-4 rounded-lg shadow-md">
    <h2 className="text-xl font-semibold">{title}</h2>
    <p className="text-2xl text-gray-700">{value !== undefined ? value : 'N/A'}</p>
  </div>
);

export default FinalReport;
