import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NumberFormat from 'react-number-format';
import { TextField, Button, InputLabel, MenuItem, FormControl, Select, InputAdornment } from "@mui/material";
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

import api from '../../services/api';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import './style.scss';
import Nav from '../../components/Nav';

const PaymentRegister = () => {

    const clubId = sessionStorage.getItem("clubId");

    const [paymentValue, setPaymentValue] = useState('');
    const [paymentDate, setEventDate] = useState(null);
    const [payerUserSelected, setPayerUserSelected] = useState('');
    const [eventSelected, setEventSelected] = useState('');
    const [paymentType, setPaymentType] = useState('');

    const [clubUsers, setClubUsers] = useState([]);
    const [clubEvents, setClubEvents] = useState([]);

    const [paymentValueValid, setPaymentValueValid] = useState(false);
    const [payerUserValid, setPayerUserValid] = useState(false);
    const [paymentTypeValid, setPaymentTypeValid] = useState(false);

    const navigate = useNavigate();

    function handleBack() {
        navigate("/treasury");
    }

    function handleRegister() {

        var valid = true;
        var errors = [];

        if (paymentValue === '' || paymentValue === null) {
            setPaymentValueValid(true);
            errors.push('valor')
            valid = false;
        }

        if (payerUserSelected === '' || payerUserSelected === null) {
            setPayerUserValid(true);
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
                'value': parseFloat(paymentValue),
                'formOfPayment': paymentType,
                'date': paymentDate,
                'clubId': clubId,
                'userId': payerUserSelected,
                'eventId': eventSelected
            }

            api.post('/payment', data).then(reponse => {
                alert('Pagamento registrado com sucesso!');
                navigate('/treasury');
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

    const [tempValue, setTempValue] = useState('');

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
        if (payerUserSelected !== '' && payerUserSelected !== null) {
            setPayerUserValid(false);
        }
        if (paymentType !== '' && paymentType !== null) {
            setPaymentTypeValid(false);
        }
    }, [paymentValue, payerUserSelected, paymentType]);

    useEffect(() => {
        api.get('user/club/' + clubId).then(response => {
            setClubUsers(response.data);
        });

        api.get('event/club/' + clubId).then(response => {
            setClubEvents(response.data);
        });
    }, [clubId]);

    return (
        <>
            <div className="container-event">
                <div className="sub-container-event">
                    <Nav handleBack={handleBack} />
                    <img className="logo" src='https://cdn-icons-png.flaticon.com/512/3258/3258583.png' alt="" />
                    <h1 className="nav-title-event">Registrar Pagamento</h1>
                    <section className="section">
                        <form className='form-event'>
                            <TextField id="outlined-basic" label="Valor" variant="outlined" className='event-field'
                                error={paymentValueValid}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                    inputMode: 'numeric', pattern: '[0-9]*'
                                }}
                                value={paymentValue} onChange={handleChange} />
                            <FormControl size='medium' className='event-field'>
                                <InputLabel id="payer">Usuário Pagador</InputLabel>
                                <Select
                                    labelId="payer-label"
                                    error={payerUserValid}
                                    id="debtor-select"
                                    value={payerUserSelected}
                                    label="Usuário Pagador"
                                    onChange={e => { setPayerUserSelected(e.target.value) }}>
                                    <MenuItem value={''}>Selecionar</MenuItem>
                                    {clubUsers.map((data) => (
                                        <MenuItem key={data.id} value={data.id}>{data.name}</MenuItem>
                                    ))}
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
                            <FormControl className='event-field' size='medium' fullWidth>
                                <InputLabel id="form-of-payment-label">Forma de Pagamento</InputLabel>
                                <Select
                                    labelId="form-of-payment-label"
                                    id="form-of-payment-select"
                                    error={paymentTypeValid}
                                    value={paymentType}
                                    label="Forma de Pagamento"
                                    onChange={e => setPaymentType(e.target.value)}>
                                    <MenuItem value={''}>Selecionar</MenuItem>
                                    <MenuItem value={'PIX'}>Pix</MenuItem>
                                    <MenuItem value={'CASH'}>Dinheiro</MenuItem>
                                    <MenuItem value={'CHURCH'}>Igreja</MenuItem>
                                </Select>
                            </FormControl>
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
                            <Button className="bt-event-register" variant="contained" onClick={handleRegister}>Registrar Pagamento</Button>
                        </form>
                    </section>
                </div>
            </div>
        </>
    )
};

export default PaymentRegister;