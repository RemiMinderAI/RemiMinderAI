import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient"; // make sure you import supabase
import styles from '../patient/PatientConsent.module.css';
import API_BASE_URL from '../config'; 

const CompleteProfile = () => {
  const navigate = useNavigate();
  const [storedEmail, setStoredEmail] = useState(localStorage.getItem("caregiverEmail"));
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: storedEmail || '', // initialize empty for now
    relationship: '',
    additionalNotes: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If no local email, fetch from Supabase
    if (!storedEmail) {
      const fetchUser = async () => {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          console.error("Error fetching user:", error.message);
          return;
        }
        if (user) {
          setFormData(prev => ({ ...prev, email: user.email }));
        }
      };
      fetchUser();
    }
  }, [storedEmail]);

  const [hoveredButton, setHoveredButton] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleComplete = async () => {
    if (loading) return;     // prevent double-clicks
    setLoading(true);

    if (!formData.fullName || !formData.phoneNumber) {
      alert("Please fill in all required fields before continuing.");
      setLoading(false);
      return;
    }
  
    try {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token") || localStorage.getItem("invitationToken");
      const email = localStorage.getItem("caregiverEmail") || formData.email;
  
      // Save locally
      localStorage.setItem("caregiverProfile", JSON.stringify(formData));
      localStorage.setItem("onboarding_complete", "true");
  
      let res, data;
  
      if (token) {
        // ✅ Scenario 1: Caregiver accepts invitation
        
        res = await fetch(`${API_BASE_URL}/api/invitations/complete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            email,
            full_name: formData.fullName,
            phone_number: formData.phoneNumber,
            relationship: formData.relationship || "Other",
            notes: formData.additionalNotes || "",
          }),
        });
      } else {
        // ✅ Scenario 2: Direct registration (no invitation)
        res = await fetch(`${API_BASE_URL}/api/caregivers/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            full_name: formData.fullName,
            phone_number: formData.phoneNumber,
            email,
            notes: formData.additionalNotes || "",
          }),
        });
      }
  
      data = await res.json();
  
      if (!res.ok) {
        console.error("Error saving profile:", data);
        alert(data.detail || "Error saving profile. Please try again.");
        return;
      }
  
      console.log("Profile saved successfully:", data);
      navigate("/dashboard/caregiver");
    } catch (error) {
      console.error("Error:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };  

  const handlePhotoUpload = () => {
    console.log('Photo upload clicked');
    // Add photo upload logic here
  };

  const goHome = () => {
    navigate("/");
  };

  return (
    <div className={styles.container}>
      {/* Header (same as registration) */}
      <header className={styles.header}>
        <div className={styles.logo} onClick={goHome}>
          RemiMinderAI
        </div>
      </header>
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(to bottom, #F8FBF9, #FFFFFF)',
        paddingTop: '120px',
        fontFamily: 'Inter, SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{
          maxWidth: '1440px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '0 24px'
        }}>
          {/* Header Section */}
          <div style={{ textAlign: 'center', marginBottom: '32px'}}>
            <h1 style={{
              fontSize: '30px',
              fontWeight: 'bold',
              color: '#111827',
              margin: '0',
              lineHeight: '1.2'
            }}>
              Complete Your Profile
            </h1>
            
            <p style={{
              fontSize: '18px',
              fontWeight: 'normal',
              color: '#6B7280',
              margin: '8px 0 0 0',
              lineHeight: '1.4'
            }}>
              Tell us a bit about yourself
            </p>
          </div>

          {/* Profile Upload Section */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.05)',
            width: '640px',
            padding: '40px',
            marginBottom: '32px'
          }}>
            {/* Profile Photo Upload */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <div style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  backgroundColor: '#F3F4F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto'
                }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <button
                  onClick={handlePhotoUpload}
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#00B881',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                </button>
              </div>
              <p style={{
                fontSize: '14px',
                color: '#6B7280',
                margin: '8px 0 0 0'
              }}>
                Upload profile photo
              </p>
            </div>

            {/* Form Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Full Name */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '8px'
                }}>
                  Full Name*
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  style={{
                    width: '100%',
                    height: '48px',
                    backgroundColor: '#F9FAFB',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    padding: '0 12px',
                    fontSize: '16px',
                    color: '#111827',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#00B881'}
                  onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>

              {/* Phone Number */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '8px'
                }}>
                  Phone Number*
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 000-0000"
                  style={{
                    width: '100%',
                    height: '48px',
                    backgroundColor: '#F9FAFB',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    padding: '0 12px',
                    fontSize: '16px',
                    color: '#111827',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#00B881'}
                  onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>

              {/* Email Address */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '8px'
                }}>
                  Email Address*
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  style={{
                    width: '100%',
                    height: '48px',
                    backgroundColor: '#F9FAFB',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    padding: '0 12px',
                    fontSize: '16px',
                    color: '#9CA3AF',
                    outline: 'none',
                    boxSizing: 'border-box',
                    cursor: 'not-allowed'
                  }}
                />
                <p style={{
                  fontSize: '12px',
                  color: '#9CA3AF',
                  margin: '10px 0 0 0',
                  textAlign: "left"
                }}>
                  Verified during registration
                </p>
              </div>

              {/* Relationship to Patient */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '8px'
                }}>
                  Relationship to Patient
                </label>
                <select
                  name="relationship"
                  value={formData.relationship}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    height: '48px',
                    backgroundColor: '#F9FAFB',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    padding: '0 12px',
                    fontSize: '16px',
                    color: formData.relationship ? '#111827' : '#9CA3AF',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#00B881'}
                  onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                >
                  <option value="" disabled>Select relationship</option>
                  <option value="spouse">Spouse</option>
                  <option value="child">Child</option>
                  <option value="parent">Parent</option>
                  <option value="sibling">Sibling</option>
                  <option value="friend">Friend</option>
                  <option value="other">Other</option>
                </select>
                <p style={{
                  fontSize: '13px',
                  color: '#9CA3AF',
                  margin: '10px 0 0 0',
                  textAlign: "left"
                }}>
                  Select "Other" if you have not yet received an invitation from a patient
                </p>
              </div>

              {/* Additional Notes */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '8px'
                }}>
                  Additional Notes (Optional)
                </label>
                <textarea
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleInputChange}
                  placeholder="Any additional information you'd like to share..."
                  style={{
                    width: '100%',
                    height: '100px',
                    backgroundColor: '#F9FAFB',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    padding: '12px',
                    fontSize: '16px',
                    color: '#111827',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                    boxSizing: 'border-box',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#00B881'}
                  onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                />
                <p style={{
                  fontSize: '13px',
                  color: '#9CA3AF',
                  margin: '4px 0 0 0',
                  textAlign: "left"
                }}>
                  This is visible only to you and the patients you care for
                </p>
              </div>
            </div>

            {/* Divider */}
            <div style={{
              height: '1px',
              backgroundColor: '#E5E7EB',
              width: '100%',
              margin: '32px 0'
            }} />

            {/* Review Section */}
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#111827',
                margin: '0 0 16px 0'
              }}>
                Review Your Information
              </h3>
              
              <div style={{
                backgroundColor: '#F9FAFB',
                borderRadius: '8px',
                padding: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#111827', fontWeight: '500' }}>Name:</span>
                  <span style={{ color: '#6B7280' }}>{formData.fullName || '—'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#111827', fontWeight: '500' }}>Phone:</span>
                  <span style={{ color: '#6B7280' }}>{formData.phoneNumber || '—'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#111827', fontWeight: '500' }}>Email:</span>
                  <span style={{ color: '#6B7280' }}>{formData.email}</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              style={{
                width: '100%',
                height: '48px',
                backgroundColor: loading ? '#00B88199' : '#00B881',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '16px',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '24px',
                transition: 'background-color 0.2s ease'
              }}
              disabled={loading}
              onMouseEnter={() => !loading && setHoveredButton('complete')}
              onMouseLeave={() => setHoveredButton(null)}
              onClick={handleComplete}
            >
              {loading ? "Saving..." : "Confirm & Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;
