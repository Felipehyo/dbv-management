import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { TextField, Button, IconButton, Input, InputLabel, InputAdornment, FormControl } from "@mui/material";
import parterGB from '../../assets/fundo_gb.jpg';
import gbMen from '../../assets/gb-men.png';
import lider from '../../assets/lider.webp';
import liderMaster from '../../assets/lider-master.png';
import liderMasterAvancado from '../../assets/lider-master-avançado.png';
import desbravador from '../../assets/desbravador.png';

import './style.scss';

const Partner = () => {

    // const navigate = useNavigate();

    return (
        <>
            <div className='partner-container'>
                <div className='nav'>
                </div>
                <div className='header'>
                    <div className='patner-image'></div>
                    <img src={parterGB}></img>
                    <h1>Clube Guilherme Belz</h1>
                </div>
                <div className='container-plans'>
                    <div className='plan'>
                        <img src={desbravador} height={60}></img>
                        <h2>Plano Desbravador</h2>
                        <ul className='list'>
                            <li>Carteirinha personalizada</li>
                            <li>Caneca Sócio GB</li>
                            <li>Caneta personalizada</li>
                        </ul>
                        <div className='link'>
                            <h3>R$25,00</h3>
                            <a href='https://sun.eduzz.com/2022397'>Assinar</a>
                        </div>
                    </div>
                    <div className='plan'>
                        <img src={lider} height={60}></img>
                        <h2>Plano Líder</h2>
                        <ul className='list'>
                            <li>Todos do plano 1</li>
                            <li>Chaveiro personalizado</li>
                            <li>Camisa do Sócio GB</li>
                            <li>Sacochila</li>
                            <li>Agenda Personalizada</li>
                        </ul>
                        <div className='link'>
                            <h3>R$50,00</h3>
                            <a href='https://sun.eduzz.com/2022392'>Assinar</a>
                        </div>
                    </div>
                    <div className='plan'>
                        <img src={liderMaster} height={60}></img>
                        <h2>Plano Master</h2>
                        <ul className='list'>
                            <li>Todos do plano 1 e 2</li>
                            <li>Sacochila</li>
                            <li>Agenda Personalizada</li>
                            <li>Sacochila</li>
                            <li>Agenda Personalizada</li>
                            <li>Sacochila</li>
                            <li>Agenda Personalizada</li>
                        </ul>
                        <div className='link'>
                            <h3>R$75,00</h3>
                            <a href='https://sun.eduzz.com/2026167'>Assinar</a>
                        </div>
                    </div>
                    <div className='plan'>
                        <img src={liderMasterAvancado} height={60}></img>
                        <h2>Master Avançado</h2>
                        <ul className='list'>
                            <li>Todos do plano 1, 2 e 3</li>
                            <li>Moletom Personalizado</li>
                            <li>Sacochila</li>
                            <li>Agenda Personalizada</li>
                            <li>Sacochila</li>
                            <li>Agenda Personalizada</li>
                            <li>Sacochila</li>
                            <li>Agenda Personalizada</li>
                            <li>Sacochila</li>
                            <li>Agenda Personalizada</li>
                        </ul>
                        <div className='link'>
                            <h3>R$100,00</h3>
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