import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Snackbar, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

import './style.scss';
import Nav from '../../components/Nav';
import api from '../../services/api';

const VirtualMinutesCapelania = () => {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem('id');
  const clubId = sessionStorage.getItem('clubId');
  const unitId = sessionStorage.getItem('unitId');
  const unitLogo = sessionStorage.getItem('virtualMinutesUnitLogo');
  const userType = sessionStorage.getItem('userType');
  
  const canEditDate = userType === 'EXECUTIVE' || userType === 'ADMIN';

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
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
        const data = {
          date: date.split('T')[0],
          description: description
        };

        const response = await api.post(
          `/virtual-minutes/capelania?unitId=${unitId}&userId=${selectedMember}`,
          data,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        handleClick('Ata de capelania registrada com sucesso!', 'success');

        setTimeout(() => {
          setDescription('');
          setSelectedMember('');
          setDate(new Date().toISOString().split('T')[0]);
          navigate('/virtual-minutes');
        }, 1500);
      } catch (error) {
        console.error('Erro ao registrar ata:', error);
        const errorMsg = error.response?.data?.code === 'ALREADY_REGISTERED' ?
                        'Já existe uma ata de capelania para esta data.' : 'Erro ao registrar a ata. Tente novamente.';
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
        <h1 className="nav-title">Ata da Capelania</h1>

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
              placeholder="Registre o tema de meditação, cânticos, reflexão espiritual e outras atividades de capelania..."
            />

            <div className="date-upload-row">
              <TextField
                label="Data da Ata"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={!canEditDate}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  readOnly: !canEditDate,
                }}
                sx={{
                  '& input': {
                    color: canEditDate ? 'rgba(0, 0, 0, 0.87)' : '#9e9e9e',
                    cursor: canEditDate ? 'text' : 'not-allowed',
                  },
                  '& .MuiInputBase-root': {
                    pointerEvents: canEditDate ? 'auto' : 'none',
                  }
                }}
                className="date-field"
              />
              <div className="upload-placeholder" />
            </div>

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

        <Snackbar 
          open={open} 
          autoHideDuration={3000} 
          onClose={() => setOpen(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity={severity} variant="filled">
            {alertMessage}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default VirtualMinutesCapelania;
