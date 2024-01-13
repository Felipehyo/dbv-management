import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../../services/api';

import './style.scss';

import Nav from '../../components/Nav';

import AddEvent from '../../assets/add-event.png';

const ClubEvents = () => {

    const [ eventList, setEventList ] = useState([]);
    const clubId = sessionStorage.getItem("clubId");

    const navigate = useNavigate();

    function handleEvent(event) {
        sessionStorage.setItem("eventId", event.id);
        navigate("/event/details");
    }

    function handleBack() {
        navigate("/home");
    }

    function handleRegisterEvent() {
        navigate("/event/register");
    }

    useEffect(() => {
        api.get('event/club/' + clubId).then(response => {
            setEventList(response.data);
        })
    }, []);

    return (
      <>
        <div className="container-events">
            <div className="sub-container-events">
                <Nav handleBack={handleBack}/>
                <img className="logo" src='https://cdn-icons-png.flaticon.com/512/4113/4113006.png' alt=""/>
                <h1 className="nav-title">Eventos do Clube</h1>
                <section className="section">
                {
                    eventList.sort((a, b) => a.date - b.date).map((event, id) => (
                        <div className="card" key={id} onClick={() => handleEvent(event)}>
                            <div className="image">
                                <img src={"https://cdn-icons-png.flaticon.com/512/10691/10691802.png"} alt={"test"}/>
                            </div>
                            <div className="info">
                                <div className="content">
                                    <h2>{event.name}</h2>
                                </div>
                            </div>
                        </div>
                    ))
                }
                </section>
                <div className='add-event'>
                    <img className="plus" src={AddEvent} alt="" onClick={handleRegisterEvent}/>
                </div>
            </div>
        </div>
      </>
    )
  };
  
  export default ClubEvents;