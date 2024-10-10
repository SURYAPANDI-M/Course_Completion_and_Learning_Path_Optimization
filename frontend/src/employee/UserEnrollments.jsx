import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for React Toastify

const UserEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [progress, setProgress] = useState(0);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [filter, setFilter] = useState('all'); // New state for filter

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const userId = sessionStorage.getItem('userId');
        const response = await axios.get(`http://localhost:3000/api/employee-enrollments/user/${userId}`);
        setEnrollments(response.data);
      } catch (error) {
        console.error('Error fetching enrollments:', error);
        toast.error('Failed to fetch enrollments!'); // Notify on error
      }
    };

    fetchEnrollments();
  }, []);

  const handleProgressChange = async (enrollmentId) => {
    try {
      await axios.put(`http://localhost:3000/api/employee-enrollments/progress`, {
        enrollmentId,
        percentage: progress,
      });
      toast.success('Progress updated successfully!'); // Notify on success
      setSelectedEnrollment(null); // Close the progress slider after updating

      // Optionally, you can fetch the updated enrollments again
      const userId = sessionStorage.getItem('userId');
      const response = await axios.get(`http://localhost:3000/api/employee-enrollments/user/${userId}`);
      setEnrollments(response.data);
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('Failed to update progress!'); // Notify on error
    }
  };

  const handleCancel = () => {
    setSelectedEnrollment(null); // Close the progress slider
    setProgress(0); // Reset progress
    toast.info('Progress update canceled.'); // Notify on cancel
  };

  // Filtered enrollments based on the selected filter
  const filteredEnrollments = enrollments.filter(enrollment => {
    if (filter === 'completed') {
      return enrollment.completionStatus === 'Completed';
    } else if (filter === 'in-progress') {
      return enrollment.completionStatus === 'In Progress';
    }
    return true; // 'all' filter shows all enrollments
  });

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6">User Enrollments</h2>
      
      {/* Filter buttons */}
      <div className="mb-4">
        <button className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600" onClick={() => setFilter('all')}>
          All
        </button>
        <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 mx-2" onClick={() => setFilter('in-progress')}>
          In Progress
        </button>
        <button className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600" onClick={() => setFilter('completed')}>
          Completed
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEnrollments.map((enrollment) => (
          <div key={enrollment.id} className="bg-white shadow-md rounded-lg p-4">
            <h4 className="text-lg font-semibold mb-2">Course Title: {enrollment.courseTitle}</h4>
            <p className="mb-2">
              Completion Status: <span className="text-blue-600">{enrollment.completionStatus}</span>
            </p>
            <div className="flex items-center mb-2">
              <p className="mr-4">Progress: {enrollment.percentage}%</p>
              {/* Conditionally render the Update Progress button if percentage < 100 */}
              {enrollment.percentage < 100 && (
                <button
                  className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                  onClick={() => {
                    setSelectedEnrollment(enrollment);
                    setProgress(enrollment.percentage); // Set progress to the current percentage
                  }}
                >
                  Update Progress
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedEnrollment && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Update Progress for {selectedEnrollment.courseTitle}</h3>
          <input
            type="range"
            min={selectedEnrollment.percentage} // Set minimum value to current progress
            max="100"
            value={progress}
            onChange={(e) => setProgress(parseInt(e.target.value, 10))}
            className="w-full mb-4"
          />
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Progress: {progress}%</p>
            <div className="flex space-x-2">
              <button
                className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                onClick={() => handleProgressChange(selectedEnrollment.id)} // Pass enrollmentId
              >
                Save Progress
              </button>
              <button
                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                onClick={handleCancel} // Cancel button
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer /> {/* Toast container for notifications */}
    </div>
  );
};

export default UserEnrollments;
