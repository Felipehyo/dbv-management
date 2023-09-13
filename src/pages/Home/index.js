import React from 'react';
import { useNavigate } from 'react-router-dom';

import './style.scss';
import Logo from '../../assets/Logo.png';
import Logout from '../../assets/logout.png';
import Statistics from '../../assets/statistics.png';
import Presence from '../../assets/presence.png';

const Home = () => {

    const navigate = useNavigate();

    function handleScore() {
        navigate("/score");
    }

    function handlePresence() {
        navigate("/presence");
    }

    function handleEvents() {
        navigate("/event/register");
    }

    function handleTreasury() {
        navigate("/treasury");
    }

    function handleStatistics() {
        navigate("/statistics");
    }

    function handlelogout() {
        sessionStorage.clear();
        navigate("/");
    }

    return (
      <>
        <div className="container-home">
            <div className="sub-container-home">
                <div className='nav'>
                    <img className="logout" src={Logout} alt="" onClick={handlelogout}/>
                </div>
                <img className="logo" src={Logo} alt=""/>
                <section className="section">
                    <div className="card" onClick={handleScore}>
                        <div className="info">
                            <h2>Pontuação</h2>
                            <p>Registrar pontuação geral do clube e unidades</p>
                        </div>
                        <div className="image">
                            <img src="https://cdn-icons-png.flaticon.com/512/3153/3153150.png" alt=""/>
                        </div>
                    </div>
                    <div className="card" onClick={handlePresence}>
                        <div className="info">
                            <h2>Presença</h2>
                            <p>Registrar lista de presentes e kits individuais</p>
                        </div>
                        <div className="image">
                            <img src={Presence} alt=""/>
                        </div>
                    </div>
                    <div className="card" onClick={handleEvents}>
                        <div className="info">
                            <h2>Eventos</h2>
                            <p>Criar e editar eventos, e inscrever desbravadores nos eventos</p>
                        </div>
                        <div className="image">
                            <img src={'https://cdn-icons-png.flaticon.com/512/5987/5987625.png'} alt="Acampamento ícones criados por Good Ware - Flaticon"/>
                        </div>
                    </div>
                    <div className="card" onClick={handleTreasury}>
                        <div className="info">
                            <h2>Tesouraria</h2>
                            <p>Gerenciar toda a parte financeira do seu clube</p>
                        </div>
                        <div className="image">
                            <img src={'https://cdn-icons-png.flaticon.com/512/2460/2460494.png'} alt="Dinheiro ícones criados por justicon - Flaticon"/>
                        </div>
                    </div>
                    <div className="card" onClick={handleStatistics}>
                        <div className="info">
                            <h2>Estatísticas</h2>
                            <p>Estatísticas de presença e pontuação de unidades </p>
                        </div>
                        <div className="image">
                            <img src={Statistics} alt=""/>
                        </div>
                    </div>
                </section>
            </div>
        </div>
      </>
    )
  };
  
  export default Home;