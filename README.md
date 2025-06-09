# Ship Maintenance Dashboard

## Overview

A React-based ship maintenance management system built as a frontend solution. This application simulates a complete ship maintenance workflow with no backend dependencies – all data is managed and persisted via localStorage for seamless demonstration.

## Features

- Role-based authentication for Admin, Inspector, and Engineer roles
- Ships Management: create, update, delete, and view detailed ship information
- Components Management: link components to ships with maintenance schedules
- Maintenance Jobs: schedule, track, and update maintenance activities
- Maintenance Calendar with Monthly/Weekly view options
- Real-time Notification Center for job status updates
- KPI Dashboard displaying critical metrics (overdue components, job statistics, fleet size)
- Interactive charts for job status trends and ship activity via Recharts
- Fully responsive design optimized for desktop, tablet, and mobile
- Data persistence using browser localStorage
- CSV report export for maintenance records
- Realistic ship data and smooth user experience

## ⚙️ Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
4. Visit `http://localhost:5173` in your browser

_Requirements: Node.js v14+ and npm_

## 🔑 Demo Accounts

- Admin: admin@entnt.in / admin123
- Inspector: inspector@entnt.in / inspect123
- Engineer: engineer@entnt.in / engine123

## 🧱 Project Structure

- `components/` – Reusable UI components organized by domain (ships, jobs, dashboard)
- `contexts/` – Global state management via React Context API
- `hooks/` – Custom React hooks for shared functionality
- `pages/` – Main application views and routes
- `utils/` – Helper functions for localStorage access and role verification
- `App.jsx` – Application routing and layout structure

## 🔒 Known Limitations

- No backend integration – all data is stored in browser localStorage
- Authentication uses predefined credentials (no registration flow)
- Data resets if browser storage is cleared

## 💡 Technical Decisions

- React functional components with Hooks for modern component architecture
- Context API for lightweight state management instead of Redux
- React Router for navigation between application sections
- TailwindCSS for utility-first styling and responsive design
- Recharts for intuitive data visualization of maintenance metrics
- CSV export functionality using native JavaScript and Blob API

## 📎 Demo Links

- 🔗 Live App: []
- 🔗 GitHub Repo: []
