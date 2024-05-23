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

        if (valid) {
            var data = {
                'name': eventName,
                'value': parseFloat(eventValue.replace('.', '').replace(',', '.')),
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
            var errorMsg = '';
            if (errors.length > 1) {
                errorMsg = 'Os campos ';
                errors.forEach((e, p) => errorMsg = (errorMsg + ((p === errors.length - 1) ? ' e ' : (p !== 0) ? ', ' : '') + e))
                errorMsg = errorMsg + ' devem ser informados.'
            } else {
                errorMsg = 'O campo ' + errors[0] + ' deve ser informado.'
            }
            alert(errorMsg);
        }

    }

    const handleChange = (e) => {
        const input = e.target.value;

        // Remove caracteres não numéricos e zeros a esquerda
        let numericValue = input.replace(/[^\d]/g, '');
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

        console.log(result)
        // Atualiza os estados com os valores
        setEventValue(result);
    };

    useEffect(() => {
        if (eventName !== '' && eventName !== null) {
            setEventNameValid(false);
        }
        if (eventValue !== '' && eventValue !== null) {
            setEventValueValid(false);
        }
    }, [eventName, eventValue]);

    return (
        <>
            <div className="container-event">
                <div className="sub-container-event">
                    <Nav handleBack={handleBack} />
                    <img className="logo" src='https://cdn-icons-png.flaticon.com/512/5987/5987625.png' alt="" />
                    <h1 className="nav-title-event">Cadastrar Evento</h1>
                    <section className="section">
                        <form className='form-event'>
                            <TextField id="outlined-basic" label="Nome do Evento" error={eventNameValid} variant="outlined" className='event-field' value={eventName} onChange={e => setEventName(e.target.value)} />
                            <TextField id="outlined-basic" label="Valor por pessoa" variant="outlined" className='event-field'
                                error={eventValueValid}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                    inputMode: 'numeric', pattern: '[0-9]*'
                                }}
                                value={eventValue} onChange={handleChange} />
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