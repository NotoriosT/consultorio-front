import React from 'react';
import Sidebar from '../sidebar/Sidebar';
import PatientList from './PatientList';
import './PatientPage.css';

const PatientPage = () => {
    return (
        <div className="patient-page">
            <Sidebar />
            <div className="content">
                <div className="header">
                    <img src="/img/logo.png" alt="Logo" className="logo" />
                    <h1>Pacientes</h1>
                    <p>Domingo — 22 de Agosto de 2021</p>
                </div>
                <PatientList />
            </div>
        </div>
    );
};

export default PatientPage;
