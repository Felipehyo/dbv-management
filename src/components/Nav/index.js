import React from 'react';

import './style.scss';
import Logout from '../../assets/home.png';
import { useNavigate } from 'react-router-dom';

export default function Nav({handleBack}){

    const navigate = useNavigate();

    function homeNavigate() {
        sessionStorage.setItem("eventUserSelected", "");
        navigate("/home")
    }

    return (
        <>
            <div className='default-nav'>
                <div className='nav-logout' >
                    <img className="nav-bt nav-home" src={Logout} alt="" onClick={() => homeNavigate()}/>
                </div>
            </div>
        </>
    )
}