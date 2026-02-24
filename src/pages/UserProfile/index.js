import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';

import api from '../../services/api';

import './style.scss';
import Nav from '../../components/Nav';

const UserProfile = () => {
  const navigate = useNavigate();
  const clubId = sessionStorage.getItem('clubId');
  const userId = sessionStorage.getItem('id');

  const [userName, setUserName] = useState('');
  const [currentUserData, setCurrentUserData] = useState({});

  const [userEmail, setUserEmail] = useState('');
  const [originalEmail, setOriginalEmail] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const [loading, setLoading] = useState(false);

  const handleClick = (message, msgSeverity = 'success') => {
    setAlertMessage(message);
    setSeverity(msgSeverity);
    setOpen(true);
  };

  function handleBack() {
    navigate('/home');
  }

  const handleSave = async () => {
    let valid = true;
    const errors = [];
    const emailChanged = userEmail !== originalEmail;

    if (emailChanged && !userEmail) {
      errors.push('email');
      valid = false;
    }

    const wantsPasswordChange = currentPassword || newPassword || confirmPassword;

    if (wantsPasswordChange) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        errors.push('senha');
        valid = false;
      }

      if (newPassword && confirmPassword && newPassword !== confirmPassword) {
        errors.push('confirmacao de senha');
        valid = false;
      }
    }

    if (!valid) {
      const errorMsg = errors.length > 1
        ? `Os campos ${errors.join(', ')} devem ser informados.`
        : `O campo ${errors[0]} deve ser informado.`;
      handleClick(errorMsg, 'error');
      return;
    }

    if (!wantsPasswordChange && !emailChanged) {
      handleClick('Atualize o e-mail ou informe os dados para alterar a senha.', 'error');
      return;
    }

    setLoading(true);
    try {
      const data = {
        name: currentUserData.name,
        type: currentUserData.type,
        gender: currentUserData.gender,
        birthDate: currentUserData.birthDate,
        active: currentUserData.active,
        unitId: currentUserData.unitId || currentUserData.unit?.id || currentUserData.unit,
        clubId: currentUserData.clubId || clubId,
        email: userEmail,
      };

      await api.patch(`/user/${userId}`, data);

      if (wantsPasswordChange) {
        await api.patch(`/user/${userId}/password`, {
          currentPassword,
          newPassword,
        });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }

      handleClick('Dados atualizados com sucesso!', 'success');
    } catch (error) {
      const errorCode = error?.response?.data?.code;
      if (errorCode === 'INVALID_CREDENTIALS') {
        handleClick('Senha atual invalida.', 'error');
      } else {
        handleClick('Erro ao atualizar dados. Tente novamente.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return;

    api.get(`/user/${userId}`).then((response) => {
      setCurrentUserData(response.data || {});
      setUserName(response.data.name || '');
      setUserEmail(response.data.email || '');
      setOriginalEmail(response.data.email || '');
    });
  }, [clubId, userId]);

  return (
    <>
      <div className="container-user-profile">
        <div className="sub-container-user-profile">
          <Nav handleBack={handleBack} />
          <img className="logo" src="https://cdn-icons-png.flaticon.com/512/1165/1165725.png" alt="" />
          <h1 className="nav-title">Atualizar Perfil</h1>
          <section className="section">

            <h2 className="section-title">Dados Gerais</h2>

            <form className="form-user-profile">
              <TextField
                label="Nome"
                variant="outlined"
                className="profile-field profile-field-readonly"
                value={userName}
                disabled
              />

              <h2 className="section-title">Alterar Usuário</h2>

              <TextField
                label="Usuário"
                variant="outlined"
                className="profile-field"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />

              <div className="password-block">
                <h2>Alterar Senha</h2>
                <TextField
                  label="Senha Atual"
                  type="password"
                  variant="outlined"
                  className="profile-field"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <TextField
                  label="Nova Senha"
                  type="password"
                  variant="outlined"
                  className="profile-field"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <TextField
                  label="Confirmar Nova Senha"
                  type="password"
                  variant="outlined"
                  className="profile-field"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <Button
                className="bt-profile-save"
                variant="contained"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Salvar Alteracoes'}
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
    </>
  );
};

export default UserProfile;
