import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../../services/api';

import './style.scss';
import Logout from '../../assets/logout.png';

const ScoreStatistics = () => {

    const [ unitList, setUnitList ] = useState([]);

    const navigate = useNavigate();

    function handleUnit(unit) {
        localStorage.setItem("unitId", unit.id);
        navigate("/statistics/unit/history");
    }

    function handlelogout() {
        localStorage.clear();
        navigate("/");
    }

    useEffect(() => {
        api.get('activity-record/total-points').then(response => {
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
                <img className="logo" src='https://cdn-icons-png.flaticon.com/512/3153/3153150.png' alt=""/>
                <h1 className="nav-title">Pontuação Unidades</h1>
                <section className="section">
                {
                    unitList.sort((a, b) => a.unit.unitOrder - b.unit.unitOrder).map((data, id) => (
                        <div className="card" key={id} onClick={() => handleUnit(data.unit)}>
                            <div className="image">
                                <img src={data.unit.imageLink} alt={data.unit.assignment}/>
                            </div>
                            <div className="info">
                                <h2>{data.unit.name}</h2>
                                <p>Total de Guilherminas: {data.total}</p>
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
  
  export default ScoreStatistics;