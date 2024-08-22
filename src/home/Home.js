import React from 'react';
import Sidebar from '../sidebar/Sidebar';
import Dashboard from './Dashboard';
import './Home.css';

const Home = () => {
    return (
        <div id= "home">
            <Sidebar />
            <div className="content">
                <Dashboard />
            </div>
        </div>
    );
};

export default Home;
