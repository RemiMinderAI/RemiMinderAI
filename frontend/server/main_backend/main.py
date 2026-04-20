import sys
sys.path.append('..')

from fastapi import FastAPI
from route import invitations, patient_register, caregiver_patient, caregivers, visit_summary, reminders
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# route for caregiver invitation
app.include_router(invitations.router)
# route for patient registration
app.include_router(patient_register.router)
# route to display caregiver_patient linking
app.include_router(caregiver_patient.router)
#route to register caregiver (w/o invitation)
app.include_router(caregivers.router)
# route for visit summaries
app.include_router(visit_summary.router)
# route for reminders
app.include_router(reminders.router)

@app.get("/")
def root():
    return {"message": "Backend running!"}
