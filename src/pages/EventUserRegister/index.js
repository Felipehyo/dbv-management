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

    async function saveRegister(user, subscribed) {
        const data = {
            "eventId": eventId,
            "pathfinderId": user.userId,
            "registerType": subscribed ? "SUBSCRIBE" : "UNSUBSCRIBE"
        }

        await api.post("event/register", data);
        if (!subscribed) {
            document.querySelector('#abscence-' + user.userId).classList.add('selected');
            document.querySelector('#presence-' + user.userId).classList.remove('selected');
        } else if (subscribed) {
            document.querySelector('#presence-' + user.userId).classList.add('selected');
            document.querySelector('#abscence-' + user.userId).classList.remove('selected');
        }
    }

    useEffect(() => {

        api.get('event/' + eventId).then(response => {
            setEvent(response.data);
        });

        api.get('/event/register/' + eventId + '/club/' + clubId).then(response => {
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
                        {
                            userRegister.sort((a, b) => a.user - b.user).map((user, id) => (
                                <div className="card" key={id}>
                                    <div className="image">
                                        <img src={user.userGender === 'MALE' ? "https://cdn-icons-png.flaticon.com/512/2922/2922506.png" : "https://cdn-icons-png.flaticon.com/512/2922/2922566.png"} alt={"flatIcon"} />
                                    </div>
                                    <div className="info">
                                        <div className="content">
                                            <h2>{user.user.split(" ").slice(0, 3).join(" ")}</h2>
                                        </div>
                                    </div>
                                    <div className='btns'>
                                        <button id={'abscence-' + user.userId}
                                            className={'bt-abscence' + (!user.subscribed ? ' selected' : '')}
                                            onClick={() => saveRegister(user, false)}>N</button>
                                        <button id={'presence-' + user.userId}
                                            className={'bt-presence' + (user.subscribed ? ' selected' : '')}
                                            onClick={() => saveRegister(user, true)}>S</button>
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

export default EventUserRegister;