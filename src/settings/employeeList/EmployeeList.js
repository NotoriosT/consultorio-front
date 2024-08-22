import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, InputGroup, FormControl, Modal, Form } from 'react-bootstrap';
import './EmployeeList.css';
import api from '../../config/Axion';

const employeesPerPage = 10;

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [newEmployee, setNewEmployee] = useState({
        nome: '', email: '', cro: '', cpf: '', especialidade: '', dataNascimento: '', genero: '', rg: '', estadoCivil: ''
    });

    const fetchEmployees = useCallback(async () => {
        try {
            let response;
            if (searchTerm) {
                response = await api.get('/funcionarios/search', {
                    params: { nome: searchTerm }
                });
            } else {
                response = await api.get('/funcionarios');
            }
            setEmployees(response.data);
        } catch (error) {
            console.error('Erro ao buscar funcionários:', error);
        }
    }, [searchTerm]);

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);  // Resetar para a primeira página ao buscar
    };

    const indexOfLastEmployee = currentPage * employeesPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
    const currentEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);

    const nextPage = () => {
        if (indexOfLastEmployee < employees.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleShowModal = () => {
        setShowModal(true);
    };
    const handleCloseModal = () => setShowModal(false);

    const formatCPF = (value) => {
        return value
            .replace(/\D/g, '') // Remove tudo que não é dígito
            .slice(0, 11) // Limita a 11 dígitos
            .replace(/(\d{3})(\d)/, '$1.$2') // Coloca o ponto entre o terceiro e o quarto dígitos
            .replace(/(\d{3})(\d)/, '$1.$2') // Coloca o ponto entre o sexto e o sétimo dígitos
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Coloca o hífen entre o nono e o décimo dígitos
    };

    const formatRG = (value) => {
        return value
            .replace(/\D/g, '') // Remove tudo que não é dígito
            .slice(0, 9) // Limita a 9 dígitos
            .replace(/(\d{2})(\d)/, '$1.$2') // Coloca o ponto entre o segundo e o terceiro dígitos
            .replace(/(\d{3})(\d)/, '$1.$2') // Coloca o ponto entre o quinto e o sexto dígitos
            .replace(/(\d{3})(\d{1})$/, '$1-$2'); // Coloca o hífen entre o oitavo e o nono dígitos
    };

    const handleChange = (e) => {
        let { name, value } = e.target;

        if (name === 'cpf') {
            value = formatCPF(value);
        } else if (name === 'rg') {
            value = formatRG(value);
        }

        setNewEmployee(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            const formattedEmployee = {
                ...newEmployee,
                dataNascimento: newEmployee.dataNascimento ? new Date(newEmployee.dataNascimento).toISOString().split('T')[0] : ''
            };
            const response = await api.post('/funcionarios', formattedEmployee);
            setEmployees(prevEmployees => [...prevEmployees, response.data]);
            handleCloseModal();
            // Limpar campos após o cadastro
            setNewEmployee({
                nome: '', email: '', cro: '', cpf: '', especialidade: '', dataNascimento: '', genero: '', rg: '', estadoCivil: ''
            });
        } catch (error) {
            console.error('Erro ao cadastrar funcionário:', error);
        }
    };

    return (
        <div className="employee-list">
            <div className="header">
                <h2>Funcionários</h2>
                <Button variant="primary" className="add-employee-button" onClick={handleShowModal}>
                    + Add Funcionário
                </Button>
            </div>
            <InputGroup className="mb-3 search-bar">
                <FormControl
                    placeholder="Pesquisar"
                    aria-label="Pesquisar"
                    aria-describedby="basic-addon1"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <InputGroup.Text id="basic-addon1" className="search-icon"><i className="fas fa-search"></i></InputGroup.Text>
            </InputGroup>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>CRO</th>
                    <th>CPF</th>
                    <th>Especialidade</th>
                </tr>
                </thead>
                <tbody>
                {currentEmployees.map((employee, index) => (
                    <tr key={index}>
                        <td>{employee.nome}</td>
                        <td>{employee.email}</td>
                        <td>{employee.cro}</td>
                        <td>{employee.cpf}</td>
                        <td>{employee.especialidade}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
            <div className="pagination">
                <Button onClick={prevPage} disabled={currentPage === 1}>Página Anterior</Button>
                <Button onClick={nextPage} disabled={indexOfLastEmployee >= employees.length}>Próxima Página</Button>
            </div>

            <Modal show={showModal} onHide={handleCloseModal} className="modal-fixed-size">
                <Modal.Header closeButton>
                    <Modal.Title>Cadastrar Funcionário</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formName">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control type="text" name="nome" value={newEmployee.nome} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId="formEmail">
                            <Form.Label>E-mail</Form.Label>
                            <Form.Control type="email" name="email" value={newEmployee.email} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId="formCro">
                            <Form.Label>CRO</Form.Label>
                            <Form.Control type="text" name="cro" value={newEmployee.cro} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId="formCpf">
                            <Form.Label>CPF</Form.Label>
                            <Form.Control type="text" name="cpf" value={newEmployee.cpf} maxLength="14" onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId="formEspecialidade">
                            <Form.Label>Especialidade</Form.Label>
                            <Form.Control type="text" name="especialidade" value={newEmployee.especialidade} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId="formDataNascimento">
                            <Form.Label>Data de Nascimento</Form.Label>
                            <Form.Control type="date" name="dataNascimento" value={newEmployee.dataNascimento} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId="formGenero">
                            <Form.Label>Gênero</Form.Label>
                            <Form.Control as="select" name="genero" value={newEmployee.genero} onChange={handleChange}>
                                <option value="">Selecione</option>
                                <option value="MASCULINO">Masculino</option>
                                <option value="FEMININO">Feminino</option>
                                <option value="OUTRO">Outro</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formRg">
                            <Form.Label>RG</Form.Label>
                            <Form.Control type="text" name="rg" value={newEmployee.rg} maxLength="12" onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId="formEstadoCivil">
                            <Form.Label>Estado Civil</Form.Label>
                            <Form.Control as="select" name="estadoCivil" value={newEmployee.estadoCivil} onChange={handleChange}>
                                <option value="">Selecione</option>
                                <option value="SOLTEIRO">Solteiro</option>
                                <option value="CASADO">Casado</option>
                                <option value="DIVORCIADO">Divorciado</option>
                                <option value="VIUVO">Viúvo</option>
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
                    <Button variant="primary" onClick={handleSubmit}>Cadastrar</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default EmployeeList;
