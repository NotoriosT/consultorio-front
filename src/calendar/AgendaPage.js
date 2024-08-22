import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import api from '../config/Axion';

const AgendaPage = () => {
    const { funcionarioId } = useParams();
    const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedHorario, setSelectedHorario] = useState(null);
    const [pacientes, setPacientes] = useState([]);
    const [procedimentos, setProcedimentos] = useState([]);
    const [selectedPaciente, setSelectedPaciente] = useState('');
    const [selectedProcedimento, setSelectedProcedimento] = useState('');

    const localizer = momentLocalizer(moment);

    const fetchAgenda = useCallback(async () => {
        if (funcionarioId) {
            try {
                const response = await api.get(`/consultas/funcionario/${funcionarioId}`);
                const events = response.data.map(consulta => {
                    const dataHora = `${consulta.data}T${consulta.horario}`;
                    return {
                        start: new Date(dataHora),
                        end: new Date(new Date(dataHora).getTime() + 30 * 60000),
                        title: `Paciente: ${consulta.pacienteNome}, Procedimento: ${consulta.procedimentoNome}`,
                        color: 'red',
                    };
                });
                setHorariosDisponiveis(events);
            } catch (error) {
                console.error('Erro ao buscar agenda:', error);
            }
        }
    }, [funcionarioId]);

    const fetchPacientes = useCallback(async () => {
        try {
            const response = await api.get('/pacientes');
            setPacientes(response.data);
        } catch (error) {
            console.error('Erro ao buscar pacientes:', error);
        }
    }, []);

    const fetchProcedimentos = useCallback(async () => {
        try {
            const response = await api.get('/procedimentos');
            setProcedimentos(response.data);
        } catch (error) {
            console.error('Erro ao buscar procedimentos:', error);
        }
    }, []);

    useEffect(() => {
        fetchAgenda();
        fetchPacientes();
        fetchProcedimentos();
    }, [funcionarioId, fetchAgenda, fetchPacientes, fetchProcedimentos]);

    const handleSelectSlot = (slotInfo) => {
        setSelectedHorario(slotInfo.start);
        setShowModal(true);
    };

    const handleSaveConsulta = async () => {
        try {
            const funcionarioIdNumber = parseInt(funcionarioId, 10);
            const pacienteIdNumber = parseInt(selectedPaciente, 10);
            const procedimentoIdNumber = parseInt(selectedProcedimento, 10);

            const fullDateTime = selectedHorario.toISOString();

            console.log('Dados que serão enviados para marcar consulta:', {
                funcionarioId: funcionarioIdNumber,
                data: fullDateTime,
                pacienteId: pacienteIdNumber,
                procedimentoId: procedimentoIdNumber,
            });

            const response = await api.post('/consultas/marcar', {
                funcionarioId: funcionarioIdNumber,
                data: fullDateTime,
                horario: fullDateTime,
                pacienteId: pacienteIdNumber,
                procedimentoId: procedimentoIdNumber,
            });

            if (response.status === 201) {
                // Atualizar a agenda imediatamente após a marcação bem-sucedida
                setHorariosDisponiveis((prev) => [
                    ...prev,
                    {
                        start: new Date(fullDateTime),
                        end: new Date(new Date(fullDateTime).getTime() + 30 * 60000),
                        title: `Paciente: ${response.data.paciente.nome}, Procedimento: ${response.data.procedimento.nome}`,
                        color: 'red',
                    }
                ]);
                setSelectedPaciente('');
                setSelectedProcedimento('');
            }
            setShowModal(false);
        } catch (error) {
            console.error('Erro ao marcar consulta:', error);
            alert('Não foi possível marcar a consulta. Verifique se o horário já está ocupado.');
        }
    };

    const handleCloseModal = () => {
        setSelectedPaciente('');
        setSelectedProcedimento('');
        setShowModal(false);
    };

    const slotPropGetter = (date) => {
        const isBooked = horariosDisponiveis.some(event =>
            date >= event.start && date < event.end
        );
        return {
            style: {
                backgroundColor: isBooked ? 'red' : undefined,
            },
        };
    };

    return (
        <Container fluid="md" className="agenda-page" style={{ marginTop: '20px', maxWidth: '1200px' }}>
            <Row className="justify-content-md-center">
                <Col md={12} className="text-center">
                    <h2 className="mb-4">Calendário</h2>
                    <Calendar
                        localizer={localizer}
                        events={horariosDisponiveis}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 500 }}
                        step={30}
                        timeslots={1}
                        selectable
                        onSelectSlot={handleSelectSlot}
                        views={['week', 'day']}
                        defaultView={Views.WEEK}
                        slotPropGetter={slotPropGetter}
                        eventPropGetter={(event) => {
                            const backgroundColor = event.color ? event.color : '#3174ad';
                            return { style: { backgroundColor, color: 'white', fontWeight: 'bold' } };
                        }}
                    />
                </Col>
            </Row>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Marcar Consulta</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Selecione o Paciente</Form.Label>
                        <Form.Control
                            as="select"
                            value={selectedPaciente}
                            onChange={(e) => setSelectedPaciente(e.target.value)}
                        >
                            <option value="">Selecione</option>
                            {pacientes.map((paciente) => (
                                <option key={paciente.id} value={paciente.id}>
                                    {paciente.nome}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Selecione o Procedimento</Form.Label>
                        <Form.Control
                            as="select"
                            value={selectedProcedimento}
                            onChange={(e) => setSelectedProcedimento(e.target.value)}
                        >
                            <option value="">Selecione</option>
                            {procedimentos.map((procedimento) => (
                                <option key={procedimento.id} value={procedimento.id}>
                                    {procedimento.nome}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleSaveConsulta}>
                        Marcar Consulta
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default AgendaPage;
