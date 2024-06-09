import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Fab, Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

// import Utils from '../../utils/Utils.js'
import api from '../../services/api';

import Nav from '../../components/Nav';

import './style.scss';

import BottomDrawer from '../../components/BottomDrawer';

const CashBookHistory = () => {

    const navigate = useNavigate();
    const clubId = sessionStorage.getItem("clubId");
    const [histories, setHistory] = useState([]);
    const [inputTotal, setInputTotal] = useState(0);
    const [outputTotal, setOutputTotal] = useState(0);

    const [clubEvents, setClubEvents] = useState([]);
    const [eventSelected, setEventSelected] = useState('');

    const [open, setOpen] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState("");

    const handleClick = (message) => {
        setAlertMessage(message);
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
        sessionStorage.setItem('startAlert', "")
    };

    function handleBack() {
        navigate("/treasury");
    }

    function handleCashBookRegister() {
        navigate("/treasury/cash-book/register");
    }

    function handleEdit(id) {
        sessionStorage.setItem('cashBookIdEdit', id);
        navigate("/treasury/cash-book/edit");
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
            if (query !== "") {
                query = query + "&"
            }

            query = query + "eventId=" + eventSelected;
        }

        await api.get('cash-book/club/' + clubId + (query !== "" ? "?" + query : "")).then(response => {

            setHistory(response.data);

            var inputTotal = 0;
            var outputTotal = 0;

            response.data.forEach((history) => {
                (history.type == "Entrada") ? inputTotal = inputTotal + history.value : outputTotal += history.value;
            });
            setInputTotal(inputTotal);
            setOutputTotal(outputTotal);
        });

        document.querySelector('.botton-drawer-container').classList.remove('show-modal');
    }

    const convertValue = (e) => {
        // Remove caracteres não numéricos e zeros a esquerda
        let numericValue = e.replace(/[^\d]/g, '');
        var removeCaracteres = numericValue.replace(/[,.]/g, '');
        var value = removeCaracteres.replace(/^0+/, '');

        // Preenche com zeros à esquerda se necessário
        var result;
        if (value.length === 0) {
            result = "0,00"
        } else if (value.length === 1) {
            result = "0,0" + value;
        } else if (value.length === 2) {
            result = "0," + value;
        } else if (value.length < 6) {
            result = value.slice(0, -2) + "," + value.substr(value.length - 2);
        } else if (value.length < 8) {
            let decimal = value.substr(value.length - 2);
            let hundred = value.substr(value.length - 5);
            let thousand = value.slice(0, - 5);
            result = thousand + "." + hundred.slice(0, -2) + "," + decimal;
        } else {
            return;
        }

        return result;
    }

    useEffect(() => {

        api.get('cash-book/club/' + clubId).then(response => {
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

        var alertEditSuccess = sessionStorage.getItem('startAlert');
        if (alertEditSuccess != "") {
            handleClick(alertEditSuccess);
        }

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
                        <p><b>Entradas:</b> R${convertValue(parseFloat(inputTotal).toFixed(2))}</p>
                        <p><b>Saídas:</b> R${convertValue(parseFloat(outputTotal).toFixed(2))}</p>
                    </div>
                    <section className="section">
                        {
                            histories.sort((a, b) => new Date(b.date) - new Date(a.date)).map((history, id) => (
                                <div className="card-activity-history" key={id}>

                                    <div className='card-image'>
                                        <img src={'https://cdn-icons-png.flaticon.com/512/2454/2454269.png'} alt="" />
                                    </div>

                                    <div className="card-info">
                                        <p><b>Tipo:</b> {history.type} - <b>Data:</b> {history.date.split('-')[2] + "/" + history.date.split('-')[1] + "/" + history.date.split('-')[0]}</p>
                                        <p><b>Valor:</b> R${parseFloat(history.value).toFixed(2)}</p>
                                        {history.event != null ? (<p><b>Evento:</b> {history.event.event}</p>) : null}
                                        <p><b>Descrição:</b> {history.description}</p>
                                    </div>

                                    <div className='edit' onClick={() => handleEdit(history.id)}>
                                        <img src={"https://cdn-icons-png.flaticon.com/512/2280/2280532.png"} alt="" />
                                    </div>
                                </div>
                            ))
                        }
                    </section>
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
                    <div>
                        <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                            <Alert
                                onClose={handleClose}
                                severity="success"
                                variant="filled"
                                sx={{ width: '100%' }}
                            >
                                {alertMessage}
                            </Alert>
                        </Snackbar>
                    </div>
                </div >
            </div >
        </>
    )
};

export default CashBookHistory;