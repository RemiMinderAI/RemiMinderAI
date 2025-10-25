import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CaregiverInvite from './caregiverPages/Invitation';
import CreateCaregiverAccount from './caregiverPages/CreateAccount';
import EmailSignupForm from './caregiverPages/EmailSignupForm';
import EmailVerification from './caregiverPages/EmailVerification';
import CompleteProfile from './caregiverPages/CompleteProfile';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Default route redirects to invitation */}
          <Route path="/" element={<Navigate to="/invitation" replace />} />
          
          {/* Invitation page */}
          <Route path="/invitation" element={<CaregiverInvite />} />
          
          {/* Account creation page */}
          <Route path="/create-account" element={<CreateCaregiverAccount />} />
          
          {/* Email signup page */}
          <Route path="/email-signup" element={<EmailSignupForm />} />
          
          {/* Email verification page */}
          <Route path="/email-verification" element={<EmailVerification />} />
          
          {/* Profile completion page */}
          <Route path="/complete-profile" element={<CompleteProfile />} />
          
          {/* Catch all route - redirect to invitation */}
          <Route path="*" element={<Navigate to="/invitation" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
