import React, { useState } from "react";
import styles from "./SignIn.module.css";
import { useNavigate } from "react-router-dom";
import { FaUser, FaUserFriends } from "react-icons/fa";

const SignIn = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

  const goHome = () => navigate("/");
  const goBackToRole = () => setRole(null);

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = "Email is required.";
    if (!password.trim()) newErrors.password = "Password is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (!validateForm()) return;

    // Placeholder auth logic
    if (role === "patient") {
      navigate("/dashboard/patient");
    } else if (role === "caregiver") {
      navigate("/dashboard/caregiver");
    }
  };

  const handleSignUp = () => {
    navigate(role === "patient" ? "/register/patient" : "/register/caregiver");
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo} onClick={goHome}>
          MediMinder
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.card}>
          <h1 className={styles.title}>Welcome Back</h1>
          {!role ? (
            <>
              <p className={styles.subtitle}>Choose your role to continue</p>

              <div className={styles.formCard}>
                <div className={styles.roleButtons}>
                    <button
                    className={styles.roleButton}
                    onClick={() => setRole("patient")}
                    >
                        <div className={styles.iconBoxPatient}>
                            <FaUser className={styles.icon} />
                        </div>
                        <div>
                            <h1>Patient</h1>
                            <p>Record and track my own visits</p>
                        </div>
                    </button>
                    <button
                    className={styles.roleButton2}
                    onClick={() => setRole("caregiver")}
                    >
                        <div className={styles.iconBoxCaregiver}>
                            <FaUserFriends className={styles.icon} />
                        </div>
                        <div>
                            <h1>Caregiver</h1>
                            <p>Manage care for my loved ones</p>
                        </div>
                    </button>
                    <button
                    className={styles.backButton}
                    onClick={goHome}
                    >
                    Back
                    </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className={styles.subtitle}>
                Sign in to your {role === "patient" ? "Patient" : "Caregiver"} account
              </p>

              <div className={styles.formCard}>
                <form
                    className={styles.form}
                    onSubmit={(e) => {
                    e.preventDefault();
                    handleLogin();
                    }}
                >
                    <h1>Email Address</h1>
                    <div className={styles.inputGroup}>
                    <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`${role === "patient" ? styles.input : styles.input2} ${
                            errors.email ? styles.inputError : ""
                        }`}
                        />
                    {errors.email && (
                        <p className={styles.errorText}>{errors.email}</p>
                    )}
                    </div>
                    <h1>Password</h1>
                    <div className={styles.inputGroup}>
                    <input
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`${role === "patient" ? styles.input : styles.input2} ${
                            errors.password ? styles.inputError : ""
                        }`}
                        />
                    {errors.password && (
                        <p className={styles.errorText}>{errors.password}</p>
                    )}
                    </div>
                    <div
                    className={styles.forgotPassword}
                    onClick={() => navigate("/forgot-password")}
                    >
                    Forgot Password?
                    </div>

                    <button
                    type="submit"
                    className={role === "patient" ? styles.primaryButton : styles.primaryButton2}
                    >
                    Log In
                    </button>

                    {/* <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={handleSignUp}
                    >
                    Sign Up
                    </button> */}
                    
                    <button
                    className={styles.backButton}
                    onClick={goBackToRole}
                    >
                    Back
                    </button>
                </form>
              </div>
            </>
          )}
          <div className={styles.footerNote}>
            Don't have an account?{' '}
            <a href="/register/patient" className={styles.contactLink}>Sign up</a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignIn;
