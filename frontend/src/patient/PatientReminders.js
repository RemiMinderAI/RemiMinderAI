import React, { useState } from 'react';
import { Plus, Trash2, Calendar, Activity, Pill, Link as LinkIcon, FileText, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './PatientReminders.module.css';
import CreateReminderModal from './PatientReminderModal';

const mockActiveReminders = [
  { id: 2, type: 'Exercise', title: 'Morning Walk', time: '6:30 AM', frequency: 'Daily', details: '30 minutes', next: 'Tomorrow at 6:30 AM', enabled: true },
  { id: 3, type: 'Lab', title: 'Fasting Lab Work', time: '8:00 AM', frequency: 'Once', details: 'No food 12 hours prior', next: 'Nov 2, 2025 at 8:00 AM', enabled: true },
];
const mockDisabledReminders = [
  { id: 4, type: 'Medication', title: 'Take Blood Pressure Medication', time: '8:00 AM', frequency: 'Daily', enabled: false },
  { id: 1, type: 'Appointment', title: 'Annual Physical Exam', time: '10:00 AM', frequency: 'Once', details: 'Dr. Sarah Johnson', enabled: false },
  { id: 5, type: 'Medication', title: 'Take Vitamin D', time: '12:00 PM', frequency: 'Daily', enabled: false },
];

const RemindersListPage = () => {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeReminders, setActiveReminders] = useState(mockActiveReminders);
  const [disabledReminders, setDisabledReminders] = useState(mockDisabledReminders);

  const totalReminders = activeReminders.length + disabledReminders.length;
  const activeCount = activeReminders.length;
  const disabledCount = disabledReminders.length;

  // Handler for creating a new reminder (User Story 1)
  const handleCreateReminder = (formData) => {
    console.log('New reminder to be created (call API here):', formData);
    const newReminder = {
      id: Math.random(),
      ...formData,
      enabled: true,
      next: `Today at ${formData.time}`
    };
    setActiveReminders([newReminder, ...activeReminders]);
  };

  // Handler for editing (toggling) a reminder (User Story 2)
  const handleToggle = (id, listType) => {
    console.log(`Toggle reminder ${id} from ${listType}`);
    
    if (listType === 'active') {
      const reminderToMove = activeReminders.find(r => r.id === id);
      if (reminderToMove) {
        setActiveReminders(activeReminders.filter(r => r.id !== id));
        setDisabledReminders([{ ...reminderToMove, enabled: false }, ...disabledReminders]);
      }
    } else {
      const reminderToMove = disabledReminders.find(r => r.id === id);
      if (reminderToMove) {
        setDisabledReminders(disabledReminders.filter(r => r.id !== id));
        setActiveReminders([{ ...reminderToMove, enabled: true }, ...activeReminders]);
      }
    }
  };

  const handleDelete = (id, listType) => {
     console.log(`Delete reminder ${id} from ${listType}`);

     if (listType === 'active') {
        setActiveReminders(activeReminders.filter(r => r.id !== id));
     } else {
        setDisabledReminders(disabledReminders.filter(r => r.id !== id));
     }
  };

  // Helper functions for UI
  const getIcon = (type) => {
    switch(type) {
      case 'Appointment': return <Calendar size={18} className={styles.iconAppointment} />;
      case 'Exercise': return <Activity size={18} className={styles.iconExercise} />;
      case 'Medication': return <Pill size={18} className={styles.iconMedication} />;
      case 'Lab': return <FileText size={18} className={styles.iconLab} />;
      default: return <LinkIcon size={18} className={styles.iconDisabled} />;
    }
  };

  const getTagColor = (type) => {
    switch(type) {
      case 'Appointment': return styles.tagPurple;
      case 'Exercise': return styles.tagGreen;
      case 'Medication': return styles.tagBlue;
      case 'Lab': return styles.tagOrange;
      default: return styles.tagGray;
    }
  }

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backButton} onClick={() => navigate('/patient-dashboard')}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className={styles.headerTitle}>Reminders</h1>
            <p className={styles.headerSubtitle}>Manage your health reminders and notifications</p>
          </div>
        </div>
        <button className={styles.newReminderButton} onClick={() => setShowCreateModal(true)}>
          <Plus size={16} /> New Reminder
        </button>
      </header>

      {/* Overview */}
      <section className={styles.overviewSection}>
        <h2 className={styles.sectionTitle}>Overview</h2>
        <p className={styles.sectionSubtitle}>Quick snapshot of your reminders</p>
        <div className={styles.overviewBox}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{totalReminders}</span>
            <span className={styles.statLabel}>Total Reminders</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{activeCount}</span>
            <span className={styles.statLabel}>Active</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{disabledCount}</span>
            <span className={styles.statLabel}>Disabled</span>
          </div>
        </div>
      </section>

      {/* Active Reminders */}
      <section className={styles.remindersSection}>
        <h2 className={styles.sectionTitle}>Active Reminders</h2>
        {activeReminders.map(reminder => (
          <div key={reminder.id} className={styles.reminderCard}>
            <div className={styles.reminderIcon}>{getIcon(reminder.type)}</div>
            <div className={styles.reminderContent}>
              <div className={styles.reminderHeader}>
                <span className={styles.reminderTitle}>{reminder.title}</span>
                <span className={`${styles.reminderTag} ${getTagColor(reminder.type)}`}>{reminder.type}</span>
              </div>
              <p className={styles.reminderDetails}>{reminder.time} • {reminder.frequency}</p>
              {reminder.details && <p className={styles.reminderDetails}>{reminder.details}</p>}
              <p className={styles.reminderNext}>Next: {reminder.next}</p>
            </div>
            <div className={styles.reminderActions}>
              <label className={styles.toggleSwitch}>
                <input type="checkbox" checked={reminder.enabled} onChange={() => handleToggle(reminder.id, 'active')} />
                <span className={styles.slider}></span>
              </label>
              <button className={styles.deleteButton} onClick={() => handleDelete(reminder.id, 'active')}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Disabled Reminders */}
      <section className={styles.remindersSection}>
        <h2 className={styles.sectionTitle}>Disabled Reminders</h2>
         {disabledReminders.map(reminder => (
          <div key={reminder.id} className={`${styles.reminderCard} ${styles.disabledCard}`}>
             <div className={styles.reminderIcon}>{getIcon(reminder.type)}</div>
            <div className={styles.reminderContent}>
              <div className={styles.reminderHeader}>
                <span className={styles.reminderTitle}>{reminder.title}</span>
                <span className={`${styles.reminderTag} ${getTagColor(reminder.type)}`}>{reminder.type}</span>
              </div>
              <p className={styles.reminderDetails}>{reminder.time} • {reminder.frequency}</p>
               <p className={styles.reminderNext}>Disabled</p>
            </div>
            <div className={styles.reminderActions}>
              <label className={styles.toggleSwitch}>
                <input type="checkbox" checked={reminder.enabled} onChange={() => handleToggle(reminder.id, 'disabled')} />
                <span className={styles.slider}></span>
              </label>
              <button className={styles.deleteButton} onClick={() => handleDelete(reminder.id, 'disabled')}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Modal is rendered here */}
      {showCreateModal && 
        <CreateReminderModal 
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateReminder}
        />
      }
    </div>
  );
};

export default RemindersListPage;
