import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Snackbar, Alert, Box, IconButton, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

import './style.scss';
import Nav from '../../components/Nav';
import api from '../../services/api';

const VirtualMinutesSecretaria = () => {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem('id');
  const clubId = sessionStorage.getItem('clubId');
  const unitId = sessionStorage.getItem('unitId');
  const unitLogo = sessionStorage.getItem('virtualMinutesUnitLogo');

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [selectedMember, setSelectedMember] = useState('');
  const [members, setMembers] = useState([]);

  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const [loading, setLoading] = useState(false);

  const [descriptionValid, setDescriptionValid] = useState(false);
  const [memberValid, setMemberValid] = useState(false);

  useEffect(() => {
    if (clubId && unitId) {
      api.get('user?clubId=' + clubId + '&unitId=' + unitId).then(response => {
        setMembers(response.data);
      }).catch(error => {
        console.error('Erro ao carregar membros:', error);
      });
    }
  }, [clubId, unitId]);

  useEffect(() => {
    if (userId && selectedMember === '') {
      setSelectedMember(userId);
      setMemberValid(false);
    }
  }, [userId, selectedMember]);

  useEffect(() => {
    if (description !== '' && description !== null) {
      setDescriptionValid(false);
    }
    if (selectedMember !== '' && selectedMember !== null) {
      setMemberValid(false);
    }
  }, [description, selectedMember]);

  function handleBack() {
    navigate('/virtual-minutes');
  }

  function handleImageUpload(e) {
    const files = Array.from(e.target.files);

    console.log(userId, unitId);
    
    // Verificar se já temos 3 imagens
    if (images.length + files.length > 3) {
      setSeverity('error');
      setAlertMessage('Máximo de 3 fotos permitidas.');
      setOpen(true);
      return;
    }

    setImages(prev => [...prev, ...files]);
  }

  function handleRemoveImage(index) {
    setImages(prev => prev.filter((_, i) => i !== index));
  }

  function handleClick(message, msgSeverity = 'success') {
    setAlertMessage(message);
    setSeverity(msgSeverity);
    setOpen(true);
  }

  async function handleRegister() {
    let valid = true;
    let errors = [];

    if (description === '' || description === null) {
      setDescriptionValid(true);
      errors.push('descrição');
      valid = false;
    }

    if (selectedMember === '' || selectedMember === null) {
      setMemberValid(true);
      errors.push('membro');
      valid = false;
    }

    if (!date) {
      errors.push('data');
      valid = false;
    }

    if (valid) {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('minutesRequest', JSON.stringify({
          date: date.split('T')[0],
          description: description
        }));

        // Adicionar imagens ao FormData
        images.forEach((image, index) => {
          formData.append(`files`, image);
        });

        const response = await api.post(
          `/virtual-minutes/secretaria?unitId=${unitId}&userId=${selectedMember}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        handleClick('Ata de secretaria registrada com sucesso!', 'success');

        setTimeout(() => {
          setDescription('');
          setImages([]);
          setSelectedMember('');
          setDate(new Date().toISOString().split('T')[0]);
          navigate('/virtual-minutes');
        }, 1500);
      } catch (error) {
        console.error('Erro ao registrar ata:', error);
        const errorMsg = error.response?.data?.details || 
                        error.response?.data?.message || 
                        'Erro ao registrar a ata. Tente novamente.';
        handleClick(errorMsg, 'error');
      } finally {
        setLoading(false);
      }
    } else {
      let errorMsg = '';
      if (errors.length > 1) {
        errorMsg = 'Os campos ';
        errors.forEach((e, p) => 
          errorMsg = errorMsg + ((p === errors.length - 1) ? ' e ' : (p !== 0) ? ', ' : '') + e
        );
        errorMsg = errorMsg + ' devem ser informados.';
      } else {
        errorMsg = 'O campo ' + errors[0] + ' deve ser informado.';
      }
      handleClick(errorMsg, 'error');
    }
  }

  return (
    <div className="default-container">
      <div className="sub-container-virtual-minutes">
        <Nav handleBack={handleBack} />

        {unitLogo && <img className="logo" src={unitLogo} alt="Ata Virtual" />}
        <h1 className="nav-title">Ata da Secretaria</h1>

        <section className="section">
          <form className="form-minutes">
            <FormControl fullWidth error={memberValid}>
              <InputLabel id="member-label">Membro Responsável</InputLabel>
              <Select
                labelId="member-label"
                value={selectedMember}
                label="Membro Responsável"
                onChange={(e) => {
                  setSelectedMember(e.target.value);
                  setMemberValid(false);
                }}
              >
                {members.map((member) => (
                  <MenuItem key={member.id} value={member.id}>
                    {member.name}
                  </MenuItem>
                ))}
              </Select>
              {memberValid && (
                <span style={{ color: '#d32f2f', fontSize: '0.75rem', marginLeft: '14px', marginTop: '3px' }}>
                  Membro é obrigatório
                </span>
              )}
            </FormControl>

            <TextField
              label="Descrição da Ata"
              multiline
              rows={8}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setDescriptionValid(false);
              }}
              error={descriptionValid}
              helperText={descriptionValid ? 'Descrição é obrigatória' : ''}
              fullWidth
              placeholder="Registre presença, uniformes, atividades realizadas e outras informações importantes..."
            />

            <div className="date-upload-row">
              <TextField
                label="Data da Ata"
                type="date"
                value={date}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  readOnly: true,
                }}
                className="date-field"
              />

              <Box className="upload-container">
                <input
                  id="upload-image"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={images.length >= 3}
                  className="file-input"
                />
                <label htmlFor="upload-image" className="file-input-label">
                  <IconButton
                    aria-label="adicionar imagens"
                    component="span"
                    disabled={images.length >= 3}
                    className="upload-button"
                  >
                    <PhotoCameraIcon sx={{ fontSize: 22 }} />
                  </IconButton>
                  <div className="upload-text">
                    <div className="upload-title">Adicionar fotos</div>
                    <div className="upload-subtitle">{images.length}/3 fotos</div>
                  </div>
                </label>
              </Box>
            </div>

            {images.length > 0 && (
              <div className="preview">
                {images.map((img, index) => (
                  <div key={index} className="preview-item">
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`preview ${index + 1}`}
                    />
                    <button
                      type="button"
                      className="remove-image"
                      onClick={() => handleRemoveImage(index)}
                      title="Remover imagem"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <Button
              className="bt-register"
              variant="contained"
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Registrar Ata'}
            </Button>
          </form>
        </section>

        <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)}>
          <Alert severity={severity} variant="filled">
            {alertMessage}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default VirtualMinutesSecretaria;
