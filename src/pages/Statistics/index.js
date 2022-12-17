import React from 'react';
import { useNavigate } from 'react-router-dom';

import './style.scss';
import Logout from '../../assets/logout.png';

const Statistics = () => {

    const navigate = useNavigate();

    function handlePresence() {
        navigate("/statistics/user/history");
    }

    function handleScore() {
        navigate("/statistics/score");
    }

    function handlelogout() {
        sessionStorage.clear();
        navigate("/");
    }

    return (
      <>
        <div className="container-score">
            <div className="sub-container-score">
                <div className='nav-score' onClick={handlelogout}>
                    <img className="logout" src={Logout} alt=""/>
                </div>
                <img className="logo" src='https://cdn-icons-png.flaticon.com/512/2821/2821637.png' alt=""/>
                <h1 className="nav-title">Estatísticas</h1>
                <section className="section">
                    <div className="card" onClick={() => handlePresence()}>
                        <div className="image">
                            <img src={'https://cdn-icons-png.flaticon.com/512/2994/2994539.png'} alt={''}/>
                        </div>
                        <div className="info">
                            <h2>Presença</h2>
                            <p>Relatório de presença anual</p>
                        </div>
                    </div>
                    <div className="card" onClick={() => handleScore()}>
                        <div className="image">
                            <img src={'https://cdn-icons-png.flaticon.com/512/2821/2821637.png'} alt={''}/>
                        </div>
                        <div className="info">
                            <h2>Pontuação</h2>
                            <p>Relatório de pontuação de todas as unidades cadastradas</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
      </>
    )
  };
  
  export default Statistics;