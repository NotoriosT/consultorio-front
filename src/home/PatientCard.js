import React from 'react';
import { Card } from 'react-bootstrap';
import './PatientCard.css';

const PatientCard = () => {
    return (
        <Card className="patient-card" id={"patiend-card"}>
            <Card.Body>
                <Card.Title>Paciente</Card.Title>
                <Card.Text>1050</Card.Text>
            </Card.Body>
        </Card>
    );
};

export default PatientCard;
