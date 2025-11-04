🏥 MediMinder Backend (FastAPI)

This is the Fast API backend service for the MediMinder application.
It provides RESTful APIs for managing patient–caregiver invitations, user authentication, and other backend services.
_____________________________________________________________________________________________________

⚙️ Prerequisites

Before running this backend, make sure you have:
•	pip (Python package manager)
•	Supabase Project (with your SUPABASE_URL and SUPABASE_KEY)
•	Google App Password (for sending emails)
•	Virtual environment (recommended)
_____________________________________________________________________________________________________

🧩 Installation

1️ Clone the Repository
git clone https://github.com/<your-username>/MediMinder.git
cd MediMinder/backend

2️ Create a Virtual Environment
python -m venv venv
source venv/bin/activate    # On Mac/Linux
venv\Scripts\activate       # On Windows

3️ Install Dependencies

pip install -r requirements.txt

4️ Set Environment Variables

Create a .env file in the backend/ directory:

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_google_app_password
________________________________________________________________________________________________________

🚀 Running the Server

To start the FastAPI backend locally:
uvicorn main:app --reload

- FastAPI runs on: http://127.0.0.1:8000
- Swagger UI: http://127.0.0.1:8000/docs