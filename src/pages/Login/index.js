import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { TextField, Button, IconButton, Input, InputLabel, InputAdornment, FormControl } from "@mui/material";
import { Visibility, VisibilityOff } from '@mui/icons-material';

import api from '../../services/api';

import './style.scss';
import Logo from '../../assets/Logo.png';

const Login = () => {

    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');

    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();

        const data = {
            'email': email,
            'password': password
        }

        try {
            var response = await api.post('user/login', data)
            .catch(function (error) {
                console.log(error.response.data);
                alert('Dados inválidos. Tente novamente.');
                return null;
            });

            if (response !== null) {
                let user = response.data;
                sessionStorage.setItem('id', user.id);
                sessionStorage.setItem('name', user.name);
                sessionStorage.setItem('userType', user.userType);
                navigate('/home');
            }
        } catch (e) {
            alert(e);
        }
    }

    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };

    return (
      <>
        <div className="container">
            <div className="container-login">
                <img className="logo" src={Logo} alt=""/>
                <form className='form'>
                    <TextField className="email" label="Email" variant="standard" value={email} onChange={e => setEmail(e.target.value)}/>
                    <FormControl className="pass" sx={{ m: 1, width: '25ch' }} variant="standard">
                      <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                      <Input
                        id="standard-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                    <Button className="bt-login" variant="contained" onClick={handleLogin}>Login</Button>
                </form>
            </div>
        </div>
      </>
    )
  };
  
  export default Login;