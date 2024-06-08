import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, InputLabel, MenuItem, FormControl, Select, InputAdornment } from "@mui/material";
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

import api from '../../services/api';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import './style.scss';
import Nav from '../../components/Nav';

const CashBookRegister = () => {

    const clubId = sessionStorage.getItem("clubId");

    const [paymentValue, setPaymentValue] = useState('');
    const [paymentDate, setEventDate] = useState(null);
    const [description, setDescription] = useState('');
    const [paymentType, setPaymentType] = useState('');

    const [paymentValueValid, setPaymentValueValid] = useState(false);
    const [descriptionValid, setDescriptionValid] = useState(false);
    const [paymentTypeValid, setPaymentTypeValid] = useState(false);

    const [eventSelected, setEventSelected] = useState('');
    const [clubEvents, setClubEvents] = useState([]);

    const navigate = useNavigate();

    function handleBack() {
        navigate("/treasury/cash-book");
    }

    function handleRegister() {

        var valid = true;
        var errors = [];

        if (paymentValue === '' || paymentValue === null) {
            setPaymentValueValid(true);
            errors.push('valor')
            valid = false;
        }

        if (description === '' || description === null) {
            setDescriptionValid(true);
            errors.push('usuário')
            valid = false;
        }

        if (paymentType === '' || paymentType === null) {
            setPaymentTypeValid(true);
            errors.push('forma de pagamento')
            valid = false;
        }

        if (paymentDate === '' || paymentDate === null) {
            errors.push('data do pagamento')
            valid = false;
        }

        if (valid) {
            var data = {
                'type': paymentType,
                'description': description,
                'date': paymentDate,
                'eventId': (eventSelected != null) ? eventSelected : null,
                'value': parseFloat(paymentValue.replace('.', '').replace(',', '.')),
                'clubId': clubId,
            }
            console.log(data)

            api.post('/cash-book', data).then(reponse => {
                alert('Registrado com sucesso!');
                navigate('/treasury/cash-book');
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

        // Atualiza os estados com os valores
        setPaymentValue(result);
    };

    useEffect(() => {
        if (paymentValue !== '' && paymentValue !== null) {
            setPaymentValueValid(false);
        }
        if (paymentType !== '' && paymentType !== null) {
            setPaymentTypeValid(false);
        }
        if (description !== '' && description !== null) {
            setDescriptionValid(false);
        }
    }, [paymentValue, description, paymentType]);

    useEffect(() => {

        api.get('event/club/' + clubId).then(response => {
            setClubEvents(response.data);
        });

    }, [clubId]);

    return (
        <>
            <div className="default-container">
                <div className="sub-container-cash-book-register">
                    <Nav handleBack={handleBack} />
                    <img className="logo" src='https://cdn-icons-png.flaticon.com/512/3561/3561384.png' alt="" />
                    <h1 className="nav-title-event">Entradas e Saídas</h1>
                    <section className="section">
                        <form className='form-event'>
                            <TextField id="outlined-basic" label="Valor" variant="outlined" className='event-field'
                                error={paymentValueValid}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                    inputMode: 'numeric', pattern: '[0-9]*'
                                }}
                                value={paymentValue} onChange={handleChange} />
                            <FormControl className='event-field' size='medium' fullWidth>
                                <InputLabel id="form-of-payment-label">Tipo de Registro</InputLabel>
                                <Select
                                    labelId="form-of-payment-label"
                                    id="form-of-payment-select"
                                    error={paymentTypeValid}
                                    value={paymentType}
                                    label="Tipo de Registro"
                                    onChange={e => setPaymentType(e.target.value)}>
                                    <MenuItem value={''}>Selecionar</MenuItem>
                                    <MenuItem value={'INPUT'}>Entrada</MenuItem>
                                    <MenuItem value={'OUTPUT'}>Saída</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl className='event-field' size='medium' fullWidth>
                                <InputLabel id="event-label">Evento Relacionado</InputLabel>
                                <Select
                                    labelId="event-label"
                                    id="event-select"
                                    value={eventSelected}
                                    label="Evento Relacionado"
                                    onChange={e => setEventSelected(e.target.value)}>
                                    <MenuItem value={''}>Selecionar</MenuItem>
                                    {clubEvents.map((data) => (
                                        <MenuItem key={data.id} value={data.id}>{data.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField id="outlined-basic" label="Descrição" variant="outlined" className='event-field'
                                onChange={e => setDescription(e.target.value)}
                                multiline
                                error={descriptionValid}
                                rows={4}
                                value={description} />
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DesktopDatePicker
                                    className='event-field'
                                    label="Data do Pagamento"
                                    inputFormat="DD/MM/YYYY"
                                    value={paymentDate}
                                    onChange={value => setEventDate(value)}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                            <Button className="bt-event-register" variant="contained" onClick={handleRegister}>Registrar</Button>
                        </form>
                    </section>
                </div>
            </div>
        </>
    )
};

export default CashBookRegister;