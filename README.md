# MediMinder

RemiMinderAI is a React-based application that helps healthcare providers record and manage patient visits using audio recording technology. The app features a clean, intuitive interface for recording patient interactions and integrates with a backend API for data storage and processing.

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/malakapn/MediMinder.git
cd MediMinder
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install server dependencies:
```bash
cd ../server
npm install
```

### Key Dependencies

**Frontend Dependencies:**
- React 19.2.0 - UI library
- React Router DOM 7.9.4 - Client-side routing
- Lucide React 0.546.0 - Icon library
- Tailwind CSS - Utility-first CSS framework (built-in with Create React App)

**Server Dependencies:**
- Express 5.1.0 - Web application framework

### Running the Application

1. Start the backend server:
```bash
cd server
node server.js
```
The server will run on http://localhost:3001

2. Start the frontend application:
```bash
cd frontend
npm start
```
The frontend will run on http://localhost:3000

### Features

- **Audio Recording**: Record patient visits with real-time timer display
- **Audio Playback**: Review recorded audio before uploading
- **Responsive Design**: Works on desktop and mobile devices
- **Clean UI**: Modern interface with intuitive controls
- **Backend Integration**: Ready for API integration for data storage

### Usage

1. Navigate to the main page at http://localhost:3000
2. Click on the Record Visit section or navigate to /record
3. Click "Start Recording" to begin recording audio
4. Click "Stop Recording" when finished
5. Play back your recording if needed
6. Upload the recording for processing (backend integration required)
