import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ComplianceSummary from './components/ComplianceSummary';
import TaskList from './components/TaskList';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/" element={
          <>
            <Dashboard />
            <ComplianceSummary />
            <TaskList />
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;
