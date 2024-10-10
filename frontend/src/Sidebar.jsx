import React from 'react';

const Sidebar = ({ setActiveComponent }) => {
  return (
    <div style={{
      width: '200px',
      height: '100vh',
      backgroundColor: '#f4f4f4',
      padding: '10px',
      position: 'fixed',
    }}>
      <h2>Dashboard</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li>
          <button onClick={() => setActiveComponent('learningPath')}>Add Learning Path</button>
        </li>
        <li>
          <button onClick={() => setActiveComponent('course')}>Add Course</button>
        </li>
        <li>
          <button onClick={() => setActiveComponent('assign')}>Assign Course</button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
