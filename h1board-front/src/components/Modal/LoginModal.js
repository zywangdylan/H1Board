import React, { forwardRef, useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import './style.css';

const config = require('../../config.json');

async function loginUser(data) {
  return fetch(`http://${config.server_host}:${config.server_port}/user/signin` , {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      name: data.name,
      password: data.password,
    }),
  })
    .then(async (data) => {
      if (data.status >= 400) {
        const error = await data.json()
        console.log(error);
        throw Error(error.message)
      }
      return data.json()
    })
    .catch((error) => {
      console.log("Error", error.message)
      throw Error(error.message);
    });
}

const LoginModal = forwardRef(({ userStateChanger, setOpen, setLoginAlert, setResult }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorHint, setErrorHint] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name,
      password,
    };
    try {
      const user = await loginUser(data);
      if (user.userId !== null) {
        await localStorage.setItem("user_data", JSON.stringify(user));
        await localStorage.setItem("UID", user.userId);
        userStateChanger(JSON.parse(JSON.stringify(user)).userId);
        setLoginAlert(true);
        localStorage.setItem('limit', 3);
        setTimeout(() => {
          window.location.reload(true);
        }, 2000);
      }
    } catch (err) {
      setErrorHint(`Error login : ${err.message}`);
    }
  };

  return (
    useEffect(() => {
       /* global google */
      google.accounts.id.renderButton(
        document.getElementById('g_id_onload'),
        {
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          logo_alignment: 'left',
          width: '300',
          height: '50'
        }
      );
    }, []),

    <Box component="form" className="loginBox">
      <Box sx={{ backgroundColor: 'primary', height: '1rem', mb: 5 }} />
      <Typography variant="h2" sx={{ m: 1, textAlign: 'center' }}>Login</Typography>
      <TextField
        data-testid="add-name-input"
        sx={{ mx: { xs: 1, md: 5 }, my: 2 }}
        label="Name"
        type="name"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <FormControl sx={{ mx: { xs: 1, md: 5 }, my: 2 }} variant="outlined">
        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          data-testid="add-password-input"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onClick={handleClickShowPassword}
          type={showPassword ? 'text' : 'password'}
          endAdornment={(
            <InputAdornment position="end">
              <IconButton
                onClick={handleClickShowPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )}
          label="Password"
        />
        <FormHelperText id="login-error-text">{errorHint}</FormHelperText>
      </FormControl>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div id="g_id_onload" style={{ marginTop: '1rem' }}></div>
        <Button
          sx={{ mt: 1, backgroundColor: '#01256E', width: 300 }}
          variant="contained"
          data-testid="submitButton"
          type="submit"
          name="login-modal-submit"
          onClick={handleSubmit}
        >
          LOGIN
        </Button>
      </Box>
      <Box sx={{ backgroundColor: 'primary', height: '1rem', mt: 5 }} />
    </Box>
  );
});

export default LoginModal;
