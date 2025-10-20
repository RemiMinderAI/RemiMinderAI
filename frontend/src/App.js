import './App.css';
import LandingPage from './components/LandingPage';
import SignIn from './components/SignIn';
import PatientRegistration from './components/PatientRegistration';
import PatientConsent from './components/PatientConsent';
import PatientProfileSetup from './components/PatientProfileSetup';
import PatientAudioSetup from './components/PatientAudioSetup';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/register/patient" element={<PatientRegistration />} />
          <Route path="/consent/patient" element={<PatientConsent />} />
          <Route path="/profile/patient" element={<PatientProfileSetup />} />
          <Route path="/audio" element={<PatientAudioSetup />} />
        </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;