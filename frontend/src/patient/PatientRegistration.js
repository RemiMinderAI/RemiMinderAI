import React from "react";
import { useNavigate } from "react-router-dom";

export default function PatientRegistration() {
  const navigate = useNavigate();

  // Redirect to the new patient registration flow
  React.useEffect(() => {
    navigate('/patient-create-account');
  }, [navigate]);

  return null;
}
