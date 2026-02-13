import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Snackbar, Alert, Dialog, DialogContent, IconButton, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import CloseIcon from '@mui/icons-material/Close';

import './style.scss';
import Nav from '../../components/Nav';
import BottomDrawer from '../../components/BottomDrawer';
import api from '../../services/api';

const VirtualMinutesHistorico = () => {
  const navigate = useNavigate();
  const unitId = sessionStorage.getItem('unitId');
  const unitLogo = sessionStorage.getItem('virtualMinutesUnitLogo');
  const userType = sessionStorage.getItem('userType');
  const clubId = sessionStorage.getItem('clubId');

  const [minutes, setMinutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [openImageModal, setOpenImageModal] = useState(false);

  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [severity, setSeverity] = useState('success');

  const [units, setUnits] = useState([]);
  const [selectedFilterUnitId, setSelectedFilterUnitId] = useState(unitId || '');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  
  const [page, setPage] = useState(1);
  const [datesPerPage] = useState(15);

  const isAdminUser = userType === 'EXECUTIVE' || userType === 'ADMIN';

  useEffect(() => {
    if (isAdminUser) {
      fetchUnits();
    }
    // Carregar histórico inicial
    fetchHistorico();
  }, []);

  async function fetchUnits() {
    if (!clubId) return;

    try {
      const response = await api.get(`/unit?clubId=${clubId}`);
      setUnits(response.data || []);
    } catch (error) {
      console.error('Erro ao buscar unidades:', error);
    }
  }

  async function fetchHistorico() {
    const targetUnitId = selectedFilterUnitId || unitId;
    if (!targetUnitId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // Buscar atas de um período
      let initialDate, finalDate;

      if (selectedMonth && selectedYear) {
        // Filtrar por mês e ano específicos
        const year = parseInt(selectedYear);
        const month = parseInt(selectedMonth);
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0); // Último dia do mês
        
        initialDate = startDate.toISOString().split('T')[0];
        finalDate = endDate.toISOString().split('T')[0];
      } else if (selectedYear) {
        // Filtrar apenas por ano
        const year = parseInt(selectedYear);
        initialDate = `${year}-01-01`;
        finalDate = `${year}-12-31`;
      } else {
        // Sem filtro: buscar último ano
        const today = new Date();
        const lastYear = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
        
        initialDate = lastYear.toISOString().split('T')[0];
        finalDate = today.toISOString().split('T')[0];
      }

      const response = await api.get(
        `/virtual-minutes/by-period?unitId=${targetUnitId}&initialDate=${initialDate}&finalDate=${finalDate}`
      );

      setMinutes(response.data || []);
      setPage(1); // Resetar para a primeira página
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      setSeverity('error');
      setAlertMessage('Erro ao carregar o histórico de atas.');
      setOpen(true);
    } finally {
      setLoading(false);
    }
  }

  function handleBack() {
    navigate('/virtual-minutes');
  }

  function openBottomDrawer() {
    document.querySelector('.botton-drawer-container').classList.add('show-modal');
  }

  function closeBottomDrawer() {
    document.querySelector('.botton-drawer-container').classList.remove('show-modal');
  }

  async function handleFilter() {
    await fetchHistorico();
    closeBottomDrawer();
  }

  function handleImageClick(imageUrl) {
    setSelectedImage(imageUrl);
    setOpenImageModal(true);
  }

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Agrupar atas por data
  const groupedByDate = () => {
    const groups = {};
    
    if (minutes && minutes.length > 0) {
      minutes.forEach(minute => {
        const date = minute.date;
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(minute);
      });
    }

    // Ordenar datas em ordem decrescente
    return Object.keys(groups).sort().reverse().reduce((result, key) => {
      result[key] = groups[key];
      return result;
    }, {});
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR', options);
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    
    const date = new Date(dateTimeString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}/${month}/${year} às ${hours}:${minutes}`;
  };

  const groupedMinutes = groupedByDate();
  
  // Paginação: pegar apenas as datas da página atual
  const dateKeys = Object.keys(groupedMinutes);
  const totalPages = Math.ceil(dateKeys.length / datesPerPage);
  const indexOfLastDate = page * datesPerPage;
  const indexOfFirstDate = indexOfLastDate - datesPerPage;
  const currentDates = dateKeys.slice(indexOfFirstDate, indexOfLastDate);
  
  const paginatedMinutes = currentDates.reduce((result, date) => {
    result[date] = groupedMinutes[date];
    return result;
  }, {});

  // Gerar lista de anos (últimos 10 anos)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  return (
    <div className="default-container">
      <div className="sub-container-virtual-minutes">
        <Nav handleBack={handleBack} />

        {unitLogo && <img className="logo" src={unitLogo} alt="Ata Virtual" />}
        <h1 className="nav-title">Histórico de Atas</h1>

        <section className="section">
          {loading ? (
            <div className="history-container">
              <p className="no-data">Carregando histórico...</p>
            </div>
          ) : Object.keys(groupedMinutes).length === 0 ? (
            <div className="history-container">
              <p className="no-data">Nenhuma ata registrada</p>
            </div>
          ) : (
            <div className="history-container">
              {Object.entries(paginatedMinutes).map(([date, minutesOfDate]) => (
                <div key={date} className="date-group">
                  <div className="date-header">
                    📅 {formatDate(date)}
                  </div>

                  {minutesOfDate.sort((a, b) => {
                    // Ordem: SECRETARIA (1), CAPELANIA (2)
                    const order = { 'SECRETARIA': 1, 'CAPELANIA': 2 };
                    return (order[a.type] || 3) - (order[b.type] || 3);
                  }).map((minute) => (
                    <React.Fragment key={minute.id}>
                      <div className={`minute-card ${minute.type === 'SECRETARIA' ? 'secretaria' : 'capelania'}`}>
                        <span className={`minute-type ${minute.type === 'SECRETARIA' ? 'secretaria' : 'capelania'}`}>
                          {minute.type === 'SECRETARIA' ? '📝 Secretaria' : '🙏 Capelania'}
                        </span>

                        <div className="minute-author">
                          Por: <strong>{minute.createdByUserName || 'Desconhecido'}</strong> - {formatDateTime(minute.createdAt)}
                        </div>

                        <div className="minute-description">
                          {minute.description}
                        </div>

                        {minute.imageLinks && minute.imageLinks.length > 0 && (
                          <div className="minute-images">
                            {minute.imageLinks.map((imageUrl, index) => (
                              <img
                                key={index}
                                src={imageUrl}
                                alt={`Ata ${minute.type} - Foto ${index + 1}`}
                                onClick={() => handleImageClick(imageUrl)}
                                title="Clique para ampliar"
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      {minute.presentUserNames && minute.presentUserNames.length > 0 && (
                        <div className="minute-card presentes">
                          <span className="minute-type presentes">
                            👥 Usuários presentes
                          </span>

                          <div className="present-users-list">
                            {minute.presentUserNames.map((userName, index) => (
                              <span key={index} className="present-user-chip">
                                {userName}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Modal de imagem ampliada */}
        <Dialog 
          open={openImageModal} 
          onClose={() => setOpenImageModal(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogContent style={{ padding: 0, backgroundColor: '#000' }}>
            <IconButton
              aria-label="close"
              onClick={() => setOpenImageModal(false)}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: '#fff',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 10,

                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                }
              }}
            >
              <CloseIcon />
            </IconButton>
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Imagem ampliada"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* BottomDrawer com filtros */}
        <BottomDrawer widht="" height="" onClick={() => closeBottomDrawer()} color={'#000'}>
          <>
            <div className='bottom-drawer-info'>
              <h2>Selecione os filtros</h2>
              
              {isAdminUser && units.length > 0 && (
                <FormControl size='medium' className='event-field'>
                  <InputLabel id="unit-filter-label">Unidade</InputLabel>
                  <Select
                    labelId="unit-filter-label"
                    id="unit-filter"
                    value={selectedFilterUnitId}
                    onChange={(e) => setSelectedFilterUnitId(e.target.value)}
                    label="Unidade"
                  >
                    {units.map((unit) => (
                      <MenuItem key={unit.id} value={unit.id}>
                        {unit.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              <FormControl size='medium' className='event-field'>
                <InputLabel id="year-label">Ano</InputLabel>
                <Select
                  labelId="year-label"
                  id="year-select"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  label="Ano"
                >
                  <MenuItem value={''}>Todos</MenuItem>
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>{year}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size='medium' className='event-field'>
                <InputLabel id="month-label">Mês</InputLabel>
                <Select
                  labelId="month-label"
                  id="month-select"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  label="Mês"
                  disabled={!selectedYear}
                >
                  <MenuItem value={''}>Todos</MenuItem>
                  <MenuItem value={'1'}>Janeiro</MenuItem>
                  <MenuItem value={'2'}>Fevereiro</MenuItem>
                  <MenuItem value={'3'}>Março</MenuItem>
                  <MenuItem value={'4'}>Abril</MenuItem>
                  <MenuItem value={'5'}>Maio</MenuItem>
                  <MenuItem value={'6'}>Junho</MenuItem>
                  <MenuItem value={'7'}>Julho</MenuItem>
                  <MenuItem value={'8'}>Agosto</MenuItem>
                  <MenuItem value={'9'}>Setembro</MenuItem>
                  <MenuItem value={'10'}>Outubro</MenuItem>
                  <MenuItem value={'11'}>Novembro</MenuItem>
                  <MenuItem value={'12'}>Dezembro</MenuItem>
                </Select>
              </FormControl>

              <FormControl size='medium' className='event-field'>
                <Button className='bts-apply' variant="contained" onClick={() => handleFilter()}>Aplicar Filtro</Button>
              </FormControl>
            </div>
          </>
        </BottomDrawer>

        {/* Paginação */}
        {totalPages > 1 && (
          <Stack spacing={2} className='pagination'>
            <Pagination count={totalPages} page={page} onChange={handlePageChange} />
          </Stack>
        )}

        <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)}>
          <Alert severity={severity} variant="filled">
            {alertMessage}
          </Alert>
        </Snackbar>

        {/* Botão flutuante de filtro */}
        <div className="floating-filter-button" onClick={() => openBottomDrawer()}>
          <img src='https://cdn-icons-png.flaticon.com/512/4044/4044064.png' alt="Filtro" />
        </div>
      </div>
    </div>
  );
};

export default VirtualMinutesHistorico;
