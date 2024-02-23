import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

import './style.scss';
import Nav from '../../components/Nav';

const UserCash = () => {

    const [ userList, setUserList ] = useState([]);

    const clubId = sessionStorage.getItem("clubId");
    const navigate = useNavigate();

    function handleBack() {
        navigate("/treasury");
    }

    useEffect(() => {
        api.get('/user/club/' + clubId + "?boxGreaterZero=true").then(response => {
            setUserList(response.data);
        });
    }, [clubId]);

    return (
        <>
            <div className="container-user-cash">
                <div className="sub-container-user-cash">
                    <Nav handleBack={handleBack}/>
                    <img className="logo" src={"https://cdn-icons-png.flaticon.com/512/5259/5259256.png"} alt=""/>
                    <h1 className="nav-title">Caixa do Desbravador</h1>
                    <section className="section">
                    {
                        userList.sort((a, b) => a.name - b.name).map((user, id) => (
                            <div className="card" key={id}>
                                <div className="image">
                                    <img src={user.gender === 'MALE' ? "https://cdn-icons-png.flaticon.com/512/2922/2922506.png" : "https://cdn-icons-png.flaticon.com/512/2922/2922566.png"} alt={"flatIcon"}/>
                                </div>
                                <div className="info">
                                    <div className="content">
                                        <h2>{user.name.split(" ").slice(0, 3).join(" ")}</h2>
                                        <p>Valor em caixa: R${parseFloat(user.bank).toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                    </section>
                </div>
            </div>
        </>
    )
};
  
export default UserCash;