import React from 'react';
import Sidebar from '../sidebar/Sidebar';
import Calendar from './Calendar';
import './CalendarPage.css';

const CalendarPage = () => {
    return (
        <div className="calendar-page">
            <Sidebar />
            <div className="content">
                <div className="header">
                    <img src="/img/logo.png" alt="Logo" className="logo" />
                    <div className="header-text">
                        <h1>Calendário</h1>
                        <p>Domingo — 22 de Agosto de 2021</p>
                    </div>
                </div>
                <Calendar />
            </div>
        </div>
    );
};

export default CalendarPage;
