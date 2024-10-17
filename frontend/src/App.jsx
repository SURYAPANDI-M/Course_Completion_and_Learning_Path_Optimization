import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUpSignIn from './pages/SignUpSignIn';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import AdminDashboard from './AdminDashboard';
import Report from './pages/FinalReport';
import EmployeeDashboard from './EmployeeDashboard';
import AddLearningPath from './AddLearningPath';
import AddCourse from './AddCourse';
import AssignCourse from './AssignCourse';
import CreateUser from './CreateUser';
import Home from './pages/Home';
import UserEnrollments from './employee/UserEnrollments';
import Profile from './Profile';
import EmployeeHome from './EmployeeHome';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<SignUpSignIn />} />
        <Route path='/signin' element={<Signin />} />
        <Route path='/signup' element={<Signup />} />
        
        <Route path='admin' element={<AdminDashboard />}>
          <Route path='add-learning-path' element={<AddLearningPath />} />
          <Route path='courses' element={<AddCourse />} />
          <Route path='assign-course' element={<AssignCourse />} />
          <Route path='users' element={<CreateUser />} />
          <Route path='home' element={<Home />} />
          <Route path='report' element={<Report />} />
          {/* Add more admin routes here */}
        </Route>

        <Route path='/employee' element={<EmployeeDashboard />}>
          <Route path='home' element={<EmployeeHome />} />
          <Route path='enrollments' element={<UserEnrollments />} />
          <Route path='profile' element={<Profile />} />
          {/* Add more employee routes here */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
