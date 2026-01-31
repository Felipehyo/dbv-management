import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormControlLabel, FormGroup, Switch } from "@mui/material";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import api from '../../services/api';
import './style.scss';

import Nav from '../../components/Nav';

const ClubEvents = () => {

    const [eventList, setEventList] = useState([]);
    const [futureEventList, setFutureEventList] = useState([]);
    const [allEventList, setAllEventList] = useState([]);
    const clubId = sessionStorage.getItem("clubId");

    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    function handleEvent(event) {
        sessionStorage.setItem("eventId", event.id);
        navigate("/event/details");
    }

    function handleEditEvent(event, e) {
        e.stopPropagation();
        sessionStorage.setItem("eventId", event.id);
        navigate("/event/edit");
    }

    function handleBack() {
        navigate("/home");
    }

    function handleRegisterEvent() {
        navigate("/event/register");
    }

    const convertValue = (e) => {
        let numericValue = e.replace(/[^\d]/g, '');
        let value = numericValue.replace(/^0+/, '');

        if (value.length === 0) return "0,00";
        if (value.length === 1) return "0,0" + value;
        if (value.length === 2) return "0," + value;

        return value.slice(0, -2) + "," + value.slice(-2);
    };

    useEffect(() => {
        api.get(`event?clubId=${clubId}&onlyActives=true`).then(res => {
            setEventList(res.data);
            setFutureEventList(res.data);
        });

        api.get(`event?clubId=${clubId}&onlyActives=false`).then(res => {
            setAllEventList(res.data);
        });

        const alertEditSuccess = sessionStorage.getItem('startAlert');
        if (alertEditSuccess) {
            setAlertMessage(alertEditSuccess);
            setOpen(true);
        }
    }, []);

    return (
        <>
            <div className="default-container">
                <div className="sub-container-club-events">

                    <Nav handleBack={handleBack} />

                    <img
                        className="logo"
                        src="https://cdn-icons-png.flaticon.com/512/4113/4113006.png"
                        alt=""
                    />

                    {/* HEADER CENTRALIZADO */}
                    <div className="header">
                        <h1 className="nav-title">Eventos do Clube</h1>
                    </div>

                    <section className="section-event">
                        {eventList
                            .sort((a, b) => a.date - b.date)
                            .map((event, id) => (
                                <div
                                    className="card-event"
                                    key={id}
                                >
                                    {/* ÁREA PRINCIPAL DO CARD */}
                                    <div
                                        className="card-content"
                                        onClick={() => handleEvent(event)}
                                    >
                                        <div className="image">
                                            <img
                                                src="https://cdn-icons-png.flaticon.com/512/10691/10691802.png"
                                                alt=""
                                            />
                                        </div>

                                        <div className="info">
                                            <h3>{event.name}</h3>

                                            <div className="sub-info">
                                                <span>
                                                    <small>Valor</small>
                                                    <strong>{convertValue(parseFloat(event.value).toFixed(2))}</strong>
                                                </span>

                                                <span>
                                                    <small>Data</small>
                                                    <strong>
                                                        {event.date.split('-')[2]}/
                                                        {event.date.split('-')[1]}/
                                                        {event.date.split('-')[0]}
                                                    </strong>
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* BOTÃO LATERAL DE EDIÇÃO */}
                                    <div
                                        className="card-edit"
                                        onClick={(e) => handleEditEvent(event, e)}
                                        aria-label="Editar evento"
                                    >
                                        ✏️
                                    </div>
                                </div>
                            ))}
                    </section>

                    <footer className="add-event">
                        <div
                            className="plus-icon"
                            onClick={handleRegisterEvent}
                            aria-label="add"
                        >
                            +
                        </div>
                    </footer>
                </div>

                <Snackbar
                    open={open}
                    autoHideDuration={2000}
                    onClose={() => setOpen(false)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert severity="success" variant="filled">
                        {alertMessage}
                    </Alert>
                </Snackbar>
            </div>
        </>
    );
};

export default ClubEvents;
