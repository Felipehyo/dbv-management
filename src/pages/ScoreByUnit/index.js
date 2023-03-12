import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { TextField, Button, InputLabel, MenuItem, FormControl, Select } from "@mui/material";
import api from '../../services/api';

import Modal from '../../components/Modal';

import './style.scss';
import Nav from '../../components/Nav';

const ScoreByUnit = () => {

    const [ unit, setUnit ] = useState([]);
    const [ activities, setActivities ] = useState([]);

    const unitId = sessionStorage.getItem("unitId");
    const navigate = useNavigate();

    const [ title, setTitle ] = useState('');
    
    const [ description, setDescription ] = useState('');
    const [ qtdScore, setQtdScore ] = useState(0);
    const [ qtdPendency, setQtdPendency ] = useState(0);

    const [ activitySelected, setActivitySelected] = useState('');
    const [ type, setType ] = useState('');
    const [ typeSelected, setTypeSelected] = useState('');
    const [ qtdPointSelected, setQtdPointSelected] = useState('');

    const [ isCreateScore, setisCreateScore ] = useState(false);

    async function saveRecord() {

        const data = {
            'type': type,
            'title': isCreateScore ? title : '',
            'points': isCreateScore ? parseInt(qtdScore) : '',
            'reason': isCreateScore ? description : ''
        }

        await api.post("activity-record/unit/" + unitId + "/activity/" + (activitySelected.id != null ? activitySelected.id : '0'), data).catch(error => {
            if(error.response.data.code === '001') {
                alert('Atividade já foi cadastrada por outro usuário')
            }
        });
        closeModal();

        setActivities(activities.filter( a => (a.id !== activitySelected.id || activitySelected.alwaysDisplay)));
        setTitle('');
        setType('');
        setDescription('');
        setQtdScore('');

        await api.get('unit/' + unitId).then(response => {
            setUnit(response.data);
        });
    }

    function handleBack() {
        navigate("/score");
    }

    function handleCreateScore() {
        
        setActivitySelected('');
        setTypeSelected(type === 'DEMERIT' ? 'Demérito' : type === 'MERIT' ? 'Mérito' : 'Não pontua');
        setQtdPointSelected(type === 'DEMERIT' ? -qtdScore : type === 'MERIT' ? qtdScore : 0);
        setisCreateScore(true);

        document.querySelector('.modal-container').classList.add('show-modal');
    }

    function handleScore(activity, pointType) {
        
        setActivitySelected(activity);
        setTypeSelected(pointType === 'DEMERIT' ? 'Demérito' : pointType === 'MERIT' ? 'Mérito' : 'Não pontua');
        setType(pointType)
        setQtdPointSelected(pointType === 'DEMERIT' ? -activity.demerit : pointType === 'MERIT' ? activity.merit : 0);
        setisCreateScore(false);

        document.querySelector('.modal-container').classList.add('show-modal');
    }

    function closeModal() {
        setType('');
        document.querySelector('.modal-container').classList.remove('show-modal');
    }

    async function deposit() {

        await api.patch("unit/" + unitId + "/pendency-deposit/" + qtdPendency, null).catch(error => {
            if(error.response.data.code === '100') {
                alert('Ação não permitida pelo sistema!')
            }
        });

        await api.get('unit/' + unitId).then(response => {
            setUnit(response.data);
        });

    }

    async function recall() {

        await api.patch("unit/" + unitId + "/pendency-recall/" + qtdPendency, null).catch(error => {
            if(error.response.data.code === '100') {
                alert('Ação não permitida pelo sistema!')
            }
        });

        await api.get('unit/' + unitId).then(response => {
            setUnit(response.data);
        });

    }

    useEffect(() => {

        api.get('activities/today/' + unitId).then(response => {
            setActivities(response.data);
        });

        api.get('unit/' + unitId).then(response => {
            setUnit(response.data);
        });

    }, [unitId]);

    return (
      <>
        <div className="container-score-unit">
            <div className="sub-container-score-unit">
                <Nav handleBack={handleBack}/>
                <img className="logo" src={unit.imageLink} alt=""/>
                <h1 className="nav-title">{unit.name}</h1>
                <section className="section">
                    { activities.sort((a, b) => a.activityOrder - b.activityOrder).map((activity, id) => (
                        <div className="card-activity" key={id}>
                            <div className="info">
                                <h2>{activity.name}</h2>
                                <p>{activity.description}</p>
                                <div className='bts'>
                                    <div className='div-bts'>
                                        <button id='bt-np' className='bt-np' onClick={() => handleScore(activity, 'NOT_SCORE')}>Não Pontua</button>
                                        <p>0</p>
                                    </div>
                                    <div className='div-bts'>
                                        <button className='bt-no' onClick={() => handleScore(activity, 'DEMERIT')}>Não</button>
                                        <p>-{activity.demerit}</p>
                                    </div>
                                    <div className='div-bts'>
                                        <button className='bt-yes' onClick={() => handleScore(activity, 'MERIT')}>Sim</button>
                                        <p>{activity.merit}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="card-activity">
                        <div className="info">
                            <h2>{'Banco da Unidade'}</h2>
                            <p>Guilherminas pendentes de entrega: <b>{unit.deliveryPendingPoints}</b></p>
                            <div className='cg-1'>
                                <TextField size='small' className='control' id="outlined-basic" label="Qtd Pontos" variant="outlined"
                                    value={qtdPendency} onChange={e => setQtdPendency(e.target.value)} type='number'/>
                                <button className='bt-no' onClick={recall}>Depositar</button>
                                <button className='bt-yes' onClick={deposit}>Sacar</button>
                            </div>
                        </div>
                    </div>
                    <div className="card-activity">
                        <div className="info">
                            <h2>{'Crie uma Pontuação'}</h2>
                            <div className='ct-1'>
                                <TextField size='small' className='customize-title' id="outlined-basic" label="Título" variant="outlined" 
                                    value={title} onChange={e => setTitle(e.target.value)}/>
                                <FormControl className='ct-type' size='small' fullWidth>
                                    <InputLabel id="demo-simple-select-label">Tipo</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={type}
                                        label="Age"
                                        onChange={e => setType(e.target.value)}
                                    >
                                        <MenuItem value={'MERIT'}>Mérito</MenuItem>
                                        <MenuItem value={'DEMERIT'}>Demérito</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                            <div className='ct-2'>
                                <TextField
                                    size='small'
                                    className='mt-description'
                                    id="outlined-multiline-static"
                                    label="Descrição"
                                    multiline
                                    rows={3}
                                    value={description} 
                                    onChange={e => setDescription(e.target.value)}
                                />
                            </div>
                            <div className='ct-3'>
                                <TextField size='small' className='customize-title' id="outlined-basic" label="Qtd Pontos" variant="outlined"
                                    value={qtdScore} onChange={e => setQtdScore(e.target.value)} type='number'/>
                                <Button className="mt-save" variant="contained" onClick={() => handleCreateScore()}>Salvar</Button>
                            </div>
                        </div>
                    </div>
                </section>

                <Modal widht="330px" height="" onClick={closeModal} color={'#000'}>
                    <h2>Confirmar Pontuação?</h2>
                    <div className='div-modal-info'>
                        <p><b>Atividade:</b> {activitySelected.name != null ? activitySelected.name : title}</p>
                        <p><b>Tipo:</b> {typeSelected}</p>
                        <p><b>Quantidade:</b> {qtdPointSelected}</p>
                    </div>
                    <div className='bts-modal'>
                        <Button className='bts-modal-cancel' variant="contained" onClick={closeModal}>Cancelar</Button>
                        <Button className='bts-modal-confirm' variant="contained" onClick={saveRecord}>Confirmar</Button>
                    </div>
                </Modal>
            </div>
        </div>
      </>
    )
};
  
export default ScoreByUnit;