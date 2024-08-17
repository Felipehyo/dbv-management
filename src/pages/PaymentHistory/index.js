import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

import api from '../../services/api';

import Nav from '../../components/Nav';

import './style.scss';

import * as XLSX from 'xlsx';

import TrashIcon from '../../assets/trash-icon.png'
import Modal from '../../components/Modal';
import BottomDrawer from '../../components/BottomDrawer';

const PaymentHistory = () => {

    const navigate = useNavigate();
    const clubId = sessionStorage.getItem("clubId");
    const [histories, setHistory] = useState([]);
    const [historySelected, setHistorySelected] = useState([]);

    const [clubUsers, setClubUsers] = useState([]);
    const [clubEvents, setClubEvents] = useState([]);
    const [payerUserSelected, setPayerUserSelected] = useState('');
    const [eventSelected, setEventSelected] = useState('');
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(4);
    const [totalPages, setTotalPages] = useState(1);
    const [queryParams, setQueryParams] = useState('');

    function handleBack() {
        navigate("/treasury");
    }
    
    const handleChange = (event, value) => {
        setPage(value);
        api.get(`payment/club/${clubId}?size=${size}&page=${value-1}${queryParams}`).then(response => {
            setHistory(response.data.content);
            setTotalPages(response.data.totalPages);
        });
    };

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

    async function handleDelete() {
        await api.delete('payment/' + historySelected.id);
        window.location.reload();
    }

    function openModal(history) {
        setHistorySelected(history);
        document.querySelector('.modal-container').classList.add('show-modal');
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

        if (payerUserSelected !== null && payerUserSelected != '') {
            query = query + "&pathfinderId=" + payerUserSelected;
        }

        if (eventSelected !== null && eventSelected != '') {
            query = query + "&eventId=" + eventSelected;
        }

        setQueryParams(query);
        await api.get(`payment/club/${clubId}?size=${size}&page=0${query}`).then(response => {
            setTotalPages(response.data.totalPages);
            setHistory(response.data.content);
        });
        document.querySelector('.botton-drawer-container').classList.remove('show-modal');
    }

    useEffect(() => {

        api.get('user/club/' + clubId + '?eventualUser=true').then(response => {
            setClubUsers(response.data);
        });

        api.get('event/club/' + clubId).then(response => {
            setClubEvents(response.data);
        });

        api.get(`payment/club/${clubId}?size=${size}`).then(response => {
            setHistory(response.data.content);
            setTotalPages(response.data.totalPages);
        });

    }, [clubId]);

    return (
        <>
            <div className="default-container">
                <div className="sub-container-payment-history">
                    <Nav handleBack={handleBack} />
                    <img className="logo" src={'https://cdn-icons-png.flaticon.com/512/2682/2682065.png'} alt="" />
                    <div className='title'>
                        <h1 className="nav-title">Pagamentos</h1>
                        <img className='filter' onClick={() => openBottomDrawer()} src='https://cdn-icons-png.flaticon.com/512/4044/4044064.png' alt="" />
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
                            <div className='modal-info'>
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
                    <BottomDrawer widht="" height="" onClick={() => closeBottomDrawer()} color={'#000'}>
                        <>
                            <div className='bottom-drawer-info'>
                                <img className='download-excel' onClick={() => handleDownload()} src='https://cdn-icons-png.flaticon.com/512/2504/2504768.png' alt="" />
                                <h2>Selecione o filtro</h2>
                                <FormControl size='medium' className='event-field'>
                                    <InputLabel id="payer">Usuário Pagador</InputLabel>
                                    <Select
                                        labelId="payer-label"
                                        id="debtor-select"
                                        value={payerUserSelected}
                                        label="Usuário Pagador"
                                        onChange={e => { setPayerUserSelected(e.target.value) }}>
                                        <MenuItem value={''}>Selecionar</MenuItem>
                                        {clubUsers.map((data) => (
                                            <MenuItem key={data.id} value={data.id}>{data.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
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
                    <Stack spacing={2} className='pagination'>
                        <Pagination count={totalPages} page={page} onChange={handleChange} />
                    </Stack>
                </div >
            </div >
        </>
    )
};

export default PaymentHistory;