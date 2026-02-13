import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Snackbar, Alert, Dialog, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import './style.scss';
import Nav from '../../components/Nav';
import Araras from '../../assets/arara-azul.png';
import api from '../../services/api';

const VirtualMinutesHistorico = () => {
  const navigate = useNavigate();
  const unitId = sessionStorage.getItem('unitId');

  const [minutes, setMinutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [openImageModal, setOpenImageModal] = useState(false);

  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [severity, setSeverity] = useState('success');

  useEffect(() => {
    fetchHistorico();
  }, [unitId]);

  async function fetchHistorico() {
    if (!unitId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // Buscar atas de um período (usando período de 1 ano)
      const today = new Date();
      const lastYear = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
      
      const initialDate = lastYear.toISOString().split('T')[0];
      const finalDate = today.toISOString().split('T')[0];

      const response = await api.get(
        `/virtual-minutes/by-period?unitId=${unitId}&initialDate=${initialDate}&finalDate=${finalDate}`
      );

      setMinutes(response.data || []);
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

  function handleImageClick(imageUrl) {
    setSelectedImage(imageUrl);
    setOpenImageModal(true);
  }

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

  return (
    <div className="default-container">
      <div className="sub-container-virtual-minutes">
        <Nav handleBack={handleBack} />

        <img className="logo" src={Araras} alt="Ata Virtual" />
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
              {Object.entries(groupedMinutes).map(([date, minutesOfDate]) => (
                <div key={date} className="date-group">
                  <div className="date-header">
                    📅 {formatDate(date)}
                  </div>

                  {minutesOfDate.map((minute) => (
                    <div
                      key={minute.id}
                      className={`minute-card ${minute.type === 'SECRETARIA' ? 'secretaria' : 'capelania'}`}
                    >
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

        <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)}>
          <Alert severity={severity} variant="filled">
            {alertMessage}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default VirtualMinutesHistorico;
