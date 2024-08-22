import React from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    const location = useLocation();  // Obtém a localização atual
    const navigate = useNavigate();  // Hook para redirecionamento

    const navItems = [
        { to: "/home", icon: "fas fa-home" },
        { to: "/calendar", icon: "fas fa-calendar-alt" },
        { to: "/messages", icon: "fas fa-comments" },
        { to: "/patients", icon: "fas fa-user-friends" },
        { to: "/settings", icon: "fas fa-cogs" },
    ];

    const handleLogout = () => {
        // Remove o token do localStorage (ou sessionStorage)
        localStorage.removeItem('token');

        // Redireciona para a página de login
        navigate('/login');
    };

    return (
        <div className="sidebar d-flex flex-column">
            <Nav className="flex-column flex-grow-1">
                {navItems.map((item, index) => (
                    <LinkContainer key={index} to={item.to}>
                        <Nav.Link className={location.pathname === item.to ? "active" : ""}>
                            <i className={item.icon}></i>
                        </Nav.Link>
                    </LinkContainer>
                ))}
            </Nav>
            <Nav className="flex-column">
                <Nav.Link className="mt-auto logout" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i>
                </Nav.Link>
            </Nav>
        </div>
    );
};

export default Sidebar;
