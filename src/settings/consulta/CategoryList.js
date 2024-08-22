import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, InputGroup, FormControl, Modal, Form } from 'react-bootstrap';
import './CategoryList.css';
import api from '../../config/Axion';

const categoriesPerPage = 10;

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [newCategory, setNewCategory] = useState({
        nome: '', descricao: '', valor: ''
    });

    const fetchCategories = useCallback(async () => {
        try {
            let response;
            if (searchTerm) {
                response = await api.get('/procedimentos/search', {
                    params: { nome: searchTerm }
                });
            } else {
                response = await api.get('/procedimentos');
            }
            setCategories(response.data);
        } catch (error) {
            console.error('Erro ao buscar procedimentos:', error);
        }
    }, [searchTerm]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);  // Resetar para a primeira página ao buscar
    };

    const indexOfLastCategory = currentPage * categoriesPerPage;
    const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
    const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory);

    const nextPage = () => {
        if (indexOfLastCategory < categories.length) {
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

    const handleCloseModal = () => {
        setShowModal(false);
        setNewCategory({ nome: '', descricao: '', valor: '' });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewCategory({ ...newCategory, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/procedimentos', newCategory);
            fetchCategories(); // Atualiza a lista de categorias após o cadastro
            handleCloseModal();
        } catch (error) {
            console.error('Erro ao cadastrar procedimento:', error);
        }
    };

    return (
        <div className="category-list">
            <div className="header">
                <h2>Procedimentos Odontológicos</h2>
                <Button variant="primary" className="add-category-button" onClick={handleShowModal}>
                    + Add Procedimento
                </Button>
            </div>
            <InputGroup className="mb-3 search-bar">
                <FormControl
                    placeholder="Pesquisar Procedimento"
                    aria-label="Pesquisar"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <InputGroup.Text className="search-icon">
                    <i className="fas fa-search"></i>
                </InputGroup.Text>
            </InputGroup>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Nome</th>
                    <th>Descrição</th>
                    <th>Valor</th>
                </tr>
                </thead>
                <tbody>
                {currentCategories.map((category, index) => (
                    <tr key={index}>
                        <td>{category.nome}</td>
                        <td>{category.descricao}</td>
                        <td>{category.valor}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
            <div className="pagination">
                <Button onClick={prevPage} disabled={currentPage === 1}>Página Anterior</Button>
                <Button onClick={nextPage} disabled={indexOfLastCategory >= categories.length}>Próxima Página</Button>
            </div>

            <Modal show={showModal} onHide={handleCloseModal} className="modal-fixed-size">
                <Modal.Header closeButton>
                    <Modal.Title>Cadastrar Procedimento</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formName">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control type="text" name="nome" value={newCategory.nome} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formDescription">
                            <Form.Label>Descrição</Form.Label>
                            <Form.Control type="text" name="descricao" value={newCategory.descricao} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formPrice">
                            <Form.Label>Valor</Form.Label>
                            <Form.Control type="number" name="valor" value={newCategory.valor} onChange={handleChange} required />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Cadastrar
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CategoryList;
