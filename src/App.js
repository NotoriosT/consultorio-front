import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './sidebar/Sidebar';
import HomePage from './home/Home';
import CalendarPage from './calendar/CalendarPage';
import ChatPage from './calendar/Calendar';
import PatientsPage from './paciente/PatientPage';
import SettingsPage from './settings/SettingsPage';
import LoginPage from './login/Login';
import EmployeeList from './settings/employeeList/EmployeeList';
import CategoryList from './settings/consulta/CategoryList';
import AgendaPage from "./calendar/AgendaPage";
import ProtectedRoute from './config/ProtectedRoute'; // Importa o componente de rota protegida
import './App.css';

const App = () => {
    return (
        <Router>
            <div className="app">
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/" element={<LoginPage />} />
                    <Route element={<MainLayout />}>
                        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                        <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
                        <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
                        <Route path="/patients" element={<ProtectedRoute><PatientsPage /></ProtectedRoute>} />
                        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
                        <Route path="/employee-list" element={<ProtectedRoute><EmployeeList /></ProtectedRoute>} />
                        <Route path="/category-list" element={<ProtectedRoute><CategoryList /></ProtectedRoute>} />
                        <Route path="/agenda/:funcionarioId" element={<ProtectedRoute><AgendaPage /></ProtectedRoute>} />
                        <Route path="/logout" element={<LoginPage />} />
                    </Route>
                </Routes>
            </div>
        </Router>
    );
};

const MainLayout = () => (
    <div className="d-flex">
        <Sidebar />
        <div className="main-content flex-grow-1">
            <Routes>
                <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
                <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
                <Route path="/patients" element={<ProtectedRoute><PatientsPage /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
                <Route path="/employee-list" element={<ProtectedRoute><EmployeeList /></ProtectedRoute>} />
                <Route path="/category-list" element={<ProtectedRoute><CategoryList /></ProtectedRoute>} />
                <Route path="/agenda/:funcionarioId" element={<ProtectedRoute><AgendaPage /></ProtectedRoute>} />
                <Route path="/logout" element={<LoginPage />} />
            </Routes>
        </div>
    </div>
);

export default App;
