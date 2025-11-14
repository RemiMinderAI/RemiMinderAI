import React, { useState, useEffect } from "react";
import styles from "./VisitHistory.module.css";
import {
  ArrowLeft,
  Search,
  Filter,
  Download,
  FileText,
  Calendar,
  Clock,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const VisitHistory = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisitHistory = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) {
          setLoading(false);
          return;
        }

        const response = await fetch(`http://127.0.0.1:8000/api/visit-summaries?user_id=${session.user.id}`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setVisits(data);
        } else {
          console.error('Failed to fetch visit history');
        }
      } catch (error) {
        console.error('Error fetching visit history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVisitHistory();
  }, []);

  const filteredVisits = visits.filter((visit) => {
    const search = searchTerm.toLowerCase();
    return (
      visit.title.toLowerCase().includes(search) ||
      visit.doctor.toLowerCase().includes(search) ||
      visit.specialty.toLowerCase().includes(search)
    );
  });

  const handleDeleteVisit = async (visitId) => {
    if (!window.confirm('Are you sure you want to delete this visit? This action cannot be undone.')) {
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        alert('You must be logged in to delete visits');
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000/api/visit-summaries/${visitId}?user_id=${session.user.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        // Remove the visit from the local state
        setVisits(visits.filter(visit => visit.id !== visitId));
        alert('Visit deleted successfully');
      } else {
        const error = await response.json();
        alert(`Failed to delete visit: ${error.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting visit:', error);
      alert('Error deleting visit. Please try again.');
    }
  };

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
                <div className={styles.statValue}>0</div>
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
                <div className={styles.statValue}>0 min</div>
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
              
                  <div className={styles.actionButtons}>
                    <button className={styles.downloadButton}>
                      <Download size={14} />
                      Download
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeleteVisit(visit.id)}
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
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
