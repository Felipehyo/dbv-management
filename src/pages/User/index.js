import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

import './style.scss';
import Nav from '../../components/Nav';

const User = () => {

    const [userList, setUserList] = useState([]);
    const [directionList, setDirectionList] = useState([]);
    const [eventualList, setEventualList] = useState([]);
    const [pathfinderList, setPathfinderList] = useState([]);

    const [userType, setUserType] = useState('PATHFINDER');

    const clubId = sessionStorage.getItem("clubId");
    const navigate = useNavigate();

    function handleBack() {
        navigate("/home");
    }

    function handleRegisterUser() {
        navigate("/user/register");
    }

    function handleEditUser(id) {
        sessionStorage.setItem('userIdEdit', id);
        navigate("/user/edit");
    }

    function getUsersByType(inputUserType) {
        setUserType(inputUserType);
    }

    useEffect(() => {
        switch (userType) {
            case 'PATHFINDER':
                setUserList(pathfinderList);
                break;
            case 'DIRECTION':
                setUserList(directionList);
                break;
            case 'EVENTUAL':
                setUserList(eventualList);
                break;
        }
    }, [userType]);

    useEffect(() => {
        api.get('/user?clubId=' + clubId + '&onlyActives=false').then(response => {

            let directionUsers = [];
            let pathfinderUsers = [];
            let eventualUsers = [];
            
            response.data.forEach(user => {
                if(user.type == 'EXECUTIVE' || user.type == 'DIRECTION') {
                    directionUsers.push(user);
                } else if(user.type == 'PATHFINDER') {
                    pathfinderUsers.push(user);
                } else if(user.type == 'EVENTUAL'){
                    eventualUsers.push(user)
                }
            });

            setDirectionList(directionUsers);
            setEventualList(eventualUsers);
            setPathfinderList(pathfinderUsers);

            setUserList(pathfinderUsers);

        });
    }, [clubId]);

    return (
        <>
            <div className="default-container">
                <div className="sub-container-user">
                    <Nav handleBack={handleBack} />
                    <img className="logo" src={"https://cdn-icons-png.flaticon.com/512/1165/1165725.png"} alt="" />
                    <h1 className="nav-title">Usuários Cadastrados</h1>
                    <div className='bts'>
                        <button id={'pathfinder'}
                            className={'bt-pathfinder' + (userType === 'PATHFINDER' ? ' selected' : '')}
                            onClick={() => getUsersByType('PATHFINDER')}>Desbravadores</button>
                        <button id={'direction'}
                            className={'bt-direction' + (userType === 'DIRECTION' ? ' selected' : '')}
                            onClick={() => getUsersByType('DIRECTION')}>Diretoria</button>
                        <button id={'eventual'}
                            className={'bt-eventual' + (userType === 'EVENTUAL' ? ' selected' : '')}
                            onClick={() => getUsersByType('EVENTUAL')}>Eventuais</button>
                    </div>
                    <section className="section">
                        {
                            userList.sort((a, b) => a.name - b.name).map((user, id) => (
                                <div className="card" key={id} onClick={() => handleEditUser(user.id)}>
                                    <div className={'status' + (user.active ? ' active' : ' inactive')} />
                                    <div className="image">
                                        <img src={user.gender === 'MALE' ? "https://cdn-icons-png.flaticon.com/512/2922/2922506.png" : "https://cdn-icons-png.flaticon.com/512/2922/2922566.png"} alt={"flatIcon"} />
                                    </div>
                                    <div className="info">
                                        <div className="content">
                                            <div className='mid'>
                                                <h2>{user.name}</h2>
                                            </div>
                                            <div className='btn-edit'>
                                                <img className="edit" src={"https://cdn-icons-png.flaticon.com/512/2280/2280532.png"} alt="" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </section>
                    <div className='register-user'>
                        <img className="plus" src={'https://cdn-icons-png.flaticon.com/512/1487/1487117.png'} alt="" onClick={handleRegisterUser} />
                    </div>
                </div>
            </div>
        </>
    )
};

export default User;