import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../../services/api';

import './style.scss';

import Nav from '../../components/Nav';

import AddEvent from '../../assets/add-event.png';

const ClubEvents = () => {

    const [eventList, setEventList] = useState([]);
    const clubId = sessionStorage.getItem("clubId");

    const navigate = useNavigate();

    function handleEvent(event) {
        sessionStorage.setItem("eventId", event.id);
        navigate("/event/details");
    }

    function handleBack() {
        navigate("/home");
    }

    function handleRegisterEvent() {
        navigate("/event/register");
    }

    const convertValue = (e) => {
        // Remove caracteres não numéricos e zeros a esquerda
        let numericValue = e.replace(/[^\d]/g, '');
        var removeCaracteres = numericValue.replace(/[,.]/g, '');
        var value = removeCaracteres.replace(/^0+/, '');

        // Preenche com zeros à esquerda se necessário
        var result;
        if (value.length === 0) {
            result = "0,00"
        } else if (value.length === 1) {
            result = "0,0" + value;
        } else if (value.length === 2) {
            result = "0," + value;
        } else if (value.length < 6) {
            result = value.slice(0, -2) + "," + value.substr(value.length - 2);
        } else if (value.length < 8) {
            let decimal = value.substr(value.length - 2);
            let hundred = value.substr(value.length - 5);
            let thousand = value.slice(0, - 5);
            result = thousand + "." + hundred.slice(0, -2) + "," + decimal;
        } else {
            return;
        }

        return result;
    }

    useEffect(() => {
        api.get('event/club/' + clubId).then(response => {
            setEventList(response.data);
        })
    }, []);

    return (
        <>
            <div className="default-container">
                <div className="sub-container-club-events">
                    <Nav handleBack={handleBack} />
                    <img className="logo" src='https://cdn-icons-png.flaticon.com/512/4113/4113006.png' alt="" />
                    <h1 className="nav-title">Eventos do Clube</h1>
                    <section className="section-event">
                        {
                            eventList.sort((a, b) => a.date - b.date).map((event, id) => (
                                <div className="card-event" key={id} onClick={() => handleEvent(event)}>
                                    <div className="image">
                                        <img src={"https://cdn-icons-png.flaticon.com/512/10691/10691802.png"} alt={"test"} />
                                    </div>
                                    <div className="info">
                                        <h3>{event.name}</h3>
                                        <div className='sub-info'>
                                            <p><b>Valor:</b> {convertValue(parseFloat(event.value).toFixed(2))}</p>
                                            <p><b>Data:</b> {event.date}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </section>
                    <div className='add-event'>
                        <img className="plus" src={AddEvent} alt="" onClick={handleRegisterEvent} />
                    </div>
                </div>
            </div>
        </>
    )
};

export default ClubEvents;