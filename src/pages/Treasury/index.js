import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../../services/api';

import './style.scss';

import Nav from '../../components/Nav';

const Treasury = () => {

    const clubId = sessionStorage.getItem("clubId");
    const [club, setClub] = useState('');
    const navigate = useNavigate();

    const actions = [
        {
            title: 'Registrar Pagamentos',
            description: 'Registrar pagamentos recebidos por desbravadores ou diretoria',
            icon: 'https://cdn-icons-png.flaticon.com/512/3258/3258583.png',
            route: '/treasury/register',
        },
        // {
        //     title: 'Cobrar Evento',
        //     description: 'Realizar cobranças para eventos cadastrados',
        //     icon: 'https://cdn-icons-png.flaticon.com/512/4866/4866857.png',
        //     route: null, // ainda não implementado
        // },
        // {
        //     title: 'Caixa Individual',
        //     description: 'Visualizar movimentações financeiras do usuário',
        //     icon: 'https://cdn-icons-png.flaticon.com/512/5259/5259256.png',
        //     route: '/user-cash',
        // },
        {
            title: 'Histórico de Pagamentos',
            description: 'Consultar histórico por clube, evento ou desbravador',
            icon: 'https://cdn-icons-png.flaticon.com/512/2682/2682065.png',
            route: '/treasury/history',
        },
        {
            title: 'Livro Caixa',
            description: 'Registrar entradas e saídas do caixa do clube',
            icon: 'https://cdn-icons-png.flaticon.com/512/3561/3561384.png',
            route: '/treasury/cash-book',
        },
    ];

    function handleBack() {
        navigate("/home");
    }

    useEffect(() => {
        api.get('club/' + clubId).then(response => {
            setClub(response.data);
        })
    }, []);

    return (
        <>
            <div className="default-container">
                <div className="sub-container-treasury">
                    <Nav handleBack={handleBack} />
                    <img className="logo" src='https://cdn-icons-png.flaticon.com/512/2460/2460494.png' alt="" />
                    <h1 className="nav-title">Tesouraria</h1>
                    <div className="total">
                        <h4>Total em caixa: R${parseFloat(club.bank).toFixed(2)}</h4>
                    </div>
                    <section className="section">
                        {actions.map((item) => (
                            <div
                            key={item.title}
                            className={`card ${!item.route ? 'disabled' : ''}`}
                            onClick={() => item.route && navigate(item.route)}
                            >
                            <div className="info">
                                <h2>{item.title}</h2>
                                <p>{item.description}</p>
                            </div>

                            <div className="image">
                                <img src={item.icon} alt={item.title} />
                            </div>
                            </div>
                        ))}
                    </section>
                </div>
            </div>
        </>
    )
};

export default Treasury;