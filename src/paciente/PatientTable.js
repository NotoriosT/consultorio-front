import React from 'react';
import { Table } from 'react-bootstrap';
import './PatientTable.css';

const PatientTable = ({ patients }) => {
    return (
        <Table striped bordered hover className="patient-table">
            <thead>
            <tr>
                <th className="nome-header">Nome</th>
                <th className="doencas-header">Doenças</th>
                <th className="horario-header">Horário</th>
                <th className="procedimento-header">Procedimento</th>
            </tr>
            </thead>
            <tbody>
            {patients.map((patient, index) => (
                <tr key={index}>
                    <td>{patient.pacienteNome}</td>
                    <td>{patient.doencas || ""}</td>  {/* Deixe em branco conforme solicitado */}
                    <td>{patient.horario}</td>
                    <td>{patient.procedimentoNome}</td>
                </tr>
            ))}
            </tbody>
        </Table>
    );
};

export default PatientTable;
