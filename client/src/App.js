import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import JobList from './JobList';
import JobDetail from './JobDetail';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/login"
            element={<Login />} 
          />
          <Route
            path="/jobs"
            element={
              localStorage.getItem('token') ? <JobList /> : <Navigate to="/login" replace />
            }
          />
          <Route path="/job/:id" element={<JobDetail />} />
          <Route index element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
