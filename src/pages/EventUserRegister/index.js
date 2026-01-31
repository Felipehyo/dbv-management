import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

import './style.scss';
import Nav from '../../components/Nav';

const EventUserRegister = () => {

    const [userRegister, setUserRegisterList] = useState([]);
    const [event, setEvent] = useState([]);

    const clubId = sessionStorage.getItem("clubId");

    const eventId = sessionStorage.getItem("eventId");
    const navigate = useNavigate();

    function handleBack() {
        navigate("/event/details");
    }

    async function saveRegister(userId, subscribed) {
        const data = {
            userId,
            registerType: subscribed ? "SUBSCRIBE" : "UNSUBSCRIBE"
        };

        await api.post(`event/${eventId}/register`, data);

        setUserRegisterList(prev =>
            prev.map(u =>
            u.userId === userId
                ? { ...u, subscribe: subscribed }
                : u
            )
        );
    }


    useEffect(() => {

        api.get('event/' + eventId).then(response => {
            setEvent(response.data);
        });

        api.get('/event/' + eventId + '/subscribes').then(response => {
            setUserRegisterList(response.data);
        });

    }, [eventId]);

    return (
        <>
            <div className="container-events-details-user-register">
                <div className="sub-container-events-details-user-register">
                    <Nav handleBack={handleBack} />
                    <img className="logo" src={"https://cdn-icons-png.flaticon.com/512/4659/4659043.png"} alt="" />
                    <h1 className="nav-title">Inscrição do Evento</h1>
                    <h2 className="sub-title">{event.event}</h2>
                    <section className="section">
                        {userRegister
                            .sort((a, b) => a.userName.localeCompare(b.userName))
                            .map(user => (
                            <div className={`card ${user.subscribe ? 'present' : 'absent'}`} key={user.userId}>
                                
                                <div className="image">
                                <img
                                    src={
                                    user.userGender === 'MALE'
                                        ? "https://cdn-icons-png.flaticon.com/512/2922/2922506.png"
                                        : "https://cdn-icons-png.flaticon.com/512/2922/2922566.png"
                                    }
                                    alt="Avatar"
                                />
                                </div>

                                <div className="info">
                                <h2>{user.userName.split(" ").slice(0, 3).join(" ")}</h2>
                                <span className="status">
                                    {user.subscribe ? 'Inscrito' : 'Não inscrito'}
                                </span>
                                </div>

                                <div className="btns">
                                <button
                                    className={`bt bt-no ${!user.subscribe ? 'active' : ''}`}
                                    onClick={() => saveRegister(user.userId, false)}
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        >
                                        <line x1="5" y1="5" x2="19" y2="19" />
                                        <line x1="19" y1="5" x2="5" y2="19" />
                                    </svg>
                                </button>

                                <button
                                    className={`bt bt-yes ${user.subscribe ? 'active' : ''}`}
                                    onClick={() => saveRegister(user.userId, true)}
                                >
                                    <svg viewBox="0 0 24 24">
                                        <path d="M20 6L9 17l-5-5" />
                                    </svg>
                                </button>
                                </div>
                            </div>
                        ))}
                    </section>
                </div>
            </div>
        </>
    )
};

export default EventUserRegister;