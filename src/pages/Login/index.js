import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  IconButton,
  Input,
  InputLabel,
  InputAdornment,
  FormControl,
  Snackbar,
  Alert
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import api from '../../services/api';
import './style.scss';
import Logo from '../../assets/logo-geral-v2.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [severity, setSeverity] = useState('error'); // success | warning | info | error

  const navigate = useNavigate();

  const handleOpenAlert = (message, type = 'error') => {
    setAlertMessage(message);
    setSeverity(type);
    setOpen(true);
  };

  const handleClose = (_, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('user/login', {
        email,
        password,
      });

      const { id, name, type, clubId, clubName } = response.data;

      sessionStorage.setItem('id', id);
      // sessionStorage.setItem('name', name);
      sessionStorage.setItem('userType', type);
      sessionStorage.setItem('clubId', clubId);
      // sessionStorage.setItem('clubName', clubName);

      navigate('/home');
    } catch (err) {
      handleOpenAlert('Dados inválidos. Tente novamente.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="container-login">
        <img className="logo" src={Logo} alt="Logo" />

        <form className="form" onSubmit={handleLogin}>
          <TextField
            label="Email"
            className='email'
            variant="standard"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              width: '65%',
              mt: 1,
              '& .MuiInput-underline:after': {
                borderBottomColor: '#565656',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#293747',
              },
            }}
          />

          <FormControl className="pass" variant="standard"
            sx={{
              width: '65%',
              mt: 1,
              '& .MuiInput-underline:after': {
                borderBottomColor: '#565656',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#293747',
              },
            }}
          >
            <InputLabel>Password</InputLabel>
            <Input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>

          <Button
            className="bt-login"
            variant="contained"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Login'}
          </Button>
        </form>
        <Snackbar
          open={open}
          autoHideDuration={3000}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={handleClose}
            severity={severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {alertMessage}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default Login;