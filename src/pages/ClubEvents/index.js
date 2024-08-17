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
    const [checked, setChecked] = useState(true);

    const navigate = useNavigate();

    const [open, setOpen] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState("");

    function handleEvent(event) {
        sessionStorage.setItem("eventId", event.id);
        navigate("/event/details");
    }

    const handleChange = (event) => {
        setChecked(event.target.checked);
        if(checked) {
            setEventList(allEventList);
        } else {
            setEventList(futureEventList);
        }
        
    };

    const handleClick = (message) => {
        setAlertMessage(message);
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
        sessionStorage.setItem('startAlert', "")
    };

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
        api.get('event/club/' + clubId + "?showOnlyFutureDate=true").then(response => {
            setEventList(response.data);
            setFutureEventList(response.data);
        })
        api.get('event/club/' + clubId + "?showOnlyFutureDate=false").then(response => {
            setAllEventList(response.data);
        })
        var alertEditSuccess = sessionStorage.getItem('startAlert');
        if (alertEditSuccess!= null && alertEditSuccess.trim() != "") {
            handleClick(alertEditSuccess);
        }
        // var futureCheck = sessionStorage.getItem('futureCheck');
        // if(futureCheck != null && futureCheck != "") {
        //     if(futureCheck) {
        //         setEventList(allEventList);
        //         setChecked(true);
        //     } else {
        //         setEventList(futureEventList);
        //         setChecked(false);
        //     }
        // }
    }, []);

    const label = { inputProps: { 'aria-label': 'Switch demo' } };

    return (
        <>
            <div className="default-container">
                <div className="sub-container-club-events">
                    <Nav handleBack={handleBack} />
                    <img className="logo" src='https://cdn-icons-png.flaticon.com/512/4113/4113006.png' alt="" />
                    <FormGroup className='old-events'>
                        <FormControlLabel control={
                            <Switch 
                                checked={checked}
                                onChange={handleChange}
                                inputProps={{ 'aria-label': 'controlled' }}
                                color='success'
                            />}
                            label="Futuros"
                            // style={{ display: 'flex', flexDirection: 'row-reverse' }}
                            />
                    </FormGroup>
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
                                            <p><b>Data:</b> {event.date.split('-')[2] + "/" + event.date.split('-')[1] + "/" + event.date.split('-')[0]}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </section>
                    <footer className='add-event'>
                        <div className='plus-icon' onClick={handleRegisterEvent} aria-label="add">
                            <p>+</p>
                        </div>
                    </footer>
                </div>
                <div>
                    <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                        <Alert
                            onClose={handleClose}
                            severity="success"
                            variant="filled"
                            sx={{ width: '100%' }}
                        >
                            {alertMessage}
                        </Alert>
                    </Snackbar>
                </div>
            </div>
        </>
    )
};

export default ClubEvents;