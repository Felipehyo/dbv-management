import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { TextField, Button, InputAdornment, InputLabel, MenuItem, FormControl, Select } from "@mui/material";
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import api from '../../services/api';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import './style.scss';
import Nav from '../../components/Nav';

const EventEdit = () => {

    const clubId = sessionStorage.getItem("clubId");
    const eventId = sessionStorage.getItem("eventId");

    const [eventName, setEventName] = useState('');
    const [eventValue, setEventValue] = useState('');
    const [eventDate, setEventDate] = useState(null);
    const [eventActive, setEventActive] = useState(false);

    const [eventNameValid, setEventNameValid] = useState(false);
    const [eventValueValid, setEventValueValid] = useState(false);

    const navigate = useNavigate();

    function handleBack() {
        navigate("/event");
    }

    function handleUpdate() {

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
                'active': eventActive,
                'clubId': clubId
            }

            api.patch('/event/' + eventId, data).then(reponse => {
                sessionStorage.setItem('startAlert', "O Evento foi atualizado com sucesso!");
                setTimeout(() => {
                    setAlertMessage('');
                    setOpen(false);
                    sessionStorage.setItem('startAlert', "");
                }, 500);
                navigate("/event");
            }).catch(error => {
                setSeverity("error");
                handleClick(error.response.data.details);
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
            setSeverity("error");
            handleClick(errorMsg);
        }

    }

    const handleChange = (e) => {
        setEventValue(formatAmount(e.target.value));
    };

    function formatAmount(input) {

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
        } else {
            let decimal = value.substr(value.length - 2);
            let hundred = value.substr(value.length - 5);
            let thousand = value.slice(0, - 5);
            result = thousand + "." + hundred.slice(0, -2) + "," + decimal;
        }

        return result;
    }

    const convertValue = (e) => {
        let numericValue = e.replace(/[^\d]/g, '');
        let value = numericValue.replace(/^0+/, '');

        if (value.length === 0) return "0,00";
        if (value.length === 1) return "0,0" + value;
        if (value.length === 2) return "0," + value;

        return value.slice(0, -2) + "," + value.slice(-2);
    };

    const [alertMessage, setAlertMessage] = useState('');
    const [severity, setSeverity] = useState('info');
    const [open, setOpen] = React.useState(false);

    const handleClick = (message) => {
        setAlertMessage(message);
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);

        setTimeout(() => {
            setAlertMessage('');
        }, 500);
    };

    useEffect(() => {
        api.get('/event/' + eventId).then(response => {
            setEventName(response.data.name);
            var value = convertValue(parseFloat(response.data.value).toFixed(2));
            setEventValue(value);
            setEventDate(response.data.date);
            setEventActive(response.data.active);
        });
    }, [eventId]);

    return (
        <>
            <div className="container-event">
                <div className="sub-container-event">
                    <Nav handleBack={handleBack} />
                    <img className="logo" src='https://cdn-icons-png.flaticon.com/512/4113/4113006.png' alt="" />
                    <h1 className="nav-title-event">Editar Evento</h1>
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
                            <FormControl className='event-field' size='medium' fullWidth>
                                <InputLabel id="event-status">Status</InputLabel>
                                <Select
                                    labelId="event-status"
                                    id="event-status"
                                    value={eventActive}
                                    label="Status"
                                    onChange={e => setEventActive(e.target.value)}>
                                    <MenuItem value={'true'}>Ativo</MenuItem>
                                    <MenuItem value={'false'}>Inativo</MenuItem>
                                </Select>
                            </FormControl>
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
                            <Button className="bt-event-register" variant="contained" onClick={handleUpdate}>Atualizar Evento</Button>
                        </form>
                    </section>
                </div>
                <div>
                    <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                        <Alert
                            onClose={handleClose}
                            severity={severity}
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

export default EventEdit;