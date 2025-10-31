import React from "react";
import { useNavigate } from "react-router-dom";

const CaregiverInvite = () => {
  const navigate = useNavigate();

  const handleAcceptInvitation = () => {
    navigate('/create-account');
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom, #F8FBF8, #FFFFFF)',
      paddingTop: '80px',
      fontFamily: 'Inter, SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '0 24px'
      }}>
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          {/* Heart Icon */}
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: '#00B881',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            color: 'white'
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21s-6.716-4.675-9.163-7.122C.93 11.97.5 9.38 2.05 7.83c1.55-1.55 4.07-1.424 5.62.126L12 10.29l4.33-4.33c1.55-1.55 4.07-1.676 5.62-.126 1.55 1.55 1.12 4.14-.787 6.048C18.716 16.325 12 21 12 21z"/>
            </svg>
          </div>
          
          {/* Title */}
          <h1 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#111',
            margin: '0 0 8px 0',
            lineHeight: '1.2'
          }}>
            You've Been Invited!
          </h1>
          
          {/* Subtitle */}
          <p style={{
            fontSize: '16px',
            color: '#555',
            margin: '0',
            lineHeight: '1.4'
          }}>
            Someone wants to share their health information with you
          </p>
        </div>

        {/* Main Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          padding: '32px',
          marginBottom: '24px'
        }}>
          {/* Profile Card */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            {/* Avatar */}
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              backgroundColor: '#E5E7EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#555'
            }}>
              JD
            </div>
            
            {/* Name */}
            <div style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#111',
              marginBottom: '4px'
            }}>
              Jane Doe
            </div>
            
            {/* Subtitle */}
            <div style={{
              fontSize: '16px',
              color: '#555',
              marginBottom: '16px'
            }}>
              has invited you to be their caregiver
            </div>
            
            {/* Quote Box */}
            <div style={{
              border: '1px solid #E5E7EB',
              backgroundColor: '#FAFAFA',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '14px',
              color: '#555',
              lineHeight: '1.5',
              fontStyle: 'italic'
            }}>
              "I'd like to share my health information with you so you can help me stay on top of my appointments and medical care. Thank you for being there for me!"
            </div>
          </div>

          {/* Access Permissions Section */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#111',
              marginBottom: '16px'
            }}>
              As a Caregiver, You'll Have Access To:
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
              {/* Visit Summaries */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', maxWidth: '400px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#E3F2FD',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#4F8EF7',
                  flexShrink: 0
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 2h9l5 5v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm8 1.5V8h4.5" />
                  </svg>
                </div>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#111', marginBottom: '2px' }}>
                    Visit Summaries
                  </div>
                  <div style={{ fontSize: '14px', color: '#555', lineHeight: '1.4' }}>
                    View all recorded healthcare visits and AI-generated summaries
                  </div>
                </div>
              </div>

              {/* Health Information */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', maxWidth: '400px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#F3E8FF',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#7E5BEF',
                  flexShrink: 0
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 5c7 0 10 7 10 7s-3 7-10 7S2 12 2 12s3-7 10-7zm0 3.5A3.5 3.5 0 1 0 12 15a3.5 3.5 0 0 0 0-7z" />
                  </svg>
                </div>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#111', marginBottom: '2px' }}>
                    Health Information
                  </div>
                  <div style={{ fontSize: '14px', color: '#555', lineHeight: '1.4' }}>
                    Access health notes, medications, and medical history
                  </div>
                </div>
              </div>

              {/* Appointments */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', maxWidth: '400px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#E6F7F0',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#30C48D',
                  flexShrink: 0
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 2h2v2h6V2h2v2h3a2 2 0 0 1 2 2v3H2V6a2 2 0 0 1 2-2h3zm15 7v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9h20zm-5 5H7v2h10v-2z" />
                  </svg>
                </div>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#111', marginBottom: '2px' }}>
                    Appointments
                  </div>
                  <div style={{ fontSize: '14px', color: '#555', lineHeight: '1.4' }}>
                    Stay informed about upcoming appointments and reminders
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Role & Responsibilities Box */}
          <div style={{
            backgroundColor: '#E9F7EC',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#D1F2EB',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1EA365',
              flexShrink: 0
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l8 4v6c0 5-3 9-8 10C7 21 4 17 4 12V6l8-4zm0 5a3 3 0 1 0 .001 6.001A3 3 0 0 0 12 7z" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#111', marginBottom: '4px' }}>
                Your Role & Responsibilities
              </div>
              <p style={{
                fontSize: '14px',
                color: '#555',
                lineHeight: '1.4',
                margin: '0'
              }}>
                As a caregiver, you'll have read-only access to the patient's health information. You must respect their privacy and use this information only for caregiving purposes. The patient can revoke your access at any time.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div>
            <button style={{
              width: '100%',
              height: '48px',
              backgroundColor: '#00B881',
              borderRadius: '8px',
              border: 'none',
              color: 'white',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              marginBottom: '16px',
              transition: 'background-color 0.2s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#009A6B'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#00B881'}
            onClick={handleAcceptInvitation}
            >
              Accept Invitation & Create Account
            </button>
            
            <button style={{
              width: '100%',
              height: '48px',
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '1px solid #A3A3A3',
              color: '#333',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#F5F5F5'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
            onClick={handleCancel}
            >
              Decline
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <p style={{
          textAlign: 'center',
          fontSize: '12px',
          color: '#777',
          margin: '1rem',
          lineHeight: '1.4',
        }}>
          By accepting, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default CaregiverInvite;