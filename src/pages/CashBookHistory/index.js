import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Fab, Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

import api from '../../services/api';

import Nav from '../../components/Nav';

import './style.scss';

import TrashIcon from '../../assets/trash-icon.png'
import Modal from '../../components/Modal';
import BottomDrawer from '../../components/BottomDrawer';

const CashBookHistory = () => {

    const navigate = useNavigate();
    const clubId = sessionStorage.getItem("clubId");
    const [ histories, setHistory ] = useState([]);
    const [ historySelected, setHistorySelected ] = useState([]);
    const [ inputTotal, setInputTotal ] = useState(0);
    const [ outputTotal, setOutputTotal ] = useState(0);

    const [clubEvents, setClubEvents] = useState([]);
    const [eventSelected, setEventSelected] = useState('');

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

    function openBottomDrawer() {
        document.querySelector('.botton-drawer-container').classList.add('show-modal');
    }

    function closeBottomDrawer() {
        document.querySelector('.botton-drawer-container').classList.remove('show-modal');
    }

    async function handleFilter() {

        var query = ""

        if (eventSelected !== null) {
            if(query !== "") {
                query = query + "&"
            }

            query = query + "eventId=" + eventSelected;
        }

        await api.get('cash-book/' + clubId + (query !== "" ? "?" + query : "") ).then(response => {
            setHistory(response.data);
        });
        document.querySelector('.botton-drawer-container').classList.remove('show-modal');
    }

    useEffect(() => {

        api.get('cash-book/' + clubId).then(response => {
            setHistory(response.data);

            var inputTotal = 0;
            var outputTotal = 0;
            
            response.data.forEach((history) => {
                (history.type == "Entrada") ? inputTotal = inputTotal + history.value : outputTotal += history.value;
            });
            setInputTotal(inputTotal);
            setOutputTotal(outputTotal);
        });

        api.get('event/club/' + clubId).then(response => {
            setClubEvents(response.data);
        });

    }, [clubId]);

    return (
        <>
            <div className="default-container">
                <div className="sub-container-cash-book-history">
                    <Nav handleBack={handleBack} />
                    <img className="logo" src={'https://cdn-icons-png.flaticon.com/512/3561/3561384.png'} alt="" />
                    <div className='title'>
                        <h1 className="nav-title">Livro Caixa</h1>
                        <img className='filter' onClick={() => openBottomDrawer()} src='https://cdn-icons-png.flaticon.com/512/4044/4044064.png' alt="" />
                    </div>
                    <div className='values first'>
                        <p><b>Total entradas:</b> R${parseFloat(inputTotal).toFixed(2)}</p>
                        <p><b>Total saídas:</b> R${parseFloat(outputTotal).toFixed(2)}</p>
                    </div>
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
                                        {history.event != null ? (<p><b>Evento:</b> {history.event.event}</p>) : null}
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
                            <div className='modal-info'>
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
                    <BottomDrawer widht="" height="" onClick={() => closeBottomDrawer()} color={'#000'}>
                        <>
                            <div className='bottom-drawer-info'>
                                {/* <img className='download-excel' onClick={() => handleDownload()} src='https://cdn-icons-png.flaticon.com/512/2504/2504768.png' alt="" /> */}
                                <h2>Selecione o filtro</h2>
                                <FormControl size='medium' className='event-field'>
                                    <InputLabel id="event">Evento</InputLabel>
                                    <Select
                                        labelId="event-label"
                                        id="event-select"
                                        value={eventSelected}
                                        label="Usuário Pagador"
                                        onChange={e => { setEventSelected(e.target.value) }}>
                                        <MenuItem value={''}>Selecionar</MenuItem>
                                        {clubEvents.map((data) => (
                                            <MenuItem key={data.id} value={data.id}>{data.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                        </>
                        <div className='bts-bottom-drawer'>
                            <Button className='bts-apply' variant="contained" onClick={() => handleFilter()}>Aplicar Filtro</Button>
                        </div>
                    </BottomDrawer>
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