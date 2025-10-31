import React, { useState } from "react";
import styles from "./VisitHistory.module.css";
import {
  ArrowLeft,
  Search,
  Filter,
  Download,
  FileText,
  Calendar,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const VisitHistory = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

const visits = [
    {
      id: 1,
      title: "Annual Checkup",
      status: "completed",
      doctor: "Dr. Sarah Johnson",
      specialty: "Primary Care",
      date: "Oct 10, 2025",
      time: "2:30 PM",
      duration: "45 min",
      summary:
        "Routine annual physical examination. All vitals within normal range. Patient reports feeling well with no acute concerns. Blood pressure: 120/80, Heart rate: 72 bpm, Temperature: 98.6°F. Recommended continuing current medication regimen and schedule follow-up in 6 months.",
      keyPoints: [
        "All vitals normal",
        "No new concerns",
        "Continue current medications",
        "Follow-up in 6 months",
      ],
    },
    {
      id: 2,
      title: "Follow-up Visit",
      status: "completed",
      doctor: "Dr. Michael Chen",
      specialty: "Cardiology",
      date: "Oct 5, 2025",
      time: "10:00 AM",
      duration: "30 min",
      summary:
        "Follow-up for previous lab results. Blood pressure under control with current medication. Patient reports no side effects. Cholesterol levels improved since last visit. EKG shows normal sinus rhythm. No changes to treatment plan recommended at this time.",
      keyPoints: [
        "Blood pressure controlled",
        "No medication side effects",
        "Improved cholesterol levels",
        "Continue current treatment",
      ],
    },
    {
      id: 3,
      title: "Lab Results Review",
      status: "completed",
      doctor: "Dr. Sarah Johnson",
      specialty: "Primary Care",
      date: "Sep 28, 2025",
      time: "3:15 PM",
      duration: "20 min",
      summary:
        "Reviewed comprehensive metabolic panel. All values within normal limits. Kidney function excellent. Liver enzymes normal. Blood glucose levels stable. No action required at this time. Patient advised to continue healthy diet and exercise routine.",
      keyPoints: [
        "All lab values normal",
        "Kidney function excellent",
        "Blood glucose stable",
        "Continue current lifestyle",
      ],
    },
    {
      id: 4,
      title: "Dental Checkup",
      status: "completed",
      doctor: "Dr. Emily Williams",
      specialty: "Dentistry",
      date: "Sep 15, 2025",
      time: "11:30 AM",
      duration: "60 min",
      summary:
        "Routine dental examination and cleaning. No cavities detected. Gums healthy with minimal bleeding. Patient maintains good oral hygiene. Recommended continuing twice-daily brushing and daily flossing. Next cleaning scheduled in 6 months.",
      keyPoints: [
        "No cavities",
        "Healthy gums",
        "Good oral hygiene",
        "Next visit in 6 months",
      ],
    },
    {
      id: 5,
      title: "Eye Examination",
      status: "completed",
      doctor: "Dr. Robert Martinez",
      specialty: "Ophthalmology",
      date: "Aug 20, 2025",
      time: "9:00 AM",
      duration: "40 min",
      summary:
        "Comprehensive eye exam. Vision stable since last year. No signs of glaucoma or cataracts. Retinal examination normal. Prescription updated slightly for reading glasses. Patient advised to return in 12 months for routine follow-up.",
      keyPoints: [
        "Vision stable",
        "No eye diseases detected",
        "Updated reading prescription",
        "Annual follow-up recommended",
      ],
    },
  ];

  const filteredVisits = visits.filter((visit) => {
    const search = searchTerm.toLowerCase();
    return (
      visit.title.toLowerCase().includes(search) ||
      visit.doctor.toLowerCase().includes(search) ||
      visit.specialty.toLowerCase().includes(search)
    );
  });

  return (
    <div className={styles.container}>
      {/* ===== Header ===== */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
            <div className={styles.headerLeft}>
                <button
                className={styles.backButton}
                onClick={() => navigate("/patient-dashboard")}
                >
                    <ArrowLeft size={18} />
                </button>
                <div className={styles.headerText}>
                    <h1 className={styles.headerTextTitle}>Visit History</h1>
                    <p className={styles.headerTextSubtitle}>View all past healthcare visits and summaries</p>
                </div>
            </div>
            <button className={styles.exportButton}>
                <Download size={14} />
                Export All
            </button>
        </div>
    </header>

      <div className={styles.content}>
        {/* ===== Search & Filter ===== */}
        <div className={styles.sectionHeader}>
          <h2>Search & Filter</h2>
          <p>Find specific visits or doctors</p>
        </div>

        <div className={styles.searchFilterSection}>
          <div className={styles.searchBar}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by visit type, doctor, or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className={styles.filterButton}>
              <Filter size={16} />
              Filter
            </button>
          </div>
        </div>

        {/* ===== Summary Statistics ===== */}
        <div className={styles.sectionHeader}>
          <h2>Summary Statistics</h2>
          <p>Overview of your healthcare visits</p>
        </div>

        <div className={styles.statsGrid}>
        <div className={styles.statCard}>
            <div className={styles.statContent}>
            <div>
                <div className={styles.statTitle}>Total Visits</div>
                <div className={styles.statValue}>{visits.length}</div>
            </div>
            <div className={`${styles.iconBox} ${styles.iconBlue}`}>
                <FileText size={20} />
            </div>
            </div>
        </div>

        <div className={styles.statCard}>
            <div className={styles.statContent}>
            <div>
                <div className={styles.statTitle}>This Month</div>
                <div className={styles.statValue}>3</div>
            </div>
            <div className={`${styles.iconBox} ${styles.iconGreen}`}>
                <Calendar size={20} />
            </div>
            </div>
        </div>

        <div className={styles.statCard}>
            <div className={styles.statContent}>
            <div>
                <div className={styles.statTitle}>Avg. Duration</div>
                <div className={styles.statValue}>39 min</div>
            </div>
            <div className={`${styles.iconBox} ${styles.iconPurple}`}>
                <Clock size={20} />
            </div>
            </div>
        </div>
        </div>

        {/* ===== All Visits ===== */}
        <div className={styles.sectionHeader}>
          <h2>All Visits</h2>
          <p>Complete history of healthcare visits</p>
        </div>

        <div className={styles.visitList}>
          {filteredVisits.length > 0 ? (
            filteredVisits.map((visit) => (
                <div key={visit.id} className={styles.visitCard}>
                <div className={styles.visitHeader}>
                  <div className={styles.visitInfoWrapper}>
                    {/* Purple file icon on the left */}
                    <div className={styles.visitIcon}>
                      <FileText size={20} />
                    </div>
              
                    <div className={styles.visitInfo}>
                    <h3 className={styles.titleRow}>
                      {visit.title}{" "}
                      <span className={styles.statusBadge}>{visit.status}</span>
                    </h3>
                      <p className={styles.doctor}>
                        {visit.doctor} • {visit.specialty}
                      </p>
                      <p className={styles.date}>
                        <Calendar size={13} /> {visit.date} • <Clock size={13} /> {visit.time} • {visit.duration}
                      </p>
                    </div>
                  </div>
              
                  <button className={styles.downloadButton}>
                    <Download size={14} />
                    Download
                  </button>
                </div>
              
                <div className={styles.summaryBox}>
                  <h4>Visit Summary</h4>
                  <p>{visit.summary}</p>
                </div>
              
                <div className={styles.keyPointsBox}>
                  <h4>Key Points</h4>
                  <ul>
                    {visit.keyPoints.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>              
            ))
          ) : (
            <div className={styles.noResults}>No visits found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisitHistory;
