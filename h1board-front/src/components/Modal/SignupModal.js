import React, { forwardRef, useState } from 'react';
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
import { useFormik } from 'formik';
import './style.css';

const config = require('../../config.json');

export async function registerUser(data) {
  return fetch(`http://${config.server_host}:${config.server_port}/user/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.status >= 200 && response.status <= 304) {
        return response.json();
      }
    })
    .catch((error) => {
      throw error;
    });
}

const SignupModal = forwardRef(({ setOpen, setSignupAlert, setResult }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorHint, setErrorHint] = useState('');
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const {
    handleChange, handleBlur, errors, touched, isValid, values, handleSubmit, resetForm,
  } = useFormik({
    initialValues: {
      name: '',
      password: '',
    },
    onSubmit: async (values) => {
      try {
        const { name, password } = values;
        const data = {
          name,
          password,
        };
        const result = await registerUser(data);
        resetForm();
        if (!result.error) {
          setOpen(false);
          setSignupAlert(true);
          setTimeout(() => {
            window.location.reload(true);
          }, 2000);
        } else {
          throw Error("Error signing up")
        }
      } catch (err) {
        setErrorHint('Error signing up, please try again');
      }
    },
  });

  return (
    <Box component="form" className="signUpBox">
      <Box sx={{ backgroundColor: '#01256E', height: '1rem', mb: 5 }} />
      <Typography variant="h2" sx={{ m: 1, textAlign: 'center' }}>Sign Up</Typography>
      <TextField
        sx={{ mx: { xs: 1, md: 5 }, my: 2 }}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.name && errors.name}
        helperText={touched.name && errors.name}
        label="name"
        type="text"
        name="name"
        value={values.name}
      />
      <FormControl sx={{ mx: { xs: 1, md: 5 }, my: 2 }} variant="outlined">
        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.password && errors.password}
          name="password"
          value={values.password}
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
        {touched.password && <FormHelperText sx={{ color: '#2196f3' }}>{errors.password}</FormHelperText>}
        <FormHelperText id="login-error-text">{errorHint}</FormHelperText>
      </FormControl>
      <Box sx={{
        display: 'flex', justifyContent: 'space-between', mx: { xs: 1, md: 5 }, my: 2,
      }}
      >
        <Button
          sx={{ mt: 1, backgroundColor: '#01256E' }}
          name={"signUpSubmitModalButton"}
          variant="contained"
          color="primary"
          disabled={!isValid}
          type="submit"
          onClick={handleSubmit}
        >
          Sign Up
        </Button>
      </Box>
      <Box sx={{ backgroundColor: '#01256E', height: '1rem', mt: 5 }} />
    </Box>
  );
});

export default SignupModal;
