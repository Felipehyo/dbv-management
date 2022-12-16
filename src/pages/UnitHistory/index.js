import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { TextField, Button, InputLabel, MenuItem, FormControl, Select } from "@mui/material";
import api from '../../services/api';

import Modal from '../../components/Modal';

import './style.scss';
import Logout from '../../assets/logout.png';
import ImageScore from '../../assets/score.png';

const UnitHistory = () => {

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

        api.get('activity-record/' + unitId).then(response => {
            setActivities(response.data);
        });

        api.get('unit/' + unitId).then(response => {
            setUnit(response.data);
        });

    }, [0]);

    return (
      <>
        <div className="container-score-unit">
            <div className="sub-container-score-unit">
                <div className='nav-score'>
                    <img className="logout" src={Logout} alt="" onClick={handlelogout}/>
                </div>
                <img className="logo" src={unit.imageLink} alt=""/>
                <h1 className="nav-title">{unit.name}</h1>
                <section className="section">
                {
                    activities.sort((a, b) => a.activityOrder - b.activityOrder).map((activity, id) => (

                        <div className="card-activity-history" key={id}>
                            <div className="info-history">
                                <p>{new Date(activity.date).getDate() + "/" + new Date(activity.date).getMonth()}</p>
                                <p>{activity.title}</p>
                                <p>{activity.points}</p>
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