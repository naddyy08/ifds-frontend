🤖 IFDS – Frontend (AI-Powered Inventory Fraud Detection System)

This is the frontend of the AI-Powered Inventory Fraud Detection System (IFDS), designed to provide an interactive and user-friendly interface for managing restaurant inventory and detecting fraudulent activities in real time.

The frontend connects seamlessly with the Flask-based backend API to deliver real-time data visualization, role-based dashboards, and fraud detection insights.

🔗 Live Demo
https://ifds-backend.onrender.com/

🛠️ Tech Stack
🎨 Frontend Development
Framework: React.js
Styling: CSS / Tailwind CSS
State Management: React Hooks
API Integration: Axios / Fetch API
Routing: React Router

☁️ Deployment
Platform: Vercel

✨ Key Features
📊 Dashboard Visualization
Displays inventory insights, stock levels, and fraud detection alerts
📦 Inventory Management Interface
Allows users to view, update, and manage stock items
🔍 Fraud Detection Alerts UI
Highlights suspicious activities detected by the AI system
👥 Role-Based Access Control (RBAC)
Admin – full system control
Manager – monitor inventory & reports
Staff – manage daily stock updates
🔐 Authentication System
Secure login and session handling integrated with backend API
⚙️ Setup Instructions

Clone the repository:
git clone https://github.com/naddyy08/ifds-frontend.git

Navigate to the project folder:
cd ifds-frontend

Install dependencies:
npm install

Create a .env file and configure:
REACT_APP_API_URL=https://ifds-backend.onrender.com/

Run the application locally:
npm start

🔄 System Integration

The frontend communicates with the backend via RESTful APIs to:

Fetch inventory and transaction data
Display AI-based fraud detection results
Handle authentication and user roles
Update stock and generate reports in real time

🖇️ Related Repository
The backend code for this project can be found here: https://github.com/naddyy08/ifds-backend

🧑‍💻 About the Project
This project was developed as part of a Final Year Project (FYP) for an Information Technology program.

The frontend focuses on usability and visualization, ensuring that users can easily:
Monitor inventory activities
Detect anomalies flagged by AI
Make better operational decisions

💡 Note
This project is developed for educational and research purposes only. It demonstrates how modern frontend technologies can be integrated with AI-based backend systems for fraud detection in restaurant inventory management.
