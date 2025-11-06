// 1. Import React and routing components from BOTH branches
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// 2. Import pages from BOTH branches
import LandingPage from './components/LandingPage';
import RecordVisitPage from './components/AudioRecorder.js';
import CaregiverInvite from './caregiver/Invitation';
import CreateCaregiverAccount from './caregiver/CreateAccount';
import EmailSignupForm from './caregiver/EmailSignupForm';
import EmailVerification from './caregiver/EmailVerification';
import CompleteProfile from './caregiver/CompleteProfile';
import CaregiverDashboard from './caregiver/CaregiverDashboard';
import CaregiverSettings from './caregiver/CaregiverSettings';

import Consent from './caregiver/Consent';
import PendingInvitations from './caregiver/PendingInvitations';

// Patient pages
import PatientAudioSetup from './patient/PatientAudioSetup';
import PatientConsent from './patient/PatientConsent';
import PatientDashboard from './patient/PatientDashboard';
import PatientInvitation from './patient/PatientInvitation';
import PatientProfileSetup from './patient/PatientProfileSetup';
import PatientRegistration from './patient/PatientRegistration';
import PatientReminders from './patient/PatientReminders';
import PatientSettings from './patient/PatientSettings';
import PatientCreateAccount from './patient/PatientCreateAccount';
import PatientEmailSignupForm from './patient/PatientEmailSignupForm';
import PatientEmailVerification from './patient/PatientEmailVerification';
import PatientCompleteProfile from './patient/PatientCompleteProfile';
import SignIn from './components/SignIn';
import SignUpConfirmation from './components/SignUpConfirmation';

import VisitHistory from './patient/VisitHistory';

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
          <Route path="/dashboard/caregiver" element={<CaregiverDashboard />} />
          <Route path="/caregiver-dashboard" element={<CaregiverDashboard />} />
          <Route path="/caregiver-settings" element={<CaregiverSettings />} />

          <Route path="/consent" element={<Consent />} />

          {/* Patient routes */}
          <Route path="/dashboard/patient" element={<PatientDashboard />} />
          <Route path="/patient-invitation" element={<PatientInvitation />} />
          <Route path="/patient-create-account" element={<PatientCreateAccount />} />
          <Route path="/patient-email-signup" element={<PatientEmailSignupForm />} />
          <Route path="/patient-email-verification" element={<PatientEmailVerification />} />
          <Route path="/patient-complete-profile" element={<PatientCompleteProfile />} />
          <Route path="/patient-registration" element={<PatientRegistration />} />
          <Route path="/patient-profile-setup" element={<PatientProfileSetup />} />
          <Route path="/patient-audio-setup" element={<PatientAudioSetup />} />
          <Route path="/patient-consent" element={<PatientConsent />} />
          <Route path="/patient-dashboard" element={<PatientDashboard />} />
          <Route path="/patient-reminders" element={<PatientReminders />} />
          <Route path="/patient-settings" element={<PatientSettings />} />

          {/* Shared routes */}
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up-confirmation" element={<SignUpConfirmation />} />

          {/* You may need to decide on a default/catch-all route */}
          {/* This one from 'main' redirects unknown paths to /invitation */}
          {/* <Route path="*" element={<Navigate to="/invitation" replace />} /> */}

          {/* OR, if your landing page is the default, use this instead: */}
          <Route path="*" element={<Navigate to="/" replace />} />

          <Route path="/visit-history" element={<VisitHistory onBack={() => window.history.back()} role="patient" />} />
          <Route path="/caregiver/invitations" element={<PendingInvitations />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
