// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const AddCourse = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [course, setCourse] = useState({
//     id: null,
//     title: '',
//     duration: 0,
//     difficultyLevel: '',
//     description: '',
//     learningPathId: '',
//   });
//   const [learningPaths, setLearningPaths] = useState([]);
//   const [hoveredRow, setHoveredRow] = useState(null);
//   const [courses, setCourses] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [coursesPerPage] = useState(8); // Number of courses per page

//   useEffect(() => {
//     fetchLearningPaths();
//     fetchCourses();
//   }, []);

//   const fetchLearningPaths = async () => {
//     try {
//       const response = await axios.get('http://localhost:3000/api/learning-paths');
//       setLearningPaths(response.data);
//     } catch (error) {
//       console.error('Error fetching learning paths:', error);
//       toast.error('Error fetching learning paths.');
//     }
//   };

//   const fetchCourses = async () => {
//     try {
//       const response = await axios.get('http://localhost:3000/api/courses');
//       const sortedCourses = response.data.sort((a, b) => a.id - b.id); // Sort courses by ID
//       setCourses(sortedCourses); // Update state with sorted courses
//     } catch (error) {
//       console.error('Error fetching courses:', error);
//       toast.error('Error fetching courses.');
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setCourse((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (course.id) {
//         // Update existing course
//         await axios.put(`http://localhost:3000/api/courses/${course.id}`, course);
//         toast.success('Course updated successfully!');
//         setCourses((prev) =>
//           prev.map((c) => (c.id === course.id ? course : c))
//         );
//       } else {
//         // Create new course
//         const response = await axios.post('http://localhost:3000/api/courses', {
//           ...course,
//           duration: Number(course.duration), // Ensure duration is a number
//         });
//         toast.success('Course added successfully!');
//         setCourses((prev) => [...prev, response.data]);
//       }
//       setCourse({ id: null, title: '', duration: 0, difficultyLevel: '', description: '', learningPathId: '' }); // Reset form
//       setIsOpen(false);
//     } catch (error) {
//       console.error('Error saving course:', error);
//       toast.error('Error saving course. Please try again.');
//     }
//   };

//   const handleEdit = (course) => {
//     setCourse(course);
//     setIsOpen(true);
//   };

//   // Pagination logic
//   const indexOfLastCourse = currentPage * coursesPerPage;
//   const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
//   const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

//   return (
//     <div className="flex flex-col items-center justify-start h-screen bg-gray-100 relative p-4">
//       {/* Total Count Card and Add Course Button */}
//       <div className="flex justify-between w-full max-w-2xl mb-4">
//         <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
//           <h2 className="text-lg font-semibold text-gray-600">Total Courses</h2>
//           <p className="text-4xl font-bold text-blue-600">{courses.length}</p>
//         </div>
//         <button
//           onClick={() => {
//             setCourse({ id: null, title: '', duration: 0, difficultyLevel: '', description: '', learningPathId: '' });
//             setIsOpen(true);
//           }}
//           className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 shadow-md transition duration-300"
//         >
//           Add Course
//         </button>
//       </div>

//       {/* Modal */}
//       {isOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md border border-gray-200">
//             <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">{course.id ? 'Edit Course' : 'Add Course'}</h2>
//             <form onSubmit={handleSubmit}>
//               <div className="mb-4">
//                 <label className="block text-gray-600 font-medium mb-1" htmlFor="title">Title:</label>
//                 <input
//                   type="text"
//                   name="title"
//                   id="title"
//                   value={course.title}
//                   onChange={handleChange}
//                   required
//                   className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-600 font-medium mb-1" htmlFor="duration">Duration (in hours):</label>
//                 <input
//                   type="number"
//                   name="duration"
//                   id="duration"
//                   value={course.duration}
//                   onChange={handleChange}
//                   required
//                   className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-600 font-medium mb-1" htmlFor="difficultyLevel">Difficulty Level:</label>
//                 <select
//                   name="difficultyLevel"
//                   id="difficultyLevel"
//                   value={course.difficultyLevel}
//                   onChange={handleChange}
//                   required
//                   className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
//                 >
//                   <option value="">Select Level</option>
//                   <option value="Beginner">Beginner</option>
//                   <option value="Intermediate">Intermediate</option>
//                   <option value="Advanced">Advanced</option>
//                 </select>
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-600 font-medium mb-1" htmlFor="description">Description:</label>
//                 <textarea
//                   name="description"
//                   id="description"
//                   value={course.description}
//                   onChange={handleChange}
//                   required
//                   rows="3"
//                   className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-600 font-medium mb-1" htmlFor="learningPathId">Learning Path:</label>
//                 <select
//                   name="learningPathId"
//                   id="learningPathId"
//                   value={course.learningPathId}
//                   onChange={handleChange}
//                   required
//                   className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
//                 >
//                   <option value="">Select Learning Path</option>
//                   {learningPaths.map((path) => (
//                     <option key={path.id} value={path.id}>{path.title}</option>
//                   ))}
//                 </select>
//               </div>
//               <div className="flex justify-end">
//                 <button
//                   type="button"
//                   onClick={() => setIsOpen(false)}
//                   className="mr-2 bg-gray-300 text-gray-800 py-1 px-3 rounded-md hover:bg-gray-400 transition duration-300"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
//                 >
//                   Submit
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Table to display existing courses */}
//       <div className="mt-6 w-full max-w-2xl bg-white shadow-md rounded-lg overflow-hidden">
//         <table className="min-w-full border border-gray-300">
//           <thead className="bg-blue-600 text-white">
//             <tr>
//               <th className="px-4 py-2 text-left border-b border-gray-300">ID</th>
//               <th className="px-4 py-2 text-left border-b border-gray-300">Title</th>
//               <th className="px-4 py-2 text-left border-b border-gray-300">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentCourses.map((course, index) => (
//               <tr
//                 key={course.id}
//                 className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
//                 onMouseEnter={() => setHoveredRow(course.id)}
//                 onMouseLeave={() => setHoveredRow(null)}
//               >
//                 <td className="border px-4 py-2">{course.id}</td>
//                 <td className="border px-4 py-2">{course.title}</td>
//                 <td className="border px-4 py-2">
//                   {hoveredRow === course.id && (
//                     <button
//                       onClick={() => handleEdit(course)}
//                       className="bg-yellow-500 text-white py-1 px-3 rounded-md hover:bg-yellow-600 transition duration-300"
//                     >
//                       Edit
//                     </button>
//                   )}
//                 </td>
//               </tr>
//             ))}
//             {currentCourses.length === 0 && (
//               <tr>
//                 <td colSpan="3" className="text-center py-4 text-gray-500">No courses found.</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination Controls */}
//       <div className="flex justify-between mt-6 w-full max-w-2xl">
//         <button
//           onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//           disabled={currentPage === 1}
//           className="bg-gray-300 text-gray-800 py-1 px-4 rounded-md disabled:opacity-50"
//         >
//           Previous
//         </button>
//         <span className="text-gray-600 self-center">{`Page ${currentPage} of ${Math.ceil(courses.length / coursesPerPage)}`}</span>
//         <button
//           onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(courses.length / coursesPerPage)))}
//           disabled={currentPage === Math.ceil(courses.length / coursesPerPage)}
//           className="bg-gray-300 text-gray-800 py-1 px-4 rounded-md disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>

//       <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
//     </div>
//   );
// };

// export default AddCourse;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit } from 'react-icons/fa'; // Importing a pencil icon

const AddCourse = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [course, setCourse] = useState({
    id: null,
    title: '',
    duration: 0,
    difficultyLevel: '',
    description: '',
    learningPathId: '',
  });
  const [learningPaths, setLearningPaths] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(8); // Number of courses per page

  useEffect(() => {
    fetchLearningPaths();
    fetchCourses();
  }, []);

  const fetchLearningPaths = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/learning-paths');
      setLearningPaths(response.data);
    } catch (error) {
      console.error('Error fetching learning paths:', error);
      toast.error('Error fetching learning paths.');
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/courses');
      const sortedCourses = response.data.sort((a, b) => a.id - b.id);
      setCourses(sortedCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Error fetching courses.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (course.id) {
        await axios.put(`http://localhost:3000/api/courses/${course.id}`, course);
        toast.success('Course updated successfully!');
        setCourses((prev) =>
          prev.map((c) => (c.id === course.id ? course : c))
        );
      } else {
        const response = await axios.post('http://localhost:3000/api/courses', {
          ...course,
          duration: Number(course.duration),
        });
        toast.success('Course added successfully!');
        setCourses((prev) => [...prev, response.data]);
      }
      setCourse({ id: null, title: '', duration: 0, difficultyLevel: '', description: '', learningPathId: '' });
      setIsOpen(false);
    } catch (error) {
      console.error('Error saving course:', error);
      toast.error('Error saving course. Please try again.');
    }
  };

  const handleEdit = (course) => {
    setCourse(course);
    setIsOpen(true);
  };

  // Pagination logic
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

  return (
    <div className="flex flex-col items-center justify-start h-screen bg-gray-100 relative p-4">
      <div className="flex justify-between w-full max-w-2xl mb-4">
        <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-600">Total Courses</h2>
          <p className="text-4xl font-bold text-blue-600">{courses.length}</p>
        </div>
        <button
          onClick={() => {
            setCourse({ id: null, title: '', duration: 0, difficultyLevel: '', description: '', learningPathId: '' });
            setIsOpen(true);
          }}
          className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 shadow-md transition duration-300"
        >
          Add Course
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md border border-gray-200">
            <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">{course.id ? 'Edit Course' : 'Add Course'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-600 font-medium mb-1" htmlFor="title">Title:</label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={course.title}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-600 font-medium mb-1" htmlFor="duration">Duration (in hours):</label>
                <input
                  type="number"
                  name="duration"
                  id="duration"
                  value={course.duration}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-600 font-medium mb-1" htmlFor="difficultyLevel">Difficulty Level:</label>
                <select
                  name="difficultyLevel"
                  id="difficultyLevel"
                  value={course.difficultyLevel}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">Select Level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-600 font-medium mb-1" htmlFor="description">Description:</label>
                <textarea
                  name="description"
                  id="description"
                  value={course.description}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-600 font-medium mb-1" htmlFor="learningPathId">Learning Path:</label>
                <select
                  name="learningPathId"
                  id="learningPathId"
                  value={course.learningPathId}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">Select Learning Path</option>
                  {learningPaths.map((path) => (
                    <option key={path.id} value={path.id}>{path.title}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="mr-2 bg-gray-300 text-gray-800 py-1 px-3 rounded-md hover:bg-gray-400 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
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
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-2 text-left border-b border-gray-300">ID</th>
              <th className="px-4 py-2 text-left border-b border-gray-300">Title</th>
              <th className="px-4 py-2 text-left border-b border-gray-300"></th> {/* Empty header for actions */}
            </tr>
          </thead>
          <tbody>
            {currentCourses.map((course, index) => (
              <tr
                key={course.id}
                className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                onMouseEnter={() => setHoveredRow(course.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td className="border px-4 py-2">{course.id}</td>
                <td className="border px-4 py-2">{course.title}</td>
                <td className="border px-4 py-2 text-center">
                  {hoveredRow === course.id && (
                    <button
                      onClick={() => handleEdit(course)}
                      className="text-yellow-500 hover:text-yellow-600 transition duration-300"
                    >
                      <FaEdit className="w-5 h-5" /> {/* Edit icon */}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {currentCourses.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center py-4 text-gray-500">No courses found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between mt-6 w-full max-w-2xl">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-gray-300 text-gray-800 py-1 px-4 rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-600 self-center">{`Page ${currentPage} of ${Math.ceil(courses.length / coursesPerPage)}`}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(courses.length / coursesPerPage)))}
          disabled={currentPage === Math.ceil(courses.length / coursesPerPage)}
          className="bg-gray-300 text-gray-800 py-1 px-4 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default AddCourse;
