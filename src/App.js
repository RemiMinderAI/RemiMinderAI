// 1. Import React and routing components
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// 2. Import pages and components
import LandingPage from './components/LandingPage';
import AboutPage from "./components/AboutPage";
import PrivacyPolicyPage from "./components/PrivacyPolicyPage";
import PricingPage from "./components/PricingPage";
// Corrected path based on your file structure screenshot
import RecordVisitPage from './components/AudioRecorder';
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


import PatientReminderModal from './patient/PatientReminderModal';

import VisitHistory from './patient/VisitHistory';
import ScrollToTop from "./components/ScrollToTop";
import AnnouncementBar from "./components/AnnouncementBar";
import ContactModal from "./components/ContactModal";
import MailingListModal from "./components/MailingListModal";
import FeedbackWidget from "./components/FeedbackWidget";
import { MailingListProvider } from "./context/MailingListContext";

function App() {
  return (
    <Router>
      <MailingListProvider>
        <AnnouncementBar />
        <ScrollToTop />
        <ContactModal />
        <MailingListModal />
        <FeedbackWidget />
        <div className="App">
        <Routes>
          {/* Main Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/record" element={<RecordVisitPage />} />

          {/* Caregiver Flow Routes */}
          <Route path="/invitation" element={<CaregiverInvite />} />
          <Route path="/create-account" element={<CreateCaregiverAccount />} />
          <Route path="/email-signup" element={<EmailSignupForm />} />
          <Route path="/email-verification" element={<EmailVerification />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/dashboard/caregiver" element={<CaregiverDashboard />} />
          <Route path="/caregiver-dashboard" element={<CaregiverDashboard />} />
          <Route path="/caregiver-settings" element={<CaregiverSettings />} />
          <Route path="/consent" element={<Consent />} />
          <Route path="/caregiver/invitations" element={<PendingInvitations />} />

          {/* Patient Routes */}
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
          <Route path="/patient-reminders" element={<PatientReminders />} />
          <Route path="/patient-settings" element={<PatientSettings />} />

          {/* Shared Routes */}
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up-confirmation" element={<SignUpConfirmation />} />
          <Route path="/visit-history" element={<VisitHistory onBack={() => window.history.back()} role="patient" />} />

        </Routes>
        </div>
      </MailingListProvider>
    </Router>
  );
}

export default App;
