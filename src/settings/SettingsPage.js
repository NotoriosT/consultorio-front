import React from 'react';
import Sidebar from '../sidebar/Sidebar';
import Settings from './Settings';
import './SettingsPage.css';

const SettingsPage = () => {
    return (
        <div className="settings-page">
            <Sidebar />
            <div className="content">
                <div className="header">
                    <img src="/img/logo.png" alt="Logo" className="logo" />
                    <div className="header-text">
                        <h1>Configurações</h1>
                        <p>Domingo — 22 de Agosto de 2021</p>
                    </div>
                </div>
                <Settings />
            </div>
        </div>
    );
};

export default SettingsPage;
