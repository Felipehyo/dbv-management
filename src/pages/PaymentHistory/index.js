import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@mui/material";

import api from '../../services/api';

import Nav from '../../components/Nav';

import './style.scss';

import * as XLSX from 'xlsx';

import TrashIcon from '../../assets/trash-icon.png'
import Modal from '../../components/Modal';

const PaymentHistory = () => {

    const navigate = useNavigate();
    const clubId = sessionStorage.getItem("clubId");
    const [histories, setHistory] = useState([]);
    const [ historySelected, setHistorySelected ] = useState([]);

    function handleBack() {
        navigate("/treasury");
    }

    const handleDownload = () => {

        const customizedData = histories.map(item => ({
            'Nome': item.pathfinder.name,
            'Valor': `${item.value.toFixed(2)}`.replace('.', ","),
            'Forma de Pagamento': item.formOfPayment,
            'Data': item.date,
            'Evento': item.event != null ? item.event.name : "",
        }));

        const wscols = [
            { wch: 35 },
            { wch: 15 },
            { wch: 20 },
            { wch: 15 },
            { wch: 20 },
        ];

        const worksheet = XLSX.utils.json_to_sheet(customizedData, { header: Object.keys(customizedData[0]) });

        worksheet['!cols'] = wscols;

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Histórico de Pagamentos');
        XLSX.writeFile(workbook, `Histórico de Pagamentos GB - ${new Date().getTime()}.xlsx`);
    };

    const handleDelete = () => {
        api.delete('payment/' + historySelected.id).catch(error => {
            alert('Erro ao deletar pagamento')
        });
        window.location.reload();
    }

    function openModal(history) {
        setHistorySelected(history);
        document.querySelector('.modal-container').classList.add('show-modal');
    }

    function closeModal() {
        document.querySelector('.modal-container').classList.remove('show-modal');
    }

    useEffect(() => {

        api.get('payment/club/' + clubId).then(response => {
            setHistory(response.data);
        });

    }, [clubId]);

    return (
        <>
            <div className="container-payment-history">
                <div className="sub-container-payment-history">
                    <Nav handleBack={handleBack} />
                    <img className="logo" src={'https://cdn-icons-png.flaticon.com/512/2682/2682065.png'} alt="" />
                    <div className='title'>
                        <h1 className="nav-title">Pagamentos</h1>
                        <img className='download-excel' onClick={() => handleDownload()} src='https://cdn-icons-png.flaticon.com/512/2504/2504768.png' alt=""/>
                    </div>
                    <section className="section">
                        {
                            histories.sort((a, b) => new Date(b.date) - new Date(a.date)).map((history, id) => (
                                <div className="card-activity-history" key={id}>

                                    <div className='card-image'>
                                        <img src={'https://cdn-icons-png.flaticon.com/512/2454/2454269.png'} alt="" />
                                    </div>

                                    <div className="card-info">
                                        <p><b>Nome:</b> {history.pathfinder.name}</p>
                                        <p><b>Data:</b> {history.date.split('-')[2] + "/" + history.date.split('-')[1] + "/" + history.date.split('-')[0]}</p>
                                        <p><b>Valor:</b> R${parseFloat(history.value).toFixed(2)} ({history.formOfPayment})</p>
                                        {/* <p><b>Forma de pagamento:</b> {history.formOfPayment}</p> */}
                                        {/* <p><b>Data:</b> {history.date.split('-')[2] + "/" + history.date.split('-')[1] + "/" + history.date.split('-')[0]}</p> */}
                                        <p><b>Destinado:</b> {history.event != null ? history.event.name : 'Caixa'}</p>
                                    </div>

                                    <div className='trash' onClick={() => openModal(history)}>
                                        <img src={TrashIcon} alt="" />
                                    </div>

                                </div>
                            ))
                        }
                    </section>
                    <Modal widht="330px" height="" onClick={closeModal} color={'#000'}>
                        <>
                            <div className='div-modal-info'>
                                <h2>Deletar pagamento</h2>
                                <p>Tem certeza que deseja deletar o pagamento de <b>{historySelected.pathfinder != null ? historySelected.pathfinder.name : null}</b> no valor de <b>R${historySelected.value}</b>?</p>
                                {/* <p>Tem certeza que deseja deletar o pagamento do usuário <b>{historySelected.pathfinder.name}</b> no valor de <b>R${historySelected.value}</b>?</p> */}
                            </div>
                        </>
                        <div className='bts-modal'>
                            <Button className='bts-modal-cancel' variant="contained" onClick={closeModal}>Cancelar</Button>
                            <Button className='bts-modal-confirm' variant="contained" onClick={handleDelete}>Confirmar</Button>
                        </div>
                    </Modal>
                </div >
            </div >
        </>
    )
};

export default PaymentHistory;