import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { TextField, Button, FormControl } from "@mui/material";
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

import api from '../../services/api';

import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import './style.scss';
import Nav from '../../components/Nav';

const EventRegister = () => {

    const clubId = sessionStorage.getItem("clubId");

    const navigate = useNavigate();

    function handleUnit(unit) {
        sessionStorage.setItem("unitId", unit.id);
        navigate("/statistics/unit/history");
    }

    function handleBack() {
        navigate("/statistics");
    }

    const [value, setValue] = React.useState(dayjs(new Date()));

    const handleChange = (newValue) => {
        setValue(newValue);
    };


    return (
      <>
        <div className="container-event">
            <div className="sub-container-event">
                <Nav handleBack={handleBack}/>
                <img className="logo" src='https://cdn-icons-png.flaticon.com/512/5987/5987625.png' alt=""/>
                <h1 className="nav-title">Cadastrar Evento</h1>
                <section className="section">
                    <FormControl className='form-event'>
                        <TextField id="outlined-basic" label="Nome do Evento" variant="outlined" className='event-field' />
                        <TextField id="outlined-basic" label="Valor por pessoa" variant="outlined" className='event-field' />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DesktopDatePicker
                                className='event-field'
                                label="Data do Evento"
                                inputFormat="DD/MM/YYYY"
                                value={value}
                                onChange={handleChange}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                        <Button className="bt-event-register" variant="contained" onClick={() => {}}>Cadastrar Evento</Button>
                    </FormControl>
                </section>
            </div>
        </div>
      </>
    )
  };
  
  export default EventRegister;