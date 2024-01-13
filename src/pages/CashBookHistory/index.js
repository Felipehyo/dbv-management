import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Fab } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

import api from '../../services/api';

import Nav from '../../components/Nav';

import './style.scss';

const CashBookHistory = () => {

    const navigate = useNavigate();
    const clubId = sessionStorage.getItem("clubId");
    const [histories, setHistory] = useState([]);

    function handleBack() {
        navigate("/treasury");
    }

    function handleCashBookRegister() {
        navigate("/treasury/cash-book/register");
    }

    useEffect(() => {

        api.get('cash-book/' + clubId).then(response => {
            setHistory(response.data);
            console.log(response.data);
        });

    }, [clubId]);

    return (
        <>
            <div className="container-cash-book-history">
                <div className="sub-container-cash-book-history">
                    <Nav handleBack={handleBack} />
                    <img className="logo" src={'https://cdn-icons-png.flaticon.com/512/3561/3561384.png'} alt="" />
                    <h1 className="nav-title">Livro Caixa</h1>
                    <section className="section">
                        {
                            histories.sort((a, b) => new Date(b.date) - new Date(a.date)).map((history, id) => (
                                <div className="card-activity-history" key={id}>

                                    <div className='card-image'>
                                        <img src={'https://cdn-icons-png.flaticon.com/512/2454/2454269.png'} alt="" />
                                    </div>

                                    <div className="card-info">
                                        <p><b>Data:</b> {history.date.split('-')[2] + "/" + history.date.split('-')[1] + "/" + history.date.split('-')[0]}</p>
                                        <p><b>Valor:</b> R${parseFloat(history.value).toFixed(2)}</p>
                                        <p><b>Tipo:</b> {history.type}</p>
                                        <p><b>Descrição:</b> {history.description}</p>
                                    </div>
                                </div>
                            ))
                        }
                    </section>
                    <footer className='footer-cash-book-history'>
                        <Fab className='fabButton' size='medium' onClick={() => handleCashBookRegister()} aria-label="add">
                            <AddIcon />
                        </Fab>
                    </footer>
                </div >
            </div >
        </>
    )
};

export default CashBookHistory;