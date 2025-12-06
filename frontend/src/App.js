import React, { useState } from 'react';
import './App.css';
import Home from './pages/Home';
import Practice from './pages/Practice';
import MockInterview from './pages/MockInterview';
import Results from './pages/Results';
import Tips from './pages/Tips';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedRole, setSelectedRole] = useState('');
  const [interviewData, setInterviewData] = useState(null);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Home
            onStartPractice={(role) => {
              setSelectedRole(role);
              setCurrentPage('practice');
            }}
            onStartMock={(role) => {
              setSelectedRole(role);
              setCurrentPage('mock');
            }}
            onViewTips={() => setCurrentPage('tips')}
          />
        );
      case 'practice':
        return (
          <Practice
            role={selectedRole}
            onBack={() => setCurrentPage('home')}
            onComplete={(data) => {
              setInterviewData(data);
              setCurrentPage('results');
            }}
          />
        );
      case 'mock':
        return (
          <MockInterview
            role={selectedRole}
            onBack={() => setCurrentPage('home')}
            onComplete={(data) => {
              setInterviewData(data);
              setCurrentPage('results');
            }}
          />
        );
      case 'results':
        return (
          <Results
            data={interviewData}
            onBackHome={() => setCurrentPage('home')}
          />
        );
      case 'tips':
        return <Tips onBack={() => setCurrentPage('home')} />;
      default:
        return <Home onStartPractice={() => setCurrentPage('practice')} />;
    }
  };

  return <div className="App">{renderPage()}</div>;
}

export default App;