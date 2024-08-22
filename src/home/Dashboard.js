import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import './Dashboard.css';
import PatientCard from './PatientCard';
import DentistList from './DentistList';
import PatientTable from '../paciente/PatientTable';
import api from '../config/Axion';

const Dashboard = () => {
    const [dentists, setDentists] = useState([]);
    const [patients, setPatients] = useState([]);

    const fetchDentists = useCallback(async () => {
        try {
            const response = await api.get('/funcionarios'); // Substitua pela URL correta para buscar dentistas
            setDentists(response.data);
        } catch (error) {
            console.error('Erro ao buscar dentistas:', error);
        }
    }, []);

    const fetchRecentPatients = useCallback(async () => {
        try {
            const response = await api.get('/consultas/proximas-cinco'); // Endpoint para buscar as próximas 5 consultas
            setPatients(response.data);
        } catch (error) {
            console.error('Erro ao buscar pacientes:', error);
        }
    }, []);

    useEffect(() => {
        fetchDentists();
        fetchRecentPatients();
    }, [fetchDentists, fetchRecentPatients]);

    return (
        <Container id="dashboard" fluid className="dashboard">
            <Row className="mt-3">
                <Col md={3}>
                    <PatientCard />
                </Col>
                <Col md={3}>
                    <PatientCard />
                </Col>
                <Col md={3}>
                    <PatientCard />
                </Col>
                <Col md={3}>
                    <PatientCard />
                </Col>
            </Row>
            <Row className="mt-3">
                <Col md={8}>
                    <Card className="chart-card">
                        <Card.Body>
                            <div className="chart-placeholder">Gráfico</div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <DentistList dentists={dentists} />
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Card className="table-card">
                        <Card.Body>
                            <PatientTable patients={patients} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;
