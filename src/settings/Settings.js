import React from 'react';
import { Card } from 'react-bootstrap';
import './Settings.css';
import { useNavigate } from 'react-router-dom';

const settingsOptions = [
    { title: "Cadastro de Funcionários", icon: "briefcase", link: "/employee-list" },
    { title: "Cadastro de Categoria de Consulta", icon: "file-alt", link: "/category-list" }, // Atualizando o link
    { title: "Suporte", icon: "headset", link: "#" },
];

const Settings = () => {
    const navigate = useNavigate();

    const handleCardClick = (link) => {
        navigate(link);
    };

    return (
        <div className="settings">
            {settingsOptions.map((option, index) => (
                <Card
                    key={index}
                    className="settings-card mb-3"
                    onClick={() => handleCardClick(option.link)}
                >
                    <Card.Body className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                            <i className={`fas fa-${option.icon} fa-2x mr-3 settings-option-icon`}></i>
                            <Card.Title className="mb-0">{option.title}</Card.Title>
                        </div>
                        <i className="fas fa-chevron-right fa-2x settings-chevron-icon"></i>
                    </Card.Body>
                </Card>
            ))}
        </div>
    );
};

export default Settings;
