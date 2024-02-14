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

const UserEdit = () => {

    const clubId = sessionStorage.getItem("clubId");
    const userIdEdit = sessionStorage.getItem("userIdEdit");

    const [clubUnits, setClubUnits] = useState([]);

    const [userName, setUserName] = useState('');
    const [userNameValid, setUserNameValid] = useState(false);

    const [userType, setUserType] = useState('');
    const [userTypeValid, setUserTypeValid] = useState(false);

    const [gender, setGender] = useState('');
    const [genderValid, setGenderValid] = useState(false);

    const [unitSelected, setUnitSelected] = useState('');
    const [userBirthdate, setUserBirthdate] = useState(null);

    const [status, setStatus] = useState('');
    const [statusValid, setStatusValid] = useState(false);

    const navigate = useNavigate();

    function handleBack() {
        navigate("/user");
    }

    function handleEdit() {

        var valid = true;
        var errors = [];

        if (userName === '' || userName === null) {
            setUserNameValid(true);
            errors.push('nome')
            valid = false;
        }

        if (userType === '' || userType === null) {
            setUserTypeValid(true);
            errors.push('tipo de usuário')
            valid = false;
        }

        if (gender === '' || gender === null) {
            setGenderValid(true);
            errors.push('gênero')
            valid = false;
        }

        // if (userBirthdate === '' || userBirthdate === null) {
        //     errors.push('data de nascimento')
        //     valid = false;
        // }

        if (valid) {
            var data = {
                'name': userName,
                'userType': userType,
                'gender': gender,
                'unitId': unitSelected,
                'birthDate': userBirthdate,
                'active': status,
                'clubId': clubId,
            }

            api.put('/user/' + userIdEdit, data).then(reponse => {
                alert('Usuário atualizado com sucesso!');
                navigate('/user');
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

    useEffect(() => {
        if (userName !== '' && userName !== null) {
            setUserNameValid(false);
        }
        if (userType !== '' && userType !== null) {
            setUserTypeValid(false);
        }
        if (gender !== '' && gender !== null) {
            setGenderValid(false);
        }
    }, [userName, userType, gender]);

    useEffect(() => {

        api.get('/user/' + userIdEdit).then(response => {
            setUserName(response.data.name)
            setUserType(response.data.userType)
            setGender(response.data.gender)
            if(response.data.unitId != null) setUnitSelected(response.data.unitId)
            setUserBirthdate(response.data.birthDate)
            setStatus(response.data.active)
        });

        api.get('unit/club/' + clubId).then(response => {
            setClubUnits(response.data);
        });

    }, [clubId]);

    return (
        <>
            <div className="container-payment-register">
                <div className="sub-container-payment-register">
                    <Nav handleBack={handleBack} />
                    <img className="logo" src='https://cdn-icons-png.flaticon.com/512/1165/1165725.png' alt="" />
                    <h1 className="nav-title">Editar Usuário</h1>
                    <section className="section">
                        <form className='form-event'>
                            <TextField id="outlined-basic" label="Nome do Usuário" error={userNameValid} variant="outlined" className='event-field' value={userName} onChange={e => setUserName(e.target.value)} />
                            <FormControl className='event-field' size='medium' fullWidth>
                                <InputLabel id="form-of-payment-label">Tipo de Usuário</InputLabel>
                                <Select
                                    labelId="form-of-payment-label"
                                    id="form-of-payment-select"
                                    error={userTypeValid}
                                    value={userType}
                                    label="Tipo de Usuário"
                                    onChange={e => setUserType(e.target.value)}>
                                    <MenuItem value={''}>Selecionar</MenuItem>
                                    <MenuItem value={'PATHFINDER'}>Desbravador</MenuItem>
                                    <MenuItem value={'DIRECTION'}>Diretoria</MenuItem>
                                    <MenuItem value={'EVENTUAL'}>Eventual</MenuItem>
                                    <MenuItem value={'EXECUTIVE'}>Executiva</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl className='event-field' size='medium' fullWidth>
                                <InputLabel id="form-of-payment-label">Gênero</InputLabel>
                                <Select
                                    labelId="form-of-payment-label"
                                    id="form-of-payment-select"
                                    error={genderValid}
                                    value={gender}
                                    label="Gênero"
                                    onChange={e => setGender(e.target.value)}>
                                    <MenuItem value={''}>Selecionar</MenuItem>
                                    <MenuItem value={'MALE'}>Masculino</MenuItem>
                                    <MenuItem value={'FEMININE'}>Feminino</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl className='event-field' size='medium' fullWidth>
                                <InputLabel id="event-label">Unidade</InputLabel>
                                <Select
                                    labelId="event-label"
                                    id="event-select"
                                    value={unitSelected}
                                    label="Unidade"
                                    onChange={e => setUnitSelected(e.target.value)}>
                                    <MenuItem value={''}>Selecionar</MenuItem>
                                    {clubUnits.map((data) => (
                                        <MenuItem key={data.id} value={data.id}>{data.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DesktopDatePicker
                                    className='event-field'
                                    label="Data de Nascimento"
                                    inputFormat="DD/MM/YYYY"
                                    value={userBirthdate}
                                    onChange={value => setUserBirthdate(value)}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                            <FormControl className='event-field' size='medium' fullWidth>
                                <InputLabel id="form-of-payment-label">Status</InputLabel>
                                <Select
                                    labelId="form-of-payment-label"
                                    id="form-of-payment-select"
                                    error={statusValid}
                                    value={status}
                                    label="Status"
                                    onChange={e => setStatus(e.target.value)}>
                                    <MenuItem value={'true'}>Ativo</MenuItem>
                                    <MenuItem value={'false'}>Inativo</MenuItem>
                                </Select>
                            </FormControl>
                            <Button className="bt-event-register" variant="contained" onClick={handleEdit}>Salvar Usuário</Button>
                        </form>
                    </section>
                </div>
            </div>
        </>
    )
};

export default UserEdit;