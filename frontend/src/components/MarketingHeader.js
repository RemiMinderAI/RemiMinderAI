import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import styles from "./LandingPage.module.css";
import logo from "../assets/RemiMinder_logo_512.png";
import { useMailingList } from "../context/MailingListContext";

/**
 * Shared marketing site header: desktop nav + mobile hamburger.
 * Used on Landing, Pricing, and About.
 */
export default function MarketingHeader({
  scrolled,
  headerExtraClass = "",
  showMailingList = true,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { open: openMailingList } = useMailingList();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const isHome = location.pathname === "/" || location.pathname === "";

  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setMobileNavOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileNavOpen]);

  useEffect(() => {
    const onResize = () => {
      if (typeof window !== "undefined" && window.innerWidth >= 900) {
        setMobileNavOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const closeMenu = () => setMobileNavOpen(false);

  const navClass = ({ isActive }) =>
    `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`;

  const demoClick = (e) => {
    if (isHome) {
      e.preventDefault();
      document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });
    }
    closeMenu();
  };

  const hiwClick = (e) => {
    if (isHome) {
      e.preventDefault();
      document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
    }
    closeMenu();
  };

  return (
    <header
      className={`${styles.header} ${headerExtraClass} ${
        scrolled ? styles.headerScrolled : ""
      }`}
    >
      <div className={styles.headerBar}>
        <div
          className={styles.logo}
          onClick={() => {
            navigate("/");
            closeMenu();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              navigate("/");
              closeMenu();
            }
          }}
          role="button"
          tabIndex={0}
        >
          <img src={logo} alt="RemiMinder Logo" className={styles.logoImg} />
          <span className={styles.logoText}>
            RemiMinder<span className={styles.logoAi}>AI</span>
          </span>
        </div>

        <nav className={`${styles.nav} ${styles.navDesktop}`} aria-label="Main">
          <NavLink to="/" end className={navClass}>
            Home
          </NavLink>
          <a
            href="/#demo"
            className={styles.navLink}
            onClick={demoClick}
          >
            Demo
          </a>
          <a
            href="/#how-it-works"
            className={styles.navLink}
            onClick={hiwClick}
          >
            How It Works
          </a>
          <NavLink to="/pricing" className={navClass}>
            Pricing
          </NavLink>
          <NavLink to="/about" className={navClass}>
            About
          </NavLink>
          <NavLink to="/support" className={navClass}>
            Support
          </NavLink>
        </nav>

        {showMailingList && (
          <button
            type="button"
            onClick={() => openMailingList({ source: "header" })}
            className={`${styles.mailingListButton} ${styles.mailingListDesktop}`}
          >
            Join Mailing List
          </button>
        )}

        <button
          type="button"
          className={styles.hamburgerButton}
          onClick={() => setMobileNavOpen((o) => !o)}
          aria-expanded={mobileNavOpen}
          aria-controls="primary-mobile-nav"
          aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
        >
          {mobileNavOpen ? (
            <X size={26} color="#1A2B3C" strokeWidth={2} aria-hidden="true" />
          ) : (
            <Menu size={26} color="#1A2B3C" strokeWidth={2} aria-hidden="true" />
          )}
        </button>
      </div>

      {mobileNavOpen && (
        <div
          className={styles.mobileNavBackdrop}
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {mobileNavOpen && (
        <div
          id="primary-mobile-nav"
          className={styles.mobileNavPanel}
          role="navigation"
          aria-label="Main"
        >
          <div className={styles.mobileNavStack}>
            <NavLink to="/" end className={navClass} onClick={closeMenu}>
              Home
            </NavLink>
            <a href="/#demo" className={styles.navLink} onClick={demoClick}>
              Demo
            </a>
            <a
              href="/#how-it-works"
              className={styles.navLink}
              onClick={hiwClick}
            >
              How It Works
            </a>
            <NavLink to="/pricing" className={navClass} onClick={closeMenu}>
              Pricing
            </NavLink>
            <NavLink to="/about" className={navClass} onClick={closeMenu}>
              About
            </NavLink>
            <NavLink to="/support" className={navClass} onClick={closeMenu}>
              Support
            </NavLink>
          </div>
          {showMailingList && (
            <button
              type="button"
              onClick={() => {
                openMailingList({ source: "header" });
                closeMenu();
              }}
              className={styles.mobileNavCta}
            >
              Join Mailing List
            </button>
          )}
        </div>
      )}
    </header>
  );
}
