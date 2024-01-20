import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

import './style.scss';
import Nav from '../../components/Nav';

const User = () => {

    const [ userList, setUserList ] = useState([]);

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

    useEffect(() => {
        api.get('/user/club/' + clubId + '?eventualUser=true&onlyActives=false').then(response => {
            setUserList(response.data);
        });
    }, [clubId]);

    return (
        <>
            <div className="container-user">
                <div className="sub-container-user">
                    <Nav handleBack={handleBack}/>
                    <img className="logo" src={"https://cdn-icons-png.flaticon.com/512/5259/5259256.png"} alt=""/>
                    <h1 className="nav-title">Usuários Cadastrados</h1>
                    <section className="section">
                    {
                        userList.sort((a, b) => a.name - b.name).map((user, id) => (
                            <div className="card" key={id} onClick={() => handleEditUser(user.id)}>
                                <div className="image">
                                    <img src={user.gender === 'MALE' ? "https://cdn-icons-png.flaticon.com/512/2922/2922506.png" : "https://cdn-icons-png.flaticon.com/512/2922/2922566.png"} alt={"flatIcon"}/>
                                </div>
                                <div className="info">
                                    <div className="content">
                                        <h2>{user.name}</h2>
                                        <div className='status-type'>
                                            <p><b>Tipo:</b> {user.userType == 'PATHFINDER' ? 'Desbravador' : user.userType == 'DIRECTION' ? 'Diretoria' : user.userType == 'EXECUTIVE' ? 'Executiva' : 'Eventual'}</p>
                                            <p><b>Status:</b> {user.active ? "Ativo" : "Inativo"}</p>
                                        </div>
                                        <div className='btn-edit'>
                                            <img className="edit" src={"https://cdn-icons-png.flaticon.com/512/2280/2280532.png"} alt=""/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                    </section>
                    <div className='register-user'>
                        <img className="plus" src={'https://cdn-icons-png.flaticon.com/512/1487/1487117.png'} alt="" onClick={handleRegisterUser}/>
                    </div>
                </div>
            </div>
        </>
    )
};
  
export default User;