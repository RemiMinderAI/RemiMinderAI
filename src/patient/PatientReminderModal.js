import React, { useState } from 'react';
import { X } from 'lucide-react';
import styles from './PatientReminderModal.module.css';

const CreateReminderModal = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    title: '',
    reminderType: '',
    time: '',
    frequency: 'Once',
    notes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreate = (e) => {
    e.preventDefault();
    console.log("Creating reminder:", formData);
    onCreate(formData); // Pass data to parent
    onClose(); // Close the modal
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={24} />
        </button>
        <h2 className={styles.modalTitle}>Create New Reminder</h2>
        <p className={styles.modalSubtitle}>Set up a reminder for medications, appointments, or health activities.</p>

        <form onSubmit={handleCreate} className={styles.formBody}>
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Take morning medication"
              className={styles.textInput}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="reminderType" className={styles.label}>Select type *</label>
            <select
              id="reminderType"
              name="reminderType"
              value={formData.reminderType}
              onChange={handleChange}
              className={styles.selectInput}
              required
            >
              <option value="" disabled>Choose a type</option>
              <option value="Medication">Medication</option>
              <option value="Appointment">Appointment</option>
              <option value="Task">Task</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="time" className={styles.label}>Select time *</label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className={styles.textInput}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="frequency" className={styles.label}>Select frequency *</label>
            <select
              id="frequency"
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              className={styles.selectInput}
              required
            >
              <option value="Once">Once</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="notes" className={styles.label}>Additional notes...</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any special instructions or context"
              className={styles.textAreaInput}
              rows="3"
            />
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.createButton}>
              Create Reminder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateReminderModal;
