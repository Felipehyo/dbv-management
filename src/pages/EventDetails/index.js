import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../../services/api';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';

import Nav from '../../components/Nav';
import './style.scss';

import SpeedDial from '../../components/SpeedDial/index.js';

import * as XLSX from 'xlsx';

const EventDetails = () => {

    const [userRegister, setUserRegisterList] = useState([]);
    const [directionUsers, setDirectionUsers] = useState([]);
    const [pathfinderUsers, setPathfinderUsers] = useState([]);
    const [eventualUsers, setEventualUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [event, setEvent] = useState([]);

    const [userType, setUserType] = useState('');

    const eventId = sessionStorage.getItem("eventId");
    const navigate = useNavigate();

    function handleBack() {
        sessionStorage.setItem("eventUserSelected", "");
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

    function getUsersByType(inputUserType) {
        setUserType(inputUserType);
        sessionStorage.setItem("eventUserSelected", inputUserType);
    }

    useEffect(() => {
        switch (userType) {
            case 'ALL':
                setUserRegisterList(allUsers);
                break;
            case 'PATHFINDER':
                setUserRegisterList(pathfinderUsers);
                break;
            case 'DIRECTION':
                setUserRegisterList(directionUsers);
                break;
            case 'EVENTUAL':
                setUserRegisterList(eventualUsers);
                break;
        }
    }, [userType]);

    useEffect(() => {

        

        api.get('event/' + eventId).then(response => {
            setEvent(response.data);
        });

        var sessionUserType = sessionStorage.getItem("eventUserSelected");

        if (sessionUserType == null || sessionUserType == "") {
            sessionUserType = "ALL";
            setUserType("ALL")
        } else {
            setUserType(sessionUserType.toString())
        }

        api.get('event/' + eventId + "/register").then(response => {
            setUserRegisterList(response.data);
            setAllUsers(response.data);

            let directionUsers = [];
            let pathfinderUsers = [];
            let eventualUsers = [];
            
            response.data.forEach(user => {
                if(user.userType == 'EXECUTIVE' || user.userType == 'DIRECTION') {
                    directionUsers.push(user);
                } else if(user.userType == 'PATHFINDER') {
                    pathfinderUsers.push(user);
                } else if(user.userType == 'EVENTUAL'){
                    eventualUsers.push(user)
                }
            });

            setDirectionUsers(directionUsers);
            setEventualUsers(eventualUsers);
            setPathfinderUsers(pathfinderUsers);
        });

    }, [eventId]);

    const handleDownload = () => {

        const customizedData = userRegister.map(item => ({
            'Nome': item.user,
            'Tipo de Usuário': item.userType,
            'Valor Pago': `${item.eventAllocatedAmount.toFixed(2)}`.replace('.', ","),
            'Valor Em Caixa': `${item.userBank.toFixed(2)}`.replace('.', ","),
        }));

        const wscols = [
            { wch: 35 },
            { wch: 15 },
            { wch: 15 },
            { wch: 15 },
        ];

        const worksheet = XLSX.utils.json_to_sheet(customizedData, { header: Object.keys(customizedData[0]) });

        worksheet['!cols'] = wscols;

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, event.event.length > 30 ? event.event.substring(0, 30) : event.event);
        XLSX.writeFile(workbook, `Extração ${event.event}.xlsx`);
    };

    return (
        <>
            <div className="default-container">
                <div className="sub-container-events">
                    <Nav handleBack={handleBack} />
                    <img className="logo" src='https://cdn-icons-png.flaticon.com/512/4113/4113006.png' alt="" />
                    <div className='title'>
                        <h1 className="nav-title">{event.event}</h1>
                    </div>
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
                    <div className='bts'>
                        <button id={'pathfinder'}
                            className={'bt' + (userType === 'ALL' ? ' selected' : '')}
                            onClick={() => getUsersByType('ALL')}>Todos</button>
                        <button id={'pathfinder'}
                            className={'bt default' + (userType === 'PATHFINDER' ? ' selected' : '')}
                            onClick={() => getUsersByType('PATHFINDER')}>Dbvs</button>
                        <button id={'direction'}
                            className={'bt default' + (userType === 'DIRECTION' ? ' selected' : '')}
                            onClick={() => getUsersByType('DIRECTION')}>Diretoria</button>
                        <button id={'eventual'}
                            className={'bt default' + (userType === 'EVENTUAL' ? ' selected' : '')}
                            onClick={() => getUsersByType('EVENTUAL')}>Eventuais</button>
                    </div>
                    <section className="section-event-details">
                        {
                            userRegister.sort((a, b) => a.user - b.user).map((userRegister, id) => (
                                <div className="card-event-details" key={id} onClick={() => handleUserRegister(userRegister)}>
                                    <div className="image">
                                        <img src={userRegister.userGender === 'MALE' ? "https://cdn-icons-png.flaticon.com/512/2922/2922506.png" : "https://cdn-icons-png.flaticon.com/512/2922/2922566.png"} alt={"flatIcon"} />
                                    </div>
                                    <div className="info">
                                        <div className="content">
                                            <h2>{userRegister.userName.split(" ").slice(0, 3).join(" ")}</h2>
                                        </div>
                                        <div className='progress-bar'>
                                            <Box sx={{ flexGrow: 1, percentage: 100 }}>
                                                <BorderLinearProgress variant="determinate" value={userRegister.percentagePayment} />
                                            </Box>
                                        </div>
                                        <div className='user-total'>
                                            <p>{userRegister.debtValue == '0.00' ? 'Pago' : 'R$' + parseFloat(userRegister.debtValue).toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </section>
                    <SpeedDial 
                    img1={'https://cdn-icons-png.flaticon.com/512/1487/1487117.png'}
                    handle1={handleRegisterUserEvent}
                    img2={'https://cdn-icons-png.flaticon.com/512/2504/2504768.png'}
                    handle2={() => handleDownload()}
                    />
                    {/* <div className='register-user'>
                        <img className="plus" src={'https://cdn-icons-png.flaticon.com/512/1487/1487117.png'} alt="" onClick={handleRegisterUserEvent} />
                    </div>
                    <div className='download-excel' onClick={() => handleDownload()}>
                        <img className='excel-icon' src='https://cdn-icons-png.flaticon.com/512/2504/2504768.png' alt="" />
                    </div> */}
                </div>
            </div>
        </>
    )
};

export default EventDetails;