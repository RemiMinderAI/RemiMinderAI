// 1. Import React and routing components from BOTH branches
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// 2. Import pages from BOTH branches
import LandingPage from './components/LandingPage';
import RecordVisitPage from './components/AudioRecorder.js';
import CaregiverInvite from './caregiverPages/Invitation';
import CreateCaregiverAccount from './caregiverPages/CreateAccount';
import EmailSignupForm from './caregiverPages/EmailSignupForm';
import EmailVerification from './caregiverPages/EmailVerification';
import CompleteProfile from './caregiverPages/CompleteProfile';

function App() {
  return (
    <Router>
      <div className="App"> {/* Use the <div> from the 'main' branch */}
        <Routes>
          {/* 3. Add the routes from your 'feature/record-visit' branch */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/record" element={<RecordVisitPage />} />

          {/* 4. Add all the routes from the 'main' branch */}
          <Route path="/invitation" element={<CaregiverInvite />} />
          <Route path="/create-account" element={<CreateCaregiverAccount />} />
          <Route path="/email-signup" element={<EmailSignupForm />} />
          <Route path="/email-verification" element={<EmailVerification />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />

          {/* You may need to decide on a default/catch-all route */}
          {/* This one from 'main' redirects unknown paths to /invitation */}
          <Route path="*" element={<Navigate to="/invitation" replace />} />

          {/* OR, if your landing page is the default, use this instead: */}
          {/* <Route path="*" element={<Navigate to="/" replace />} /> */}

        </Routes>
      </div>
    </Router>
  );
}

export default App;
