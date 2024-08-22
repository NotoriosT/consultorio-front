import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import PatientTable from '../paciente/PatientTable';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import './Calendar.css';
import api from '../config/Axion';

const Calendar = () => {
    const [patients, setPatients] = useState([]);
    const [funcionarios, setFuncionarios] = useState([]);
    const [funcionarioId, setFuncionarioId] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const navigate = useNavigate();

    const fetchFuncionarios = useCallback(async () => {
        try {
            const response = await api.get('/funcionarios');
            setFuncionarios(response.data);
        } catch (error) {
            console.error('Erro ao buscar funcionários:', error);
        }
    }, []);

    const fetchConsultasProximas = useCallback(async () => {
        if (funcionarioId) {
            try {
                const response = await api.get(`/consultas/proximas`, {
                    params: { funcionarioId },
                });

                console.log('Resposta do backend:', response.data);

                const formattedPatients = response.data.map(consulta => {
                    const dateTimeString = `${consulta.data}T${consulta.horario}`; // Concatenar data e horário

                    // Verifica se o dateTimeString é válido
                    if (dateTimeString && !isNaN(new Date(dateTimeString).getTime())) {
                        try {
                            return {
                                ...consulta,
                                horario: format(parseISO(dateTimeString), 'HH:mm', { locale: ptBR }) // Formato de 24 horas
                            };
                        } catch (error) {
                            console.error('Erro ao formatar o horário:', error);
                            return {
                                ...consulta,
                                horario: 'Horário inválido'
                            };
                        }
                    } else {
                        console.warn(`Horário inválido encontrado para a consulta do paciente ${consulta.pacienteNome}`);
                        return {
                            ...consulta,
                            horario: 'Horário inválido'
                        };
                    }
                });

                setPatients(formattedPatients);
            } catch (error) {
                console.error('Erro ao buscar consultas próximas:', error);
            }
        }
    }, [funcionarioId]);


    useEffect(() => {
        fetchFuncionarios();
    }, [fetchFuncionarios]);

    useEffect(() => {
        fetchConsultasProximas();
    }, [funcionarioId, fetchConsultasProximas]);

    const handleFuncionarioChange = (e) => setFuncionarioId(e.target.value);

    const handleAbrirAgenda = () => {
        if (funcionarioId) {
            navigate(`/agenda/${funcionarioId}`);
        } else {
            alert('Selecione um funcionário para abrir a agenda.');
        }
    };

    const indexOfLastPatient = currentPage * itemsPerPage;
    const indexOfFirstPatient = indexOfLastPatient - itemsPerPage;
    const currentPatients = patients.slice(indexOfFirstPatient, indexOfLastPatient);

    const nextPage = () => setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(patients.length / itemsPerPage)));
    const prevPage = () => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));

    return (
        <Container className="calendar-container">
            <h2 className="calendar-title">Calendário</h2>
            <Form className="calendar-form">
                <Row>
                    <Col md={6}>
                        <Form.Group controlId="formFuncionario">
                            <Form.Label>Funcionário</Form.Label>
                            <Form.Select aria-label="Funcionário" value={funcionarioId} onChange={handleFuncionarioChange}>
                                <option value="">Selecione o Funcionário</option>
                                {funcionarios.map((funcionario) => (
                                    <option key={funcionario.id} value={funcionario.id}>{funcionario.nome}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Button variant="primary" className="action-button" onClick={handleAbrirAgenda}>+ Abrir Agenda</Button>
                    </Col>
                    <Col md={3}>
                        <Button variant="primary" className="action-button">+ Agendar Consulta</Button>
                    </Col>
                </Row>
            </Form>
            <PatientTable patients={currentPatients} />
            <div className="pagination-container">
                <Button
                    className="pagination-button"
                    onClick={prevPage}
                    disabled={currentPage === 1}
                >
                    Anterior
                </Button>
                <Button
                    className="pagination-button"
                    onClick={nextPage}
                    disabled={indexOfLastPatient >= patients.length}
                >
                    Próximo
                </Button>
            </div>
        </Container>
    );
};

export default Calendar;
