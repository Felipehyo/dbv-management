import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../../services/api';

import './style.scss';
import Logout from '../../assets/logout.png';

const Score = () => {

    const [ unitList, setUnitList ] = useState([]);

    const navigate = useNavigate();

    function handleUnit(unit) {
        sessionStorage.setItem("unitId", unit.id);
        navigate("/score/unit");
    }

    function handlelogout() {
        sessionStorage.clear();
        navigate("/");
    }

    useEffect(() => {
        api.get('unit').then(response => {
            setUnitList(response.data);
        })
    }, []);

    return (
      <>
        <div className="container-score">
            <div className="sub-container-score">
                <div className='nav-score' onClick={handlelogout}>
                    <img className="logout" src={Logout} alt=""/>
                </div>
                <img className="logo" src='https://cdn-icons-png.flaticon.com/512/2821/2821637.png' alt=""/>
                <h1 className="nav-title">Pontuação Unidades</h1>
                <section className="section">
                {
                    unitList.sort((a, b) => a.unitOrder - b.unitOrder).map((unit, id) => (
                        <div className="card" key={id} onClick={() => handleUnit(unit)}>
                            <div className="image">
                                <img src={unit.imageLink} alt={unit.assignment}/>
                            </div>
                            <div className="info">
                                <h2>{unit.name}</h2>
                                <p>Não há pendências ativas para esta unidade</p>
                            </div>
                        </div>
                    ))
                }
                </section>
            </div>
        </div>
      </>
    )
  };
  
  export default Score;