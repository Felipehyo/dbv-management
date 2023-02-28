import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../../services/api';

import Nav from '../../components/Nav';

import './style.scss';

const UserHistory = () => {

    const [ activities, setActivities ] = useState([]);

    const clubId = sessionStorage.getItem("clubId");

    const navigate = useNavigate();

    function handleBack() {
        navigate("/statistics");
    }

    useEffect(() => {

        api.get('presence/all/' + clubId).then(response => {
            setActivities(response.data);
        });

    }, [clubId]);

    return (
      <>
        <div className="container-score-unit">
            <div className="sub-container-score-unit">
                <Nav handleBack={handleBack}/>
                <img className="logo" src={'https://cdn-icons-png.flaticon.com/512/3585/3585145.png'} alt=""/>
                <h1 className="nav-title">Histórico de Presença</h1>
                <section className="section">
                {
                    activities.sort((a, b) => a.user.name - b.user.name).map((data, id) => (

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