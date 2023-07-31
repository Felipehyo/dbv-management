import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { TextField, Button, IconButton, Input, InputLabel, InputAdornment, FormControl } from "@mui/material";
import parterGB from '../../assets/partner-gb-2.png';

import './style.scss';

const Partner = () => {

    // const navigate = useNavigate();

    return (
        <>
            <div className='partner-container'>
                <div className='nav'>
                </div>
                <div className='header'>
                    <img src={parterGB}></img>
                    <h1>Clube Guilherme Belz</h1>
                </div>
                <div className='container-plans'>
                    <div className='plan'>
                        <h2>Plano Desbravador</h2>
                        <ul className='list'>
                            <li> - Carteirinha personalizada</li>
                            <li> - Caneca Sócio GB</li>
                            <li> - Caneta personalizada</li>
                        </ul>
                        <div className='link'>
                            <a href='https://sun.eduzz.com/2022397'>Assinar</a>
                        </div>
                    </div>
                    <div className='plan'>
                        <h2>Plano Líder</h2>
                        <ul className='list'>
                            <li> - Carteirinha personalizada</li>
                            <li> - Caneca Sócio GB</li>
                            <li> - Caneta personalizada</li>
                            <li> - Chaveiro personalizado</li>
                            <li> - Camisa do Sócio GB</li>
                        </ul>
                        <div className='link'>
                        <a href='https://sun.eduzz.com/2022392'>Assinar</a>
                        </div>
                    </div>
                    <div className='plan'>
                        <h2>Plano Master</h2>
                        <ul className='list'>
                            <li> - Carteirinha personalizada</li>
                            <li> - Caneca Sócio GB</li>
                            <li> - Caneta personalizada</li>
                            <li> - Chaveiro personalizado</li>
                            <li> - Camisa do Sócio GB</li>
                            <li> - GB Box</li>
                        </ul>
                        <div className='link'>
                            <a href='https://sun.eduzz.com/2026167'>Assinar</a>
                        </div>
                    </div>
                    <div className='plan'>
                        <h2>Master Avançado</h2>
                        <ul className='list'>
                            <li> - Carteirinha personalizada</li>
                            <li> - Caneca Sócio GB</li>
                            <li> - Caneta personalizada</li>
                            <li> - Chaveiro personalizado</li>
                            <li> - Camisa do Sócio GB</li>
                            <li> - GB Box</li>
                            <li> - Moletom Personalizado</li>
                        </ul>
                        <div className='link'>
                            <a href='https://sun.eduzz.com/2026168'>Assinar</a>
                        </div>
                    </div>
                </div>
                <footer>
                    <p>Clube Guilherme Belz - Associação Paulista Sul</p>
                </footer>
            </div>
        </>
    )

};

export default Partner;