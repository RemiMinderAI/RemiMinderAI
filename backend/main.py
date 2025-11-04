from fastapi import FastAPI
from route import invitations, patient_register
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

@app.get("/")
def root():
    return {"message": "Backend running!"}