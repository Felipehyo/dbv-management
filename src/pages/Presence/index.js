import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Button, Checkbox, IconButton, InputAdornment, TextField } from "@mui/material";

import api from '../../services/api';

import Modal from '../../components/Modal';

import './style.scss';
import '../global.scss';
import Nav from '../../components/Nav';

function formatDateToApi(dateValue) {
    if (!dateValue) {
        return '';
    }

    if (typeof dateValue === 'string') {
        return dateValue.slice(0, 10);
    }

    const year = dateValue.getFullYear();
    const month = String(dateValue.getMonth() + 1).padStart(2, '0');
    const day = String(dateValue.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function formatDateToView(dateValue) {
    if (!dateValue) {
        return '';
    }

    return new Date(`${dateValue}T00:00:00`).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
}

const kitOptions = [
    { key: 'bible', label: 'Biblia' },
    { key: 'scarf', label: 'Lenco' },
    { key: 'activityNotebook', label: 'Caderno de atividades' },
    { key: 'bottle', label: 'Garrafa de agua' },
    { key: 'pencil', label: 'Lapis ou caneta' },
    { key: 'cap', label: 'Bone' },
    { key: 'bibleStudy', label: 'Estudo Biblico' },
];

const Presence = () => {

    const [userSelected, setUserSelected] = useState({});
    const [operationType, setOperationtype] = useState('');

    const [userSearchList, setUserSearchList] = useState([]);
    const [nameFilter, setNameFilter] = useState('');
    const [selectedDay, setSelectedDay] = useState(() => formatDateToApi(new Date()));

    const [bible, setBible] = useState(false);
    const [scarf, setScarf] = useState(false);
    const [activityNotebook, setActivityNotebook] = useState(false);
    const [bottle, setBottle] = useState(false);
    const [pencil, setPencil] = useState(false);
    const [cap, setCap] = useState(false);
    const [bibleStudy, setBibleStudy] = useState(false);
    const [all, setAll] = useState(false);

    const clubId = sessionStorage.getItem("clubId");
    const normalizedNameFilter = nameFilter.trim().toLowerCase();
    const filteredUserSearchList = userSearchList.filter((item) => item.user.name.toLowerCase().includes(normalizedNameFilter));

    const navigate = useNavigate();

    function handleBack() {
        navigate("/home");
    }

    function openModal(user, operationType) {
        setOperationtype(operationType);
        document.querySelector('.modal-container').classList.add('show-modal');
        setUserSelected(user);
    }

    function handleKitChange(key) {
        const setters = {
            bible: setBible,
            scarf: setScarf,
            activityNotebook: setActivityNotebook,
            bottle: setBottle,
            pencil: setPencil,
            cap: setCap,
            bibleStudy: setBibleStudy,
        };

        const values = {
            bible,
            scarf,
            activityNotebook,
            bottle,
            pencil,
            cap,
            bibleStudy,
        };

        setters[key](!values[key]);
    }

    async function saveRegister() {

        const formattedSelectedDay = formatDateToApi(selectedDay);

        const data = {
            "date": formattedSelectedDay,
            "presenceType": operationType,
            "kit": {
                "scarf": String(scarf),
                "bible": String(bible),
                "activityNotebook": String(activityNotebook),
                "bottle": String(bottle),
                "cap": String(cap),
                "pencil": String(pencil),
                "bibleStudy": String(bibleStudy)
            }
        }

        await api.post('presence', data, {
            params: {
                userId: userSelected.id,
            },
        });

        setUserSearchList((currentList) => currentList.map((item) => {
            if (item.user.id !== userSelected.id) {
                return item;
            }

            return {
                ...item,
                status: operationType,
            };
        }));

        setNameFilter('');

        closeModal();
    }

    function closeModal() {
        setBible(false);
        setScarf(false);
        setActivityNotebook(false);
        setBottle(false);
        setPencil(false);
        setCap(false);
        setBibleStudy(false);
        setAll(false)
        document.querySelector('.modal-container').classList.remove('show-modal');
    }

    function handleSelectAll() {
        var check = all ? false : true;
        setAll(check);
        setBible(check);
        setScarf(check);
        setActivityNotebook(check);
        setBottle(check);
        setPencil(check);
        setCap(check);
        setBibleStudy(check);
    }

    useEffect(() => {
        const allChecked = bible && scarf && activityNotebook && bottle && pencil && cap && bibleStudy;
        setAll(allChecked);
    }, [bible, scarf, activityNotebook, bottle, pencil, cap, bibleStudy]);

    useEffect(() => {

        const formattedSelectedDay = formatDateToApi(selectedDay);

        if (!clubId || !formattedSelectedDay) return;

        api.get('presence/day', {
            params: {
                clubId,
                day: formattedSelectedDay,
            },
        }).then(response => {
            console.log(response.data);
            setUserSearchList(response.data);
        });

    }, [clubId, selectedDay]);

    return (
        <>
            <div className="default-container">
                <div className="sub-container-presence">
                    <Nav handleBack={handleBack} />
                    <img className="logo" src='https://cdn-icons-png.flaticon.com/512/3585/3585145.png' alt="" />
                    <h1 className="nav-title">Lista de Presença</h1>

                    <div className='presence-date-filter'>
                        <div className='presence-filter-header'>
                            <h2>Filtros</h2>
                        </div>
                        <TextField
                            label="Data"
                            type="date"
                            value={selectedDay}
                            onChange={(event) => setSelectedDay(formatDateToApi(event.target.value))}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            className="date-field"
                            fullWidth
                        />
                        <TextField
                            label="Buscar por nome"
                            type="text"
                            value={nameFilter}
                            onChange={(event) => setNameFilter(event.target.value)}
                            placeholder="Digite o nome ou parte dele"
                            className="search-field"
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchRoundedIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                                endAdornment: nameFilter ? (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="remover filtro"
                                            edge="end"
                                            onClick={() => setNameFilter('')}
                                            size="small"
                                        >
                                            <CloseRoundedIcon fontSize="small" />
                                        </IconButton>
                                    </InputAdornment>
                                ) : null,
                            }}
                        />
                        <p className='presence-date-caption'>Registros referentes a {formatDateToView(selectedDay)}</p>
                    </div>

                    <section className="section-presence">
                        {userSearchList.length === 0 ? (
                            <div className='presence-empty-state'>
                                <h3>Nenhum membro encontrado</h3>
                                <p>Altere a data selecionada ou confira se existem registros disponiveis para este dia.</p>
                            </div>
                        ) : filteredUserSearchList.length === 0 ? (
                            <div className='presence-empty-state'>
                                <h3>Nenhum resultado para essa busca</h3>
                                <p>Refine o nome digitado ou use a opcao de limpar filtro para voltar a ver todos os membros.</p>
                            </div>
                        ) : (
                            filteredUserSearchList.map((data) => (
                                <div className='line-presence' key={data.user.id}>
                                    <div className={'card' + (!data.status ? ' card-with-pending-status' : '')}>
                                        {!data.status && (
                                            <span className='presence-status pending'>Nao registrado</span>
                                        )}
                                        <div className="person-info">
                                            <p className='person-name'>{data.user.name}</p>
                                        </div>
                                        <div className='bts'>
                                            <button
                                                type='button'
                                                className={'presence-action presence-action-absent' + (data.status === 'ABSENT' ? ' selected' : '')}
                                                onClick={() => openModal(data.user, 'ABSENT')}
                                            >
                                                Ausente
                                            </button>
                                            <button
                                                type='button'
                                                className={'presence-action presence-action-present' + (data.status === 'PRESENT' ? ' selected' : '')}
                                                onClick={() => openModal(data.user, 'PRESENT')}
                                            >
                                                Presente
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </section>

                    <Modal widht="380px" height="" backgroundColor={'#fff'} boxShadow={'0 20px 60px rgba(15, 23, 42, 0.2)'}>
                        {(operationType === 'ABSENT') ? (
                            <>
                                <div className='modal-info absence'>
                                    <h2>Marcar falta</h2>
                                    <p className='modal-description'>Confirme a falta de <b>{userSelected.name}</b> em {formatDateToView(selectedDay)}.</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className='modal-info present'>
                                    <h2>Marcar presenca</h2>
                                    <p className='modal-description'>Selecione os itens trazidos por <b>{userSelected.name}</b> em {formatDateToView(selectedDay)}.</p>
                                    <div className='kit-selection-card'>
                                        <div className='kit-selection-header'>
                                            <h3>Kit e materiais</h3>
                                        </div>
                                        <div className='kit-options-grid'>
                                            {kitOptions.map((item) => {
                                                const checkedMap = {
                                                    bible,
                                                    scarf,
                                                    activityNotebook,
                                                    bottle,
                                                    pencil,
                                                    cap,
                                                    bibleStudy,
                                                };

                                                return (
                                                    <label key={item.key} className={'kit-option' + (checkedMap[item.key] ? ' checked' : '')}>
                                                        <Checkbox
                                                            className='check'
                                                            checked={checkedMap[item.key]}
                                                            onChange={() => handleKitChange(item.key)}
                                                        />
                                                        <span>{item.label}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                        <label className={'kit-option kit-option-all' + (all ? ' checked' : '')}>
                                            <Checkbox className='check' checked={all} onChange={handleSelectAll} />
                                            <span>Selecionar todos</span>
                                        </label>
                                    </div>
                                </div>
                            </>
                        )}

                        <div className='bts-modal'>
                            <Button className='bts-modal-cancel' variant="contained" onClick={closeModal}>Cancelar</Button>
                            <Button className='bts-modal-confirm' variant="contained" onClick={saveRegister}>Confirmar</Button>
                        </div>
                    </Modal>
                </div>
            </div>
        </>
    )
};

export default Presence;