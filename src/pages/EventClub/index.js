import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../../services/api';

import './style.scss';

import Nav from '../../components/Nav';

const EventClub = () => {

    const clubId = sessionStorage.getItem("clubId");

    const [unitList, setUnitList] = useState([]);
    const [eventList, setEventList] = useState([]);

    const navigate = useNavigate();

    function handleEvent(event) {
        sessionStorage.setItem("eventId", event.id);
        //navigate("/event/details");
    }

    function handleBack() {
        navigate("/home");
    }

    useEffect(() => {
        api.get('unit').then(response => {
            setUnitList(response.data);
        })

        api.get('event/club/' + clubId).then(response => {
            setEventList(response.data);
            console.log(response.data);
        });
    }, []);

    return (
        <>
            <div className="container-score">
                <div className="sub-container-score">
                    <Nav handleBack={handleBack} />
                    <img className="logo" src='https://cdn-icons-png.flaticon.com/512/5987/5987625.png' alt="Barraca ícones criados por Freepik - Flaticon" />
                    <h1 className="nav-title">Eventos do Clube</h1>
                    <section className="section">
                        {
                            eventList.map((event, id) => (
                                <div className="card" key={id} onClick={() => handleEvent(event)}>
                                    <div className="image">
                                        <img src='https://cdn-icons-png.flaticon.com/512/5987/5987625.png' alt='Cronograma ícones criados por Flat Icons - Flaticon' />
                                    </div>
                                    <div className="info">
                                        <h2>{event.name}</h2>
                                        <p>Membros inscritos: {event.subscribedUsers}</p>
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

export default EventClub;