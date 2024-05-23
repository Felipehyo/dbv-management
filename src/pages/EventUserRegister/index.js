import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from "@mui/material";
import api from '../../services/api';

import './style.scss';
import Nav from '../../components/Nav';

import Modal from '../../components/Modal';

const EventUserRegister = () => {

    const [userRegister, setUserRegisterList] = useState([]);
    const [event, setEvent] = useState([]);
    const [userSelected, setUserSelected] = useState([]);
    const [subscribed, setSubscribed] = useState([]);

    const clubId = sessionStorage.getItem("clubId");

    const eventId = sessionStorage.getItem("eventId");
    const navigate = useNavigate();

    function handleBack() {
        navigate("/event/details");
    }

    function openModal(user, subscribed) {
        setSubscribed(subscribed);
        document.querySelector('.modal-container').classList.add('show-modal');
        setUserSelected(user);
    }

    async function saveRegister() {

        const data = {
            "eventId": eventId,
            "pathfinderId": userSelected.userId,
            "registerType": subscribed ? "SUBSCRIBE" : "UNSUBSCRIBE"
        }

        await api.post("event/register", data);
        closeModal();
        if (!subscribed) {
            document.querySelector('#abscence-' + userSelected.userId).classList.add('selected');
            document.querySelector('#presence-' + userSelected.userId).classList.remove('selected');
        } else if (subscribed) {
            document.querySelector('#presence-' + userSelected.userId).classList.add('selected');
            document.querySelector('#abscence-' + userSelected.userId).classList.remove('selected');
        }
    }

    function closeModal() {
        document.querySelector('.modal-container').classList.remove('show-modal');
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
                                            onClick={() => openModal(user, false)}>N</button>
                                        <button id={'presence-' + user.userId}
                                            className={'bt-presence' + (user.subscribed ? ' selected' : '')}
                                            onClick={() => openModal(user, true)}>S</button>
                                    </div>
                                </div>
                            ))
                        }
                    </section>
                    <Modal widht="330px" height="" onClick={closeModal} color={'#000'}>
                        {(subscribed) ? (
                            <>
                                <div className='modal-info'>
                                    <h2>Inscrição de Evento</h2>
                                    <p>Inscrever <b>{userSelected.user}</b> no evento <b>{event.event}</b>?</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className='modal-info'>
                                    <h2>Cancelar Inscrição</h2>
                                    <p className='text'>Deseja cancelar a incrição de <b>{userSelected.user}</b>?</p>
                                </div>
                            </>
                        )}

                        <div className='bts-modal'>
                            <Button className='bts-modal-cancel' variant="contained" onClick={closeModal}>Cancelar</Button>
                            <Button className='bts-modal-confirm' variant="contained" onClick={saveRegister}>Confirmar</Button>
                        </div>
                    </Modal>
                </div>
            </div>
        </>
    )
};

export default EventUserRegister;