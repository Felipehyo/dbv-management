import React from 'react';
import { useNavigate } from 'react-router-dom';

import './style.scss';
import Logo from '../../assets/logo-geral-v2.png';
import Logout from '../../assets/logout.png';
import Statistics from '../../assets/statistics.png';
import Presence from '../../assets/presence.png';

const Home = () => {

    const navigate = useNavigate();
    const userType = sessionStorage.getItem('userType');

    const actions = [
        // {
        //     title: 'Pontuação',
        //     description: 'Registrar pontuação geral do clube e unidades',
        //     icon: 'https://cdn-icons-png.flaticon.com/512/3153/3153150.png',
        //     route: '/score',
        // },
        // {
        //     title: 'Presença',
        //     description: 'Registrar lista de presentes e kits individuais',
        //     icon: Presence,
        //     route: '/presence',
        // },
        {
            title: 'Ata Virtual',
            description: 'Registrar atas de secretaria, capelania e visualizar histórico',
            icon: 'https://cdn-icons-png.flaticon.com/512/2913/2913091.png',
            route: '/virtual-minutes',
        },
        {
            title: 'Eventos',
            description: 'Criar e editar eventos e inscrições',
            icon: 'https://cdn-icons-png.flaticon.com/512/4113/4113006.png',
            route: '/event',
        },
        {
            title: 'Tesouraria',
            description: 'Gerenciar toda a parte financeira do clube',
            icon: 'https://cdn-icons-png.flaticon.com/512/2460/2460494.png',
            route: '/treasury',
        },
        {
            title: 'Usuários',
            description: 'Criar, editar e gerenciar usuários',
            icon: 'https://cdn-icons-png.flaticon.com/512/1165/1165725.png',
            route: '/user',
        },
        // {
        //     title: 'Estatísticas',
        //     description: 'Estatísticas de presença e pontuação',
        //     icon: Statistics,
        //     route: '/statistics',
        // },
    ];

    const canAccessHomeAction = (type, route) => {
        if (!type) return false;

        const normalizedType = String(type).toUpperCase();

        if (normalizedType === 'EXECUTIVE' || normalizedType === 'ADMIN') return true;
        if (normalizedType === 'EVENTUAL') return false;
        if (normalizedType === 'PATHFINDER' || normalizedType === 'DIRECTION') {
            return route.startsWith('/virtual-minutes');
        }

        return false;
    };

    const visibleActions = actions.filter((item) => canAccessHomeAction(userType, item.route));

    function handlelogout() {
        sessionStorage.clear();
        navigate("/");
    }

    return (
        <>
            <div className="default-container">
                <div className="sub-container-home">
                    <div className='nav'>
                        <img className="logout" src={Logout} alt="" onClick={handlelogout} />
                    </div>
                    <img className="logo" src={Logo} alt="" />
                    <section className="section">
                        {visibleActions.map((item) => (
                            <div
                            key={item.title}
                            className="card"
                            onClick={() => navigate(item.route)}
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

export default Home;