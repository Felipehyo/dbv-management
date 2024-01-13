import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { TextField, Button, InputAdornment } from "@mui/material";
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

import api from '../../services/api';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import './style.scss';
import Nav from '../../components/Nav';

const EventRegister = () => {

    const clubId = sessionStorage.getItem("clubId");

    const [eventName, setEventName] = useState('');
    const [eventValue, setEventValue] = useState('');
    const [eventDate, setEventDate] = useState(null);

    const [eventNameValid, setEventNameValid] = useState(false);
    const [eventValueValid, setEventValueValid] = useState(false);

    const navigate = useNavigate();

    function handleBack() {
        navigate("/event");
    }

    function handleRegister() {

        var valid = true;
        var errors = [];

        if (eventName === '' || eventName === null) {
            setEventNameValid(true);
            errors.push('nome do evento')
            valid = false;
        }

        if (eventValue === '' || eventValue === null) {
            setEventValueValid(true);
            errors.push('valor')
            valid = false;
        }

        if (eventDate === '' || eventDate === null) {
            errors.push('data')
            valid = false;
        }

        if(valid) {
            var data = {
                'name': eventName,
                'value': eventValue,
                'date': eventDate,
                'clubId': clubId
            }
    
            api.post('/event', data).then(reponse => {
                alert('Evento cadastrado com sucesso!');
                navigate("/event");
            }).catch(error => {
                alert(error);
            })
        } else {
            console.log('aqui')
            var errorMsg = '';
            if(errors.length > 1) {
                errorMsg = 'Os campos ';
                errors.forEach((e, p) => errorMsg = (errorMsg + ((p === errors.length-1) ? ' e ': (p !== 0) ? ', ': '') + e))
                errorMsg = errorMsg + ' devem ser informados.'
            } else {
                errorMsg = 'O campo ' + errors[0] + ' deve ser informado.'
            }
            alert(errorMsg);
        }

    }

    useEffect(() => {
        if(eventName !== '' && eventName !== null) {
            setEventNameValid(false);
        }
        if(eventValue !== '' && eventValue !== null) {
            setEventValueValid(false);
        }
    }, [eventName, eventValue]);

    return (
      <>
        <div className="container-event">
            <div className="sub-container-event">
                <Nav handleBack={handleBack}/>
                <img className="logo" src='https://cdn-icons-png.flaticon.com/512/5987/5987625.png' alt=""/>
                <h1 className="nav-title-event">Cadastrar Evento</h1>
                <section className="section">
                    <form className='form-event'>
                        <TextField id="outlined-basic" label="Nome do Evento" error={eventNameValid} variant="outlined" className='event-field' value={eventName} onChange={e => setEventName(e.target.value)} />
                        <TextField id="outlined-basic" label="Valor por pessoa" type={'number'} variant="outlined"  className='event-field' 
                            error={eventValueValid}
                            InputProps={eventValue !== '' ? {
                                startAdornment: <InputAdornment position="start">R$</InputAdornment>
                            } : null}
                        value={eventValue} onChange={e => setEventValue(e.target.value)} />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DesktopDatePicker
                                className='event-field'
                                label="Data do Evento"
                                inputFormat="DD/MM/YYYY"
                                value={eventDate}
                                onChange={value => setEventDate(value)}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                        <Button className="bt-event-register" variant="contained" onClick={handleRegister}>Cadastrar Evento</Button>
                    </form>
                </section>
            </div>
        </div>
      </>
    )
  };
  
  export default EventRegister;