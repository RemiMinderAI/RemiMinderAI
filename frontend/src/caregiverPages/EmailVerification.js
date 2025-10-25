import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const EmailVerification = () => {
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const userEmail = "john.doe@example.com"; // In a real app, this would come from props or context

  const maskEmail = (email) => {
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 2) return email;
    return `${localPart.substring(0, 2)}***@${domain}`;
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 6) {
      setVerificationCode(value);
    }
  };

  const handleVerify = async () => {
    if (verificationCode.length === 6) {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('Email verified successfully:', { email: userEmail, code: verificationCode });
        navigate('/complete-profile');
      } catch (error) {
        console.error('Verification failed:', error);
        alert('Verification failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleResendCode = () => {
    console.log('Resending verification code to:', userEmail);
    alert('Verification code resent!');
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
            Create Caregiver Account
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
            backgroundColor: '#E9F7EC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto'
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#00B881">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm8 1.5V8h4.5L12 5.5zM6 18h12V8H6v10z"/>
              <path d="M8 12h8v2H8v-2zm0 4h5v2H8v-2z"/>
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
              Verify Your Email
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#6B7280',
              margin: '4px 0 0 0',
              lineHeight: '1.4'
            }}>
              We sent a 6-digit code to {maskEmail(userEmail)}
            </p>
          </div>

          {/* Code Input */}
          <div style={{ marginTop: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '16px',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '8px'
            }}>
              Verification Code
            </label>
            <input
              type="text"
              value={verificationCode}
              onChange={handleCodeChange}
              placeholder="000000"
              maxLength="6"
              style={{
                width: '100%',
                height: '48px',
                backgroundColor: '#F9FAFB',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                padding: '0 12px',
                fontSize: '18px',
                fontFamily: 'monospace',
                fontWeight: '500',
                color: verificationCode ? '#111827' : '#9CA3AF',
                textAlign: 'center',
                letterSpacing: '4px',
                outline: 'none',
                transition: 'border-color 0.2s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#00B881'}
              onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
            />
          </div>

          {/* Verify Button (icon removed) */}
          <button
            disabled={verificationCode.length !== 6 || isLoading}
            style={{
              width: '100%',
              height: '48px',
              backgroundColor: verificationCode.length === 6 && !isLoading ? '#00B881' : '#E5E7EB',
              border: 'none',
              borderRadius: '8px',
              color: verificationCode.length === 6 && !isLoading ? 'white' : '#9CA3AF',
              fontSize: '16px',
              fontWeight: '500',
              cursor: verificationCode.length === 6 && !isLoading ? 'pointer' : 'not-allowed',
              marginTop: '24px',
              transition: 'all 0.2s ease'
            }}
            onClick={handleVerify}
          >
            {isLoading ? 'Verifying...' : 'Verify Email'}
          </button>

          {/* Resend code */}
          <button
            style={{
              background: 'none',
              border: 'none',
              color: '#00B881',
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
          </button>
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
              color: '#00B881',
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

export default EmailVerification;
