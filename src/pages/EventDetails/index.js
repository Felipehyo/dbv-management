import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { TextField, Button, InputLabel, MenuItem, FormControl, Select } from "@mui/material";
import api from '../../services/api';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import './style.scss';
import Nav from '../../components/Nav';

import AddUser from '../../assets/add-user.png';

const EventDetails = () => {

    const [ userRegister, setUserRegisterList ] = useState([]);
    const [ event, setEvent ] = useState([]);

    const eventId = sessionStorage.getItem("eventId");
    const navigate = useNavigate();

    function handleBack() {
        navigate("/event");
    }

    function handleUserRegister() {
        // navigate("/score");
    }

    function handleRegisterUserEvent() {
        navigate("/event/details/user-register");
    }

    function convertDate(dataOriginal) {

        // Criar um objeto Date a partir da string
        var data = new Date(dataOriginal);

        // Extrair os componentes da data (mês, dia, ano)
        var dia = data.getDate() + 1;
        var mes = data.getMonth() + 1; // Mês é baseado em zero, então adicionamos 1
        var ano = data.getFullYear();

        // Formatar a string no formato desejado ("MM/DD/YYYY")
        return dia.toString().padStart(2, '0') + '/' + mes.toString().padStart(2, '0') + '/' + ano;
        // return dataOriginal;
    }

    const BorderLinearProgress = styled(LinearProgress)(({ theme, value }) => ({
        height: 10,
        borderRadius: 5,
        [`&.${linearProgressClasses.colorPrimary}`]: {
          backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
        },
        [`& .${linearProgressClasses.bar}`]: {
          borderRadius: 5,
          backgroundColor: value === 100 ? '#63B75B' : '#FFBC3A',
        },
      }));

    useEffect(() => {

        api.get('event/' + eventId).then(response => {
            setEvent(response.data);
        });

        api.get('event/register/' + eventId).then(response => {
            setUserRegisterList(response.data);
        });

    }, [eventId]);

    return (
        <>
            <div className="container-events-details">
                <div className="sub-container-events">
                    <Nav handleBack={handleBack}/>
                    <img className="logo" src='https://cdn-icons-png.flaticon.com/512/4113/4113006.png' alt=""/>
                    <h1 className="nav-title">{event.event}</h1>
                    <div className='values first'>
                        <p><b>Valor pessoa:</b> R${parseFloat(event.value).toFixed(2)}</p>
                        <p><b>Inscritos:</b> {userRegister.length}</p>
                    </div>
                    <div className='values second'>
                        <p><b>A receber:</b> R${parseFloat(event.value * userRegister.length).toFixed(2)}</p>
                        <p><b>Data:</b> {convertDate(event.date)}</p>
                    </div>
                    <div className='total'>
                        <p><b>Total Recebido:</b> R${parseFloat(event.bank).toFixed(2)}</p>
                    </div>
                    {/* <div className='line'></div> */}
                    {/* <h2 className="sub-title">Inscritos no Evento</h2> */}
                    <section className="section">
                    {
                        userRegister.sort((a, b) => a.user - b.user).map((userRegister, id) => (
                            <div className="card" key={id} onClick={() => handleUserRegister(userRegister)}>
                                <div className="image">
                                    <img src={userRegister.userGender === 'MALE' ? "https://cdn-icons-png.flaticon.com/512/2922/2922506.png" : "https://cdn-icons-png.flaticon.com/512/2922/2922566.png"} alt={"flatIcon"}/>
                                </div>
                                <div className="info">
                                    <div className="content">
                                        <h2>{userRegister.user.split(" ").slice(0, 3).join(" ")}</h2>
                                    </div>
                                    <div className='progress-bar'>
                                        <Box sx={{ flexGrow: 1, percentage: 100 }}>
                                            <BorderLinearProgress variant="determinate" value={userRegister.percentagePayment} />
                                        </Box>
                                    </div>
                                    <div className='user-total'>
                                        <p>R${parseFloat(userRegister.eventAllocatedAmount).toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                    </section>
                    <div className='register-user'>
                        <img className="plus" src={'https://cdn-icons-png.flaticon.com/512/1487/1487117.png'} alt="" onClick={handleRegisterUserEvent}/>
                    </div>
                </div>
            </div>
        </>
    )
};
  
export default EventDetails;