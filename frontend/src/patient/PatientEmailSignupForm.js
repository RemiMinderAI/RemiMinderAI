import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const PatientEmailSignupForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [hoveredButton, setHoveredButton] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBackToCreateAccount = () => {
    navigate('/patient-create-account');
  };

  const handleSignIn = () => {
    navigate("/sign-in");
  };

  const handleContinue = async () => {
    if (!formData.email || !formData.password) return;

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: { role: 'patient' },
          emailRedirectTo: `${window.location.origin}/sign-up-confirmation`,
        },
      });

      if (error) {
        if (error.message.includes('already registered')) {
          alert('This email is already registered. Please use a different email.');
        } else {
          alert('Error creating account: ' + error.message);
        }
        return;
      }

      console.log('✅ Account created successfully:', data);
      navigate('/patient-email-verification');
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
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
        {/* Heading Section */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '30px',
            fontWeight: 'bold',
            color: '#111827',
            margin: '0',
            lineHeight: '1.2'
          }}>
            Create Patient Account
          </h1>

          <p style={{
            fontSize: '18px',
            fontWeight: 'normal',
            color: '#6B7280',
            margin: '8px 0 0 0',
            lineHeight: '1.4'
          }}>
            Choose your preferred sign-up method
          </p>
        </div>

        {/* Card Form Container */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.05)',
          width: '400px',
          padding: '32px 40px',
          marginBottom: '20px'
        }}>
          {/* Form Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Email Field */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '8px'
              }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
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
                onFocus={(e) => e.target.style.borderColor = '#7c3aed'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>

            {/* Password Field */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '8px'
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a secure password"
                  style={{
                    width: '100%',
                    height: '48px',
                    backgroundColor: '#F9FAFB',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    padding: '0 48px 0 12px',
                    fontSize: '16px',
                    color: '#111827',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#7c3aed'}
                  onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  style={{
                    position: 'absolute',
                     right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#6B7280',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#111827'}
                  onMouseLeave={(e) => e.target.style.color = '#6B7280'}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ marginTop: '24px' }}>
            {/* Primary Button */}
            <button
              style={{
                width: '100%',
                height: '48px',
                backgroundColor: '#7c3aed',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={() => setHoveredButton('continue')}
              onMouseLeave={() => setHoveredButton(null)}
              onClick={handleContinue}
            >
              Continue
            </button>

            {/* Secondary Button */}
            <button
              style={{
                width: '100%',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#111827',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                marginTop: '16px',
                transition: 'opacity 0.2s ease'
              }}
              onMouseEnter={() => setHoveredButton('back')}
              onMouseLeave={() => setHoveredButton(null)}
              onClick={handleBackToCreateAccount}
            >
              Back
            </button>
          </div>
        </div>

        {/* Footer Text */}
        <div style={{
          textAlign: 'center',
          fontSize: '15px',
          color: '#6B7280',
          lineHeight: '1.4'
        }}>
          Already have an account?{' '}
          <span
            style={{
              color: '#7c3aed',
              fontWeight: '600',
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'text-decoration 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
            onClick={handleSignIn}
          >
            Sign in
          </span>
        </div>
      </div>
    </div>
  );
};

export default PatientEmailSignupForm;
