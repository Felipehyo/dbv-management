import React from 'react';

import './style.scss';
import Logout from '../../assets/home.png';
import Back from '../../assets/back.png';
import { useNavigate } from 'react-router-dom';

export default function Nav({handleBack}){

    const navigate = useNavigate();

    return (
        <>
            <div className='default-nav'>
                <div className='nav-back' >
                    <img className="nav-bt" src={Back} alt="" onClick={handleBack}/>
                </div>
                <div className='nav-logout' >
                    <img className="nav-bt" src={Logout} alt="" onClick={() => navigate("/home")}/>
                </div>
            </div>
        </>
    )
}