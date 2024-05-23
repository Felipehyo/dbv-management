import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../../services/api';

import Nav from '../../components/Nav';

import './style.scss';

const UnitHistory = () => {

    const [unit, setUnit] = useState([]);
    const [activities, setActivities] = useState([]);

    const unitId = sessionStorage.getItem("unitId");
    const navigate = useNavigate();

    function handleBack() {
        navigate("/statistics/score");
    }

    useEffect(() => {

        api.get('activity-record/unit/' + unitId).then(response => {
            setActivities(response.data);
        });

        api.get('unit/' + unitId).then(response => {
            setUnit(response.data);
        });

    }, [unitId]);

    return (
        <>
            <div className="default-container">
                <div className="sub-container-score-unit">
                    <Nav handleBack={handleBack} />
                    <img className="logo" src={unit.imageLink} alt="" />
                    <h1 className="nav-title">{unit.name}</h1>
                    <section className="section">
                        {
                            activities.sort((a, b) => new Date(b.date) - new Date(a.date)).map((activity, id) => (
                                <div className="card-activity-history" key={id}>
                                    <div className="info-history">
                                        <p>{activity.date.split('-')[2] + "/" + activity.date.split('-')[1]}</p>
                                        <p>{activity.title}</p>
                                        <p style={activity.points < 0 ? { "color": "#FB5D5D" } : activity.points > 0 ? { "color": "#046908" } : null}>{activity.points}</p>
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

export default UnitHistory;