import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../../services/api';

import './style.scss';
import Logout from '../../assets/logout.png';

const UserHistory = () => {

    const [ unit, setUnit ] = useState([]);
    const [ activities, setActivities ] = useState([]);

    const unitId = localStorage.getItem("unitId");
    const navigate = useNavigate();

    const [ title, setTitle ] = useState('');
    
    const [ description, setDescription ] = useState('');
    const [ qtdScore, setQtdScore ] = useState(0);

    const [ type, setType ] = useState('');

    function handlelogout() {
        localStorage.clear();
        navigate("/");
    }

    useEffect(() => {

        api.get('presence/all').then(response => {
            setActivities(response.data);
        });

    }, [0]);

    return (
      <>
        <div className="container-score-unit">
            <div className="sub-container-score-unit">
                <div className='nav-score'>
                    <img className="logout" src={Logout} alt="" onClick={handlelogout}/>
                </div>
                <img className="logo" src={'https://cdn-icons-png.flaticon.com/512/3585/3585145.png'} alt=""/>
                <h1 className="nav-title">Histórico de Presença</h1>
                <section className="section">
                {
                    activities.sort((a, b) => a.user.name - b.user.namer).map((data, id) => (

                        <div className="card-activity-history" key={id}>
                            <div className="info-history">
                                <p>{data.user.name}</p>
                                <p>{data.percent}%</p>
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
  
export default UserHistory;