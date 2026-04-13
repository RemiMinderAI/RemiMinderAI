import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const PatientEmailVerification = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [emailSent, setEmailSent] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email_confirmed_at) {
        setIsVerified(true);
        clearInterval(interval);
      }
    }, 3000);
  
    return () => clearInterval(interval);
  }, []);
  

  useEffect(() => {
    const getUserEmail = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
      }
    };
    getUserEmail();
  }, []);

  const maskEmail = (email) => {
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 2) return email;
    return `${localPart.substring(0, 2)}***@${domain}`;
  };

  const handleContinue = () => {
    // For now, just continue - email verification happens via Supabase email
    navigate('/patient-consent');
  };

  const handleResendCode = async () => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: userEmail,
      });

      if (error) {
        console.error('Error resending verification:', error);
        alert('Error resending verification email. Please try again.');
      } else {
        alert('Verification email sent successfully!');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('An unexpected error occurred.');
    }
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
        {/* Header */}
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
            color: '#6B7280',
            margin: '8px 0 0 0',
            lineHeight: '1.4'
          }}>
            Choose your preferred sign-up method
          </p>
        </div>

        {/* Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.05)',
          width: '420px',
          padding: '40px',
          marginBottom: '32px'
        }}>
          {/* Icon */}
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            backgroundColor: '#F3E8FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto'
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#7c3aed">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>

          {/* Titles */}
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#111827',
              margin: '0',
              lineHeight: '1.2'
            }}>
              Check Your Email
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#6B7280',
              margin: '4px 0 16px 0',
              lineHeight: '1.4'
            }}>
              We sent a verification link to {maskEmail(userEmail)}
            </p>
            <p style={{
              fontSize: '14px',
              color: '#6B7280',
              margin: '0',
              lineHeight: '1.4'
            }}>
              Click the link in the email to verify your account, then come back here to continue.
            </p>
          </div>

          {/* Continue Button */}
          <button
            disabled={!isVerified}
            onClick={handleContinue}
            style={{
              width: '100%',
              height: '48px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: isVerified ? 'pointer' : 'not-allowed',
              backgroundColor: isVerified ? '#7c3aed' : '#d1c4f3',
              color: isVerified ? 'white' : '#ffffffcc',
              marginTop: '24px',
              transition: 'all 0.2s ease'
            }}
          >
            {isVerified ? "Review Consent Agreement" : "Please verify your email first"}
          </button>

          {/* Resend code */}
          {/* <button
            style={{
              background: 'none',
              border: 'none',
              color: '#7c3aed',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              marginTop: '16px',
              textAlign: 'center',
              width: '100%',
              transition: 'text-decoration 0.2s ease'
            }}
            onClick={handleResendCode}
            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
          >
            Resend code
          </button> */}
        </div>

        {/* Footer */}
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
              fontWeight: '500',
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'text-decoration 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
            onClick={() => console.log('Sign in clicked')}
          >
            Sign in
          </span>
        </div>
      </div>
    </div>
  );
};

export default PatientEmailVerification;
