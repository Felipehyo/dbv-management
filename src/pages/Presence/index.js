import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, Checkbox } from "@mui/material";
import { Search } from '@mui/icons-material';

import api from '../../services/api';

import Modal from '../../components/Modal';

import './style.scss';
import Logout from '../../assets/logout.png';

const Presence = () => {

    const [ userList, setUserList ] = useState([]);
    const [ userSelected, setUserSelected ] = useState([]);
    const [ todayUserList, setTodayUserList ] = useState([]);
    const [ operationType, setOperationtype ] = useState('');

    const [ bible, setBible ] = useState(false);
    const [ scarf, setScarf ] = useState(false);
    const [ activityNotebook, setActivityNotebook ] = useState(false);
    const [ bottle, setBottle ] = useState(false);
    const [ pencil, setPencil ] = useState(false);
    const [ cap, setCap ] = useState(false);
    const [ bibleStudy, setBibleStudy ] = useState(false);
    const [ all, setAll ] = useState(false);

    const navigate = useNavigate();

    function handlelogout() {
        sessionStorage.clear();
        navigate("/");
    }

    function openModal(user, operationType) {
        setOperationtype(operationType);
        document.querySelector('.modal-container').classList.add('show-modal');
        setUserSelected(user);
    }

    async function saveRegister() {

        const data = {
            "presenceType": operationType,
            "kit": {
                "scarf": scarf,
                "bible": bible,
                "activityNotebook": activityNotebook,
                "bottle": bottle,
                "cap": cap,
                "pencil": pencil,
                "bibleStudy": bibleStudy
            }
        }

        await api.post("presence/" + userSelected.id, data);
        closeModal();
        if(operationType == "ABSENT") {
            document.querySelector('#abscence-' + userSelected.id).classList.add('selected');
            document.querySelector('#presence-' + userSelected.id).classList.remove('selected');
        } else if (operationType == "PRESENT"){
            document.querySelector('#presence-' + userSelected.id).classList.add('selected');
            document.querySelector('#abscence-' + userSelected.id).classList.remove('selected');
        }
    }

    function closeModal() {
        setBible(false);
        setScarf(false);
        setActivityNotebook(false);
        setBottle(false);
        setPencil(false);
        setCap(false);
        setBibleStudy(false);
        document.querySelector('.modal-container').classList.remove('show-modal');
    }

    function handleSelectAll() {
        var check = all ? false : true;
        setAll(check);
        setBible(check);
        setScarf(check);
        setActivityNotebook(check);
        setBottle(check);
        setPencil(check);
        setCap(check);
        setBibleStudy(check);
    }

    useEffect(() => {

        api.get('presence/today').then(response => {
            setUserList(response.data);
        });

    }, []);

    return (
      <>
        <div className="container-presence">
            <div className="sub-container-presence">
                <div className='nav-presence' onClick={handlelogout}>
                    <img className="logout" src={Logout} alt=""/>
                </div>
                <img className="logo" src='https://cdn-icons-png.flaticon.com/512/3585/3585145.png' alt=""/>
                <h1 className="nav-title">Lista de Presen??a</h1>
                
                <div className='search'>
                    <input type={'text'} placeholder='Digite um nome'></input>
                    <img src='https://cdn-icons-png.flaticon.com/512/54/54481.png' alt=''/>
                </div>

                <section className="section-presence">
                    {
                        userList.map((data, id) => (
                            <div className='line-presence' key={id}>
                                <div className="card">
                                    <div className="person-info">
                                        <p className='person-name'>{data.user.name}</p>
                                    </div>
                                </div>

                                <button id={'abscence-' + data.user.id} 
                                    className={'bt-abscence' + (data.status === 'ABSENT' ? ' selected' : '')} 
                                    onClick={() => openModal(data.user, 'ABSENT')}>F</button>
                                <button id={'presence-' + data.user.id} 
                                    className={'bt-presence' + (data.status === 'PRESENT' ? ' selected' : '')}
                                    onClick={() => openModal(data.user, 'PRESENT')}>P</button>
                            </div>
                        ))
                    }
                </section>

                <Modal widht="330px" height="" onClick={closeModal} color={'#000'}>
                    { (operationType === 'ABSENT') ? (
                        <>
                            <h2>Marcar Falta</h2>
                            <div className='div-modal-info'>
                                <p>Marcar falta para <b>{userSelected.name}</b>?</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <h2>Marcar Presen??a</h2>
                            <div className='div-modal-info'>
                                <div>
                                    <p><Checkbox className='check' checked={bible} onChange={() => setBible(bible ? false : true)}/>Biblia</p>
                                    <p><Checkbox className='check' checked={scarf} onChange={() => setScarf(scarf ? false : true)} />Len??o</p>
                                    <p><Checkbox className='check' checked={activityNotebook} onChange={() => setActivityNotebook(activityNotebook ? false : true)} />Caderno de atividades</p>
                                    <p><Checkbox className='check' checked={bottle} onChange={() => setBottle(bottle ? false : true)} />Garrafa de ??gua</p>
                                    <p><Checkbox className='check' checked={pencil} onChange={() => setPencil(pencil ? false : true)} />Lapis ou caneta</p>
                                    <p><Checkbox className='check' checked={cap} onChange={() => setCap(cap ? false : true)} />Bon??</p>
                                    <p><Checkbox className='check' checked={bibleStudy} onChange={() => setBibleStudy(bibleStudy ? false : true)} />Estudo B??blico</p>
                                    <br></br>
                                    <p><Checkbox className='check' checked={all} onChange={handleSelectAll}/>Selecionar todos</p>
                                </div>
                                <p>Marcar presen??a para <b>{userSelected.name}</b>?</p>
                            </div>
                        </>
                    )}

                    <div className='bts-modal'>
                        <Button className='bts-modal-cancel' variant="contained" onClick={closeModal}>Cancelar</Button>
                        <Button className='bts-modal-confirm' variant="contained" onClick={saveRegister}>Confirmar</Button>
                    </div>
                </Modal>
            </div>
        </div>
      </>
    )
  };
  
  export default Presence;