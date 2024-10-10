import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddLearningPath = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [learningPath, setLearningPath] = useState({
    id: null,
    title: '',
    description: ''
  });
  const [learningPaths, setLearningPaths] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null); // State to track the hovered row
  const [currentPage, setCurrentPage] = useState(1);
  const [pathsPerPage] = useState(5); // Number of learning paths per page

  useEffect(() => {
    fetchLearningPaths();
  }, []);

  const fetchLearningPaths = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/learning-paths');
      const sortedPaths = response.data.sort((a, b) => a.id - b.id);
      setLearningPaths(sortedPaths);
    } catch (error) {
      console.error('Error fetching learning paths:', error);
      toast.error('Error fetching learning paths.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLearningPath((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (learningPath.id) {
        await axios.put(`http://localhost:3000/api/learning-paths/${learningPath.id}`, learningPath);
        toast.success('Learning Path updated successfully!');
        setLearningPaths((prev) => 
          prev.map(path => (path.id === learningPath.id ? learningPath : path))
        );
      } else {
        const response = await axios.post('http://localhost:3000/api/learning-paths', learningPath);
        toast.success('Learning Path added successfully!');
        setLearningPaths((prev) => [...prev, response.data]); 
      }

      setLearningPath({ id: null, title: '', description: '' });
      setIsOpen(false);
    } catch (error) {
      console.error('Error submitting learning path:', error);
      toast.error('Error saving Learning Path. Please try again.');
    }
  };

  const handleEdit = (path) => {
    setLearningPath(path);
    setIsOpen(true);
  };

  // Pagination logic
  const indexOfLastPath = currentPage * pathsPerPage;
  const indexOfFirstPath = indexOfLastPath - pathsPerPage;
  const currentPaths = learningPaths.slice(indexOfFirstPath, indexOfLastPath);

  return (
    <div className="flex flex-col items-center justify-start h-screen bg-gray-100 relative p-4">
      <div className="flex justify-between w-full max-w-2xl mb-4">
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-lg font-semibold">Total Learning Paths</h2>
          <p className="text-2xl">{learningPaths.length}</p>
        </div>
      </div>
      <button
        onClick={() => {
          setLearningPath({ id: null, title: '', description: '' });
          setIsOpen(true);
        }}
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
      >
        Add Learning Path
      </button>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm">
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">{learningPath.id ? 'Edit Learning Path' : 'Add Learning Path'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1" htmlFor="title">Title:</label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={learningPath.title}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1" htmlFor="description">Description:</label>
                <textarea
                  name="description"
                  id="description"
                  value={learningPath.description}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
                  Submit
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
              <th className="px-4 py-2 text-left border-b border-gray-300">Title</th>
              <th className="px-4 py-2 text-left border-b border-gray-300">Description</th>
              <th className="px-4 py-2 text-left border-b border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentPaths.map((path, index) => (
              <tr
                key={path.id}
                className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                onMouseEnter={() => setHoveredRow(path.id)} // Set hovered row
                onMouseLeave={() => setHoveredRow(null)}   // Reset hovered row
              >
                <td className="border px-4 py-2">{path.id}</td>
                <td className="border px-4 py-2">{path.title}</td>
                <td className="border px-4 py-2">{path.description}</td>
                <td className="border px-4 py-2">
                  {hoveredRow === path.id && ( // Show edit button on hover
                    <button
                      onClick={() => handleEdit(path)}
                      className="bg-yellow-500 text-white py-1 px-2 rounded-md hover:bg-yellow-600 transition duration-300"
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {currentPaths.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4">No learning paths found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between mt-4 w-full max-w-2xl">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-gray-300 text-black py-1 px-3 rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span className="self-center">{`Page ${currentPage} of ${Math.ceil(learningPaths.length / pathsPerPage)}`}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(learningPaths.length / pathsPerPage)))}
          disabled={currentPage === Math.ceil(learningPaths.length / pathsPerPage)}
          className="bg-gray-300 text-black py-1 px-3 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default AddLearningPath;
