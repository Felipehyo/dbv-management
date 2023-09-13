import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../../services/api';

import Nav from '../../components/Nav';

import './style.scss';

const PaymentHistory = () => {

    const navigate = useNavigate();
    const clubId = sessionStorage.getItem("clubId");
    const [histories, setHistory] = useState([]);

    function handleBack() {
        navigate("/treasury");
    }

    useEffect(() => {

        api.get('payment/club/' + clubId).then(response => {
            setHistory(response.data);
            console.log(response.data);
        });

    }, [clubId]);

    return (
        <>
            <div className="container-payment-history">
                <div className="sub-container-payment-history">
                    <Nav handleBack={handleBack} />
                    <img className="logo" src={'https://cdn-icons-png.flaticon.com/512/2682/2682065.png'} alt="" />
                    <h1 className="nav-title">Histórico Pagamentos</h1>
                    <section className="section">
                        {
                            histories.sort((a, b) => new Date(b.date) - new Date(a.date)).map((history, id) => (
                                <div className="card-activity-history" key={id}>

                                    <div className="card-info">
                                        <p><b>Nome:</b> {history.pathfinder.name.split(" ")[0] + " " + history.pathfinder.name.split(" ")[1]}</p>
                                        <p><b>Valor:</b> R${parseFloat(history.value).toFixed(2)}</p>
                                        <p><b>Forma de pagamento:</b> {history.formOfPayment}</p>
                                        <p><b>Data:</b> {history.date.split('-')[2] + "/" + history.date.split('-')[1] + "/" + history.date.split('-')[0]}</p>
                                        <p><b>Destinado:</b> {history.event != null ? history.event.name : 'Caixa'}</p>
                                    </div>

                                    <div className='card-image'>
                                        <img src={'https://cdn-icons-png.flaticon.com/512/2454/2454269.png'} alt="" />
                                    </div>
                                </div>
                            ))
                        }
                    </section>
                </div >
            </div >
        </>
    )
};

export default PaymentHistory;