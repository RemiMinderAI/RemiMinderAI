#!/bin/bash

echo "Starting MediMinder servers..."

# Start main backend on port 8000
echo "Starting main backend..."
cd server/main_backend && uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
MAIN_BACKEND_PID=$!

# Start transcription backend on port 8001
echo "Starting transcription backend..."
cd ../ && python server.py &
TRANSCRIPTION_BACKEND_PID=$!

# Start frontend on port 3000
echo "Starting frontend..."
cd ../frontend && npm start &
FRONTEND_PID=$!

echo "All servers started!"
echo "Main backend: http://localhost:8000"
echo "Transcription backend: http://localhost:8001"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for Ctrl+C
trap "echo 'Stopping servers...'; kill $MAIN_BACKEND_PID $TRANSCRIPTION_BACKEND_PID $FRONTEND_PID; exit" INT
wait
