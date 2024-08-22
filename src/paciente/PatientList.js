import React, { useState, useEffect } from 'react';
import { Table, Button, InputGroup, FormControl, Modal, Form } from 'react-bootstrap';
import './PatientList.css';
import api from '../config/Axion';

const patientsPerPage = 10;

const PatientList = () => {
    const [patients, setPatients] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [formStep, setFormStep] = useState(1);
    const [newPatient, setNewPatient] = useState({
        nome: '', cpf: '', celular: '', email: '', data: '', genero: '', observacoes: '', endereco: '', cidade: '', estado: ''
    });

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const response = await api.get('/pacientes');
            setPatients(response.data);
        } catch (error) {
            console.error('Erro ao buscar pacientes:', error);
        }
    };

    const indexOfLastPatient = currentPage * patientsPerPage;
    const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
    const currentPatients = patients.slice(indexOfFirstPatient, indexOfLastPatient);

    const nextPage = () => {
        if (indexOfLastPatient < patients.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false);
        setFormStep(1);
    };

    const nextStep = () => setFormStep(prev => Math.min(prev + 1, 5));
    const prevStep = () => setFormStep(prev => Math.max(prev - 1, 1));

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewPatient(prev => ({ ...prev, [name]: value }));
    };

    const formatCPF = (cpf) => {
        // Remove qualquer caractere que não seja número
        return cpf.replace(/\D/g, '');
    };

    const formatCelular = (celular) => {
        // Remove qualquer caractere que não seja número
        return celular.replace(/\D/g, '');
    };

    const validateAndFormatData = () => {
        const formattedCPF = formatCPF(newPatient.cpf);
        const formattedCelular = formatCelular(newPatient.celular);
        setNewPatient(prev => ({
            ...prev,
            cpf: formattedCPF,
            celular: formattedCelular
        }));
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Os meses são indexados em 0
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleSubmit = async () => {
        try {
            validateAndFormatData();

            const formattedPatient = {
                ...newPatient,
                data: newPatient.data.trim() // Garante que a data esteja no formato correto
            };

            const response = await api.post('/pacientes', formattedPatient);
            setPatients(prevPatients => [...prevPatients, response.data]); // Adiciona o novo paciente à lista
            handleCloseModal();
        } catch (error) {
            console.error('Erro ao cadastrar paciente:', error);
        }
    };

    return (
        <div className="patient-list">
            <div className="header">
                <h2>Pacientes</h2>
                <Button variant="primary" className="add-patient-button" onClick={handleShowModal}>
                    + Add Paciente
                </Button>
            </div>
            <InputGroup className="mb-3 search-bar">
                <FormControl placeholder="Pesquisar" aria-label="Pesquisar" aria-describedby="basic-addon1" />
                <InputGroup.Text id="basic-addon1" className="search-icon"><i className="fas fa-search"></i></InputGroup.Text>
            </InputGroup>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Nome</th>
                    <th>CPF</th>
                    <th>Celular</th>
                    <th>E-mail</th>
                    <th>Data de Nascimento</th>
                    <th>Gênero</th>
                </tr>
                </thead>
                <tbody>
                {currentPatients.map((patient, index) => (
                    <tr key={index}>
                        <td>{patient.nome}</td>
                        <td>{patient.cpf}</td>
                        <td>{patient.celular}</td>
                        <td>{patient.email}</td>
                        <td>{formatDate(patient.data)}</td>
                        <td>{patient.genero}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
            <div className="pagination">
                <Button onClick={prevPage} disabled={currentPage === 1}>Página Anterior</Button>
                <Button onClick={nextPage} disabled={indexOfLastPatient >= patients.length}>Próxima Página</Button>
            </div>

            <Modal show={showModal} onHide={handleCloseModal} className="modal-fixed-size">
                <Modal.Header closeButton>
                    <Modal.Title>Cadastrar Paciente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {formStep === 1 && (
                            <>
                                <h5>Dados Básicos</h5>
                                <Form.Group controlId="formNome">
                                    <Form.Label>Nome</Form.Label>
                                    <Form.Control type="text" name="nome" value={newPatient.nome} onChange={handleChange} required />
                                </Form.Group>
                                <Form.Group controlId="formCpf">
                                    <Form.Label>CPF</Form.Label>
                                    <Form.Control type="text" name="cpf" value={newPatient.cpf} onChange={handleChange} required pattern="\d{11}" />
                                </Form.Group>
                                <Form.Group controlId="formCelular">
                                    <Form.Label>Celular</Form.Label>
                                    <Form.Control type="text" name="celular" value={newPatient.celular} onChange={handleChange} required pattern="\d{10,11}" />
                                </Form.Group>
                            </>
                        )}
                        {formStep === 2 && (
                            <>
                                <h5>Contato</h5>
                                <Form.Group controlId="formEmail">
                                    <Form.Label>E-mail</Form.Label>
                                    <Form.Control type="email" name="email" value={newPatient.email} onChange={handleChange} required />
                                </Form.Group>
                                <Form.Group controlId="formData">
                                    <Form.Label>Data de Nascimento</Form.Label>
                                    <Form.Control type="date" name="data" value={newPatient.data} onChange={handleChange} required />
                                </Form.Group>
                                <Form.Group controlId="formGenero">
                                    <Form.Label>Gênero</Form.Label>
                                    <Form.Control as="select" name="genero" value={newPatient.genero} onChange={handleChange} required>
                                        <option value="">Selecione</option>
                                        <option value="MASCULINO">Masculino</option>
                                        <option value="FEMININO">Feminino</option>
                                        <option value="OUTRO">Outro</option>
                                    </Form.Control>
                                </Form.Group>
                            </>
                        )}
                        {formStep === 3 && (
                            <>
                                <h5>Observações</h5>
                                <Form.Group controlId="formObservacoes">
                                    <Form.Label>Observações</Form.Label>
                                    <Form.Control as="textarea" rows={3} name="observacoes" value={newPatient.observacoes} onChange={handleChange} />
                                </Form.Group>
                            </>
                        )}
                        {formStep === 4 && (
                            <>
                                <h5>Localidade</h5>
                                <Form.Group controlId="formEndereco">
                                    <Form.Label>Endereço</Form.Label>
                                    <Form.Control type="text" name="endereco" value={newPatient.endereco} onChange={handleChange} required />
                                </Form.Group>
                                <Form.Group controlId="formCidade">
                                    <Form.Label>Cidade</Form.Label>
                                    <Form.Control type="text" name="cidade" value={newPatient.cidade} onChange={handleChange} required />
                                </Form.Group>
                                <Form.Group controlId="formEstado">
                                    <Form.Label>Estado</Form.Label>
                                    <Form.Control as="select" name="estado" value={newPatient.estado} onChange={handleChange} required>
                                        <option value="">Selecione</option>
                                        <option value="AC">AC</option>
                                        <option value="AL">AL</option>
                                        <option value="AP">AP</option>
                                        <option value="AM">AM</option>
                                        <option value="BA">BA</option>
                                        <option value="CE">CE</option>
                                        <option value="DF">DF</option>
                                        <option value="ES">ES</option>
                                        <option value="GO">GO</option>
                                        <option value="MA">MA</option>
                                        <option value="MT">MT</option>
                                        <option value="MS">MS</option>
                                        <option value="MG">MG</option>
                                        <option value="PA">PA</option>
                                        <option value="PB">PB</option>
                                        <option value="PR">PR</option>
                                        <option value="PE">PE</option>
                                        <option value="PI">PI</option>
                                        <option value="RJ">RJ</option>
                                        <option value="RN">RN</option>
                                        <option value="RS">RS</option>
                                        <option value="RO">RO</option>
                                        <option value="RR">RR</option>
                                        <option value="SC">SC</option>
                                        <option value="SP">SP</option>
                                        <option value="SE">SE</option>
                                        <option value="TO">TO</option>
                                    </Form.Control>
                                </Form.Group>
                            </>
                        )}
                        {formStep === 5 && (
                            <div className="confirmation-step">
                                <h5>Confirme os Dados</h5>
                                <div className="confirmation-details">
                                    <div>
                                        <span>Nome:</span> {newPatient.nome}
                                    </div>
                                    <div>
                                        <span>CPF:</span> {newPatient.cpf}
                                    </div>
                                    <div>
                                        <span>Celular:</span> {newPatient.celular}
                                    </div>
                                    <div>
                                        <span>E-mail:</span> {newPatient.email}
                                    </div>
                                    <div>
                                        <span>Data de Nascimento:</span> {formatDate(newPatient.data)}
                                    </div>
                                    <div>
                                        <span>Gênero:</span> {newPatient.genero}
                                    </div>
                                    <div>
                                        <span>Observações:</span> {newPatient.observacoes}
                                    </div>
                                    <div>
                                        <span>Endereço:</span> {newPatient.endereco}
                                    </div>
                                    <div>
                                        <span>Cidade:</span> {newPatient.cidade}
                                    </div>
                                    <div>
                                        <span>Estado:</span> {newPatient.estado}
                                    </div>
                                </div>
                            </div>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={prevStep} disabled={formStep === 1}>Voltar</Button>
                    {formStep < 5 && <Button variant="primary" onClick={nextStep}>Avançar</Button>}
                    {formStep === 5 && <Button variant="primary" onClick={handleSubmit}>Cadastrar</Button>}
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default PatientList;
