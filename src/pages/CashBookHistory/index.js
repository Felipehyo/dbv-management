import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Fab, Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

import api from '../../services/api';

import Nav from '../../components/Nav';

import './style.scss';

import TrashIcon from '../../assets/trash-icon.png'
import Modal from '../../components/Modal';

const CashBookHistory = () => {

    const navigate = useNavigate();
    const clubId = sessionStorage.getItem("clubId");
    const [histories, setHistory] = useState([]);
    const [ historySelected, setHistorySelected ] = useState([]);

    function handleBack() {
        navigate("/treasury");
    }

    function handleCashBookRegister() {
        navigate("/treasury/cash-book/register");
    }

    function openModal(history) {
        setHistorySelected(history);
        document.querySelector('.modal-container').classList.add('show-modal');
    }

    async function handleDelete() {
        await api.delete('cash-book/' + historySelected.id);
        navigate("/treasury");
    }

    function closeModal() {
        document.querySelector('.modal-container').classList.remove('show-modal');
    }

    useEffect(() => {

        api.get('cash-book/' + clubId).then(response => {
            setHistory(response.data);
        });

    }, [clubId]);

    return (
        <>
            <div className="container-cash-book-history">
                <div className="sub-container-cash-book-history">
                    <Nav handleBack={handleBack} />
                    <img className="logo" src={'https://cdn-icons-png.flaticon.com/512/3561/3561384.png'} alt="" />
                    <h1 className="nav-title">Livro Caixa</h1>
                    <section className="section">
                        {
                            histories.sort((a, b) => new Date(b.date) - new Date(a.date)).map((history, id) => (
                                <div className="card-activity-history" key={id}>

                                    <div className='card-image'>
                                        <img src={'https://cdn-icons-png.flaticon.com/512/2454/2454269.png'} alt="" />
                                    </div>

                                    <div className="card-info">
                                        <p><b>Data:</b> {history.date.split('-')[2] + "/" + history.date.split('-')[1] + "/" + history.date.split('-')[0]}</p>
                                        <p><b>Valor:</b> R${parseFloat(history.value).toFixed(2)}</p>
                                        <p><b>Tipo:</b> {history.type}</p>
                                        <p><b>Descrição:</b> {history.description}</p>
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
                                <p>Tem certeza que deseja deletar o registro de caixa no valor de <b>R${parseFloat(historySelected.value).toFixed(2)}</b>?</p>
                                {/* <p>Tem certeza que deseja deletar o pagamento do usuário <b>{historySelected.pathfinder.name}</b> no valor de <b>R${historySelected.value}</b>?</p> */}
                            </div>
                        </>
                        <div className='bts-modal'>
                            <Button className='bts-modal-cancel' variant="contained" onClick={closeModal}>Cancelar</Button>
                            <Button className='bts-modal-confirm' variant="contained" onClick={handleDelete}>Confirmar</Button>
                        </div>
                    </Modal>
                    <footer className='footer-cash-book-history'>
                        <Fab className='fabButton' size='medium' onClick={() => handleCashBookRegister()} aria-label="add">
                            <AddIcon />
                        </Fab>
                    </footer>
                </div >
            </div >
        </>
    )
};

export default CashBookHistory;