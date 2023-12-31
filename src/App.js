import './App.css';
// fetch data from backend using react fetch
import React, { useState, useEffect } from 'react';
import QuantumCircuitSimulator from './components/Component';
import CircuitGrid from './components/CircuitGrid';
import ToolBar from './components/ToolBar';
// import bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {


    return (

        <div className='container'>
            <ToolBar />
            <CircuitGrid />
        </div>
    );
}

export default App;
