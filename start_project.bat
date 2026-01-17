@echo off
echo Starting Novel Project...

:: Start Backend
start "Novel Backend (Port 8000)" cmd /k "cd novel-server && python -m uvicorn main:app --reload"

:: Start Admin Frontend
start "Novel Admin (Port 5173)" cmd /k "cd novel-admin && npm run dev"

:: Start Reader Frontend
start "Novel Reader (Port 3000)" cmd /k "cd novel-reader && npm run dev"

echo All services attempted to start.
echo Backend: http://localhost:8000/docs
echo Admin:   http://localhost:5173
echo Reader:  http://localhost:3000
pause
