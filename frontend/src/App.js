import './App.css';
import LandingPage from './components/LandingPage';
import PatientRegistration from './components/PatientRegistration';
import PatientConsent from './components/PatientConsent';

function App() {
  return (
    <div className="App">
      {/* <LandingPage /> */}
      {/* <PatientRegistration /> */}
      <PatientConsent />
    </div>
  );
}

export default App;