import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from '../supabaseClient';
import { FRONTEND_URL } from "../config";

const PatientCreateAccount = () => {
  const navigate = useNavigate();
  const [hoveredButton, setHoveredButton] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleButtonHover = (buttonName) => {
    setHoveredButton(buttonName);
  };

  const handleButtonLeave = () => {
    setHoveredButton(null);
  };

  const handleBackToLanding = () => {
    navigate('/');
  };

  const handleEmailSignup = () => {
    navigate('/patient-email-signup');
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${FRONTEND_URL}/patient-consent`, // after OAuth verification
        },
      });
  
      if (error) throw error;
      console.log('Google signup initiated:', data);
    } catch (error) {
      console.error('Google signup failed:', error.message);
      alert('Failed to sign up with Google: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleSignup = () => {
    alert('Apple Sign In is coming soon!');
  };  

  const handleSignUp = (method) => {
    if (method === 'Email') {
      handleEmailSignup();
    } else if (method === 'Google') {
      handleGoogleSignup();
    } else if (method === 'Apple') {
      handleAppleSignup();
    }
  };

  const handleSignIn = () => {
    navigate("/sign-in");
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
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
        {/* Main Heading */}
        <h1 style={{
          fontSize: '30px',
          fontWeight: 'bold',
          color: '#111827',
          margin: '0',
          textAlign: 'center',
          lineHeight: '1.2'
        }}>
          Create Patient Account
        </h1>

        {/* Subtitle */}
        <h2 style={{
          fontSize: '18px',
          fontWeight: 'normal',
          color: '#6B7280',
          margin: '8px 0 0 0',
          textAlign: 'center',
          lineHeight: '1.4'
        }}>
          Choose your preferred sign-up method
        </h2>

        {/* Buttons Stack */}
        <div style={{
          maxWidth: '400px',
          width: '100%',
          marginTop: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {/* Sign up with Email */}
          <button
            style={{
              height: '56px',
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: hoveredButton === 'email' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none'
            }}
            onMouseEnter={() => handleButtonHover('email')}
            onMouseLeave={handleButtonLeave}
            onClick={() => handleSignUp('Email')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <span style={{
              fontSize: '16px',
              fontWeight: '500',
              color: '#111827'
            }}>
              Sign up with Email
            </span>
          </button>

          {/* Sign up with Google */}
          <button
            disabled={isLoading}
            style={{
              height: '56px',
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: hoveredButton === 'google' && !isLoading ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none',
              opacity: isLoading ? 0.6 : 1
            }}
            onMouseEnter={() => !isLoading && handleButtonHover('google')}
            onMouseLeave={handleButtonLeave}
            onClick={() => !isLoading && handleSignUp('Google')}
          >
            {isLoading ? (
              <div style={{
                width: '20px',
                height: '20px',
                border: '2px solid #E5E7EB',
                borderTop: '2px solid #4285F4',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            <span style={{
              fontSize: '16px',
              fontWeight: '500',
              color: '#111827'
            }}>
              {isLoading ? 'Signing up...' : 'Sign up with Google'}
            </span>
          </button>

          {/* Sign up with Apple */}
          <button
            style={{
              height: '56px',
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: hoveredButton === 'apple' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none'
            }}
            onMouseEnter={() => handleButtonHover('apple')}
            onMouseLeave={handleButtonLeave}
            onClick={() => handleSignUp('Apple')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#111827">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            <span style={{
              fontSize: '16px',
              fontWeight: '500',
              color: '#111827'
            }}>
              Sign up with Apple
            </span>
          </button>
        </div>

        {/* Footer Text */}
        <div style={{
          marginTop: '20px',
          textAlign: 'center',
          fontSize: '14px',
          color: '#6B7280',
          lineHeight: '1.4'
        }}>
          Already have an account?{' '}
          <span
            style={{
              color: '#7c3aed',
              fontWeight: '500',
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
          <p
          style={{
              color: '#000000',
              fontWeight: '500',
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'text-decoration 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
            onClick={handleBackToLanding}>
              <br></br>Back
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default PatientCreateAccount;
