import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../../services/api';

import './style.scss';

import Nav from '../../components/Nav';

const Treasury = () => {

    const [ unitList, setUnitList ] = useState([]);
    const clubId = sessionStorage.getItem("clubId");
    const [ club, setClub ] = useState('');

    const navigate = useNavigate();

    function handleRegister() {
        navigate("/treasury/register");
    }

    function handleHistory() {
        navigate("/treasury/history");
    }

    function handleCashBook() {
        navigate("/treasury/cash-book");
    }

    function handleUserCash() {
        navigate("/user-cash");
    }

    function handleBack() {
        navigate("/home");
    }

    useEffect(() => {
        api.get('unit/club/' + clubId).then(response => {
            setUnitList(response.data);
        })
        api.get('club/' + clubId).then(response => {
            setClub(response.data);
            console.log(response.data)
        })
    }, []);

    return (
      <>
        <div className="container-treasury">
            <div className="sub-container-treasury">
                <Nav handleBack={handleBack}/>
                <img className="logo" src='https://cdn-icons-png.flaticon.com/512/2460/2460494.png' alt=""/>
                <h1 className="nav-title">Tesouraria</h1>
                <div className="total">
                    <h4>Total em caixa: R${parseFloat(club.bank).toFixed(2)}</h4>
                </div>
                <section className="section">
                <div className="card" onClick={() => handleRegister()}>
                    <div className="image">
                        <img src='https://cdn-icons-png.flaticon.com/512/3258/3258583.png' alt={'Flat Icon'}/>
                    </div>
                    <div className="info">
                        <h3>Registrar Pagamentos</h3>
                        <p>Registrar pagamentos recebidos por desbravadores ou diretoria</p>
                    </div>
                </div>
                <div className="card" onClick={() => {}}>
                    <div className="image">
                        <img src='https://cdn-icons-png.flaticon.com/512/4866/4866857.png' alt={'Flat Icon'}/>
                    </div>
                    <div className="info">
                        <h3>Cobrar Evento</h3>
                        <p>Realizar cobranças para os eventos cadastrados caso haja caixa</p>
                    </div>
                </div>
                <div className="card" onClick={() => handleUserCash()}>
                    <div className="image">
                        <img src='https://cdn-icons-png.flaticon.com/512/5259/5259256.png' alt={'Flat Icon'}/>
                    </div>
                    <div className="info">
                        <h3>Caixa Individual</h3>
                        <p>Visualizar caixa e todas as movimentações e pagamentos do usuário</p>
                    </div>
                </div>
                <div className="card" onClick={() => handleHistory()}>
                    <div className="image">
                        <img src='https://cdn-icons-png.flaticon.com/512/2682/2682065.png' alt={'Flat Icon'}/>
                    </div>
                    <div className="info">
                        <h3>Histórico de Pagamentos</h3>
                        <p>Consultar histórico de pagamentos por clube, evento ou desbravador</p>
                    </div>
                </div>
                <div className="card" onClick={() => handleCashBook()}>
                    <div className="image">
                        <img src='https://cdn-icons-png.flaticon.com/512/3561/3561384.png' alt={'Flat Icon'}/>
                    </div>
                    <div className="info">
                        <h3>Livro Caixa</h3>
                        <p>Registar entradas e saídas do caixa do clube</p>
                    </div>
                </div>
                </section>
            </div>
        </div>
      </>
    )
  };
  
  export default Treasury;