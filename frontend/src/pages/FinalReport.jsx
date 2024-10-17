// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Chart from 'react-apexcharts';

// const FinalReport = () => {
//   const [reportData, setReportData] = useState([]);
//   const [learningPaths, setLearningPaths] = useState([]);
//   const [selectedLearningPath, setSelectedLearningPath] = useState('');
//   const [averageCompletionTime, setAverageCompletionTime] = useState({});
//   const [statusDistribution, setStatusDistribution] = useState({});

//   // Fetching learning paths
//   useEffect(() => {
//     const fetchLearningPaths = async () => {
//       try {
//         const response = await axios.get('http://localhost:3000/api/finalreports/learning-paths');
//         setLearningPaths(response.data);
//         console.log(response.data);
//       } catch (error) {
//         console.error('Error fetching learning paths:', error);
//       }
//     };
//     fetchLearningPaths();
//   }, []);

//   // Fetching the report data
//   const fetchReportData = async (learningPathId = '') => {
//     try {
//       const response = await axios.get('http://localhost:3000/api/finalreports/finalreports', {
//         params: {
//           learningPathId: learningPathId || undefined,
//         },
//       });
//       setReportData(response.data);
//       console.log(response.data);
//       calculateAverageCompletionTime(response.data);

//       // Calculate status distribution
//       const statusCounts = calculateCompletionStatusDistribution(response.data);
//       setStatusDistribution(statusCounts);
//     } catch (error) {
//       console.error('Error fetching report data:', error);
//     }
//   };

//   // Calculate the completion status distribution
//   const calculateCompletionStatusDistribution = (data) => {
//     const statusCounts = {
//       Completed: 0,
//       'In Progress': 0,
//     };

//     data.forEach(course => {
//       if (statusCounts[course.completionStatus] !== undefined) {
//         statusCounts[course.completionStatus] += 1;
//       }
//     });

//     return statusCounts;
//   };

//   // Handle the learning path change
//   const handleLearningPathChange = (e) => {
//     const learningPathId = e.target.value;
//     setSelectedLearningPath(learningPathId);
//     fetchReportData(learningPathId);
//   };

//   // Fetch the overall report data on initial render
//   useEffect(() => {
//     fetchReportData();
//   }, []);

//   // Calculate the average completion time
//   const calculateAverageCompletionTime = (data) => {
//     const completionTimes = {};

//     data.forEach(course => {
//       if (course.completionStatus === 'Completed' && course.completionDate) {
//         const enrollmentDate = new Date(course.enrollmentDate);
//         const completionDate = new Date(course.completionDate);
//         const completionTime = (completionDate - enrollmentDate) / (1000 * 60); // Time in minutes

//         if (!completionTimes[course.learningPathId]) {
//           completionTimes[course.learningPathId] = [];
//         }
//         completionTimes[course.learningPathId].push(completionTime);
//       }
//     });

//     const averageTimes = {};
//     Object.keys(completionTimes).forEach(id => {
//       const total = completionTimes[id].reduce((acc, time) => acc + time, 0);
//       averageTimes[id] = (total / completionTimes[id].length).toFixed(2); // Average in minutes
//     });

//     setAverageCompletionTime(averageTimes);
//   };

//   // Data preparation for the average completion time chart
//   const averageCompletionChartData = {
//     series: [{
//       name: 'Average Completion Time (Minutes)',
//       data: Object.values(averageCompletionTime),
//     }],
//     options: {
//       chart: {
//         type: 'bar',
//       },
//       xaxis: {
//         categories: Object.keys(averageCompletionTime),
//         title: {
//           text: 'Learning Path ID',
//         },
//       },
//       yaxis: {
//         title: {
//           text: 'Average Completion Time (Minutes)',
//         },
//       },
//     },
//   };

//   // Data preparation for the completion status pie chart
//   const statusChartData = {
//     series: [statusDistribution.Completed, statusDistribution['In Progress']],
//     options: {
//       chart: {
//         type: 'pie',
//       },
//       labels: ['Completed', 'In Progress'],
//       title: {
//         text: 'Completion Status Distribution',
//       },
//     },
//   };

//   const totalLearningPaths = learningPaths.length;
//   const totalInProgress = reportData.filter(course => course.completionStatus === 'In Progress').length;
//   const totalCompleted = reportData.filter(course => course.completionStatus === 'Completed').length;

//   return (
//     <div className="max-w-7xl mx-auto p-4">
//       <h1 className="text-3xl font-bold mb-4">Final Report</h1>

//       <div>
//         <label htmlFor="learning-path-select" className="block mb-2">Select Learning Path:</label>
//         <select id="learning-path-select" value={selectedLearningPath} onChange={handleLearningPathChange} className="mb-4 p-2 border border-gray-300 rounded">
//           <option value="">All Learning Paths</option>
//           {learningPaths.map(path => (
//             <option key={path.id} value={path.id}>{path.title}</option>
//           ))}
//         </select>
//       </div>

//       <h2 className="text-2xl font-bold mb-4">Overall Statistics</h2>
//       <div className="grid grid-cols-3 gap-4 mb-8">
//         <div className="p-4 border rounded">
//           <h3 className="font-bold">Total Learning Paths</h3>
//           <p>{totalLearningPaths}</p>
//         </div>
//         <div className="p-4 border rounded">
//           <h3 className="font-bold">Total In Progress</h3>
//           <p>{totalInProgress}</p>
//         </div>
//         <div className="p-4 border rounded">
//           <h3 className="font-bold">Total Completed</h3>
//           <p>{totalCompleted}</p>
//         </div>
//       </div>

//       <div className="mt-8">
//         <h2 className="text-2xl font-bold mb-4">Average Completion Time for Completed Courses</h2>
//         <Chart options={averageCompletionChartData.options} series={averageCompletionChartData.series} type="bar" height={350} />
//       </div>

//       <div className="mt-8">
//         <div className='col-6'>
//         <h2 className="text-2xl font-bold mb-4">Completion Status Distribution</h2>
//         <Chart options={statusChartData.options} series={statusChartData.series} type="pie" height={350} />
//         </div>
//         <div className='col-6'>
//         <h2 className="text-2xl font-bold mb-4">Completion Status Distribution</h2>
//         <Chart options={statusChartData.options} series={statusChartData.series} type="pie" height={350} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FinalReport;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';

const FinalReport = () => {
  const [reportData, setReportData] = useState([]);
  const [learningPaths, setLearningPaths] = useState([]);
  const [selectedLearningPath, setSelectedLearningPath] = useState('');
  const [averageCompletionTime, setAverageCompletionTime] = useState({});
  const [statusDistribution, setStatusDistribution] = useState({});
  const [areaChartData, setAreaChartData] = useState({ series: [], options: {} });
  const [flatData, setFlatData] = useState([])

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
      
      const groupedData = groupByLearningPathId(response.data);
      setReportData(groupedData);
      // Convert grouped data back to an array for further processing
      const flatdata = Object.values(groupedData).flat(); // Flattening the grouped data
  
      calculateAverageCompletionTime(groupedData);

      setFlatData(flatdata)
      
      const statusCounts = calculateCompletionStatusDistribution(groupedData); // Use flatData here
      setStatusDistribution(statusCounts);
      generateAreaChartData(groupedData);
    } catch (error) {
      console.error('Error fetching report data:', error);
    }
  };
  

  // Group report data by learningPathId
  const groupByLearningPathId = (data) => {
    return data.reduce((acc, course) => {
      if (!acc[course.learningPathId]) {
        acc[course.learningPathId] = [];
      }
      acc[course.learningPathId].push(course);
      return acc;
    }, {});
  };

  // Calculate the completion status distribution
  const calculateCompletionStatusDistribution = (groupedData) => {
    const statusCounts = {
      Completed: 0,
      'In Progress': 0,
    };

    Object.values(groupedData).forEach(courses => {
      courses.forEach(course => {
        if (statusCounts[course.completionStatus] !== undefined) {
          statusCounts[course.completionStatus] += 1;
        }
      });
    });

    return statusCounts;
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

  // Calculate the average completion time
  const calculateAverageCompletionTime = (groupedData) => {
    const averageTimes = {};

    Object.entries(groupedData).forEach(([id, courses]) => {
      const completionTimes = courses.reduce((acc, course) => {
        if (course.completionStatus === 'Completed' && course.completionDate) {
          const enrollmentDate = new Date(course.enrollmentDate);
          const completionDate = new Date(course.completionDate);
          const completionTime = (completionDate - enrollmentDate) / (1000 * 60); // Time in minutes
          acc.push(completionTime);
        }
        return acc;
      }, []);
      
      if (completionTimes.length) {
        const total = completionTimes.reduce((acc, time) => acc + time, 0);
        averageTimes[id] = (total / completionTimes.length).toFixed(2); // Average in minutes
      }
    });

    setAverageCompletionTime(averageTimes);
  };

  // Generate area chart data
  const generateAreaChartData = (groupedData) => {
    const series = [];

    Object.entries(groupedData).forEach(([learningPathId, courses]) => {
        // Calculate total percentage and number of courses
        let totalPercentage = 0;
        let completedCoursesCount = 0;

        // Collect course data for averaging
        courses.forEach(course => {
            if (course.percentage) {
                totalPercentage += course.percentage;
                completedCoursesCount++;
            }
        });

        // Calculate average percentage
        const averagePercentage = completedCoursesCount > 0 ? totalPercentage / completedCoursesCount : 0;


        // If there are completed courses, generate hourly data
        if (completedCoursesCount > 0) {
            const enrollmentDate = new Date(courses[0].enrollmentDate); // Assuming all have the same enrollment date for the sake of this example
            const today = new Date();
            const completionDate = courses[0].completionDate ? new Date(courses[0].completionDate) : today;
            const durationHours = Math.ceil((completionDate - enrollmentDate) / (1000 * 60 * 60)); // Duration in hours

            const hourlyData = [];
            for (let i = 0; i <= durationHours; i++) {
                const currentHour = new Date(enrollmentDate.getTime() + i * 60 * 60 * 1000);
                hourlyData.push({
                    x: currentHour.toLocaleString([], { hour: '2-digit', minute: '2-digit' }),
                    y: averagePercentage,
                });
            }

            series.push({
                name: `Learning Path ${learningPathId}`,
                data: hourlyData,
            });
        }
    });
    setAreaChartData({
      series: series,
      options: {
        chart: {
          type: 'area',
        },
        xaxis: {
          type: 'category',
          title: {
            text: 'Time',
          },
        },
        yaxis: {
          title: {
            text: 'Average Percentage',
          },
          min: 0,
          max: 100,
        },
        stroke: {
          curve: 'smooth',
        },
      },
    });
    return series; // Make sure to return the generated series for use in your chart
};

  // Data preparation for the average completion time chart
  const averageCompletionChartData = {
    series: [{
      name: 'Average Completion Time (Minutes)',
      data: Object.values(averageCompletionTime),
    }],
    options: {
      chart: {
        type: 'bar',
      },
      xaxis: {
        categories: Object.keys(averageCompletionTime),
        title: {
          text: 'Learning Path ID',
        },
      },
      yaxis: {
        title: {
          text: 'Average Completion Time (Minutes)',
        },
      },
    },
  };

  // Data preparation for the completion status pie chart
  const statusChartData = {
    series: [statusDistribution.Completed, statusDistribution['In Progress']],
    options: {
      chart: {
        type: 'pie',
      },
      labels: ['Completed', 'In Progress'],
      title: {
        text: 'Completion Status Distribution',
      },
    },
  };

  const totalLearningPaths = learningPaths.length;
  const totalInProgress = reportData ? flatData.filter(course => course.completionStatus === 'In Progress').length : 0;
  const totalCompleted = reportData ? flatData.filter(course => course.completionStatus === 'Completed').length : 0;

  console.log(areaChartData)

  return (
    <div className="max-w-7xl mx-auto p-4 bg-transparent">
      <h1 className="text-3xl font-bold mb-4">Final Report</h1>

      <div>
        <label htmlFor="learning-path-select" className="block mb-2">Select Learning Path:</label>
        <select id="learning-path-select" value={selectedLearningPath} onChange={handleLearningPathChange} className="mb-4 p-2 border border-gray-300 rounded">
          <option value="">All Learning Paths</option>
          {learningPaths.map(path => (
            <option key={path.id} value={path.id}>{path.title}</option>
          ))}
        </select>
      </div>

      <h2 className="text-2xl font-bold mb-4">Overall Statistics</h2>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="p-4 border rounded">
          <h3 className="font-bold">Total Learning Paths</h3>
          <p>{totalLearningPaths}</p>
        </div>
        <div className="p-4 border rounded">
          <h3 className="font-bold">Total In Progress</h3>
          <p>{totalInProgress}</p>
        </div>
        <div className="p-4 border rounded">
          <h3 className="font-bold">Total Completed</h3>
          <p>{totalCompleted}</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Average Completion Time for Completed Courses</h2>
        <Chart options={averageCompletionChartData.options} series={averageCompletionChartData.series} type="bar" height={350} />
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 t ">
        <div>
          <h2 className="text-2xl font-bold mb-4">Completion Status Distribution</h2>
          <Chart options={statusChartData.options} series={statusChartData.series} type="pie" height={350} />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Area Chart of Completion Over Time</h2>
          <Chart options={areaChartData.options} series={areaChartData.series} type="area" height={350} />
        </div>
      </div>
    </div>
  );
};

export default FinalReport;

