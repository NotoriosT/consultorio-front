import React from 'react';
import { ListGroup } from 'react-bootstrap';
import './DentistList.css';

const DentistList = () => {
    return (
        <ListGroup className="dentist-list">
            <ListGroup.Item active>Dentistas</ListGroup.Item>
            <ListGroup.Item>Todos</ListGroup.Item>
            <ListGroup.Item>
                <img src="/img/dentist.jpg" alt="Dentist" className="dentist-img" /> Roberto Lakhross
            </ListGroup.Item>
            <ListGroup.Item>
                <img src="/img/dentist.jpg" alt="Dentist" className="dentist-img" /> Roberto Lakhross
            </ListGroup.Item>
        </ListGroup>
    );
};

export default DentistList;
