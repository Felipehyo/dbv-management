import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../../services/api';

import './style.scss';

import Nav from '../../components/Nav';

const Score = () => {

    const [ unitList, setUnitList ] = useState([]);
    const clubId = sessionStorage.getItem("clubId");

    const navigate = useNavigate();

    function handleUnit(unit) {
        sessionStorage.setItem("unitId", unit.id);
        navigate("/score/unit");
    }

    function handleBack() {
        navigate("/home");
    }

    useEffect(() => {
        api.get('unit/club/' + clubId).then(response => {
            setUnitList(response.data);
        })
    }, []);

    return (
      <>
        <div className="container-score">
            <div className="sub-container-score">
                <Nav handleBack={handleBack}/>
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