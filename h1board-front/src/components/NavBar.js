import { AppBar, Container, Toolbar, Typography, Box, Button, Modal, Alert } from '@mui/material'
import { NavLink } from 'react-router-dom';
import { Home, Logout } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import LoginModal from './Modal/LoginModal';
import SignupModal from './Modal/SignupModal';

const NavText = ({ href, text, isMain }) => {
  return (
    <Typography
      variant={isMain ? 'h5' : 'h7'}
      noWrap
      style={{
        marginRight: '30px',
        fontFamily: 'monospace',
        fontWeight: 700,
        letterSpacing: '.3rem',
      }}
    >
      <NavLink
        to={href}
        style={{
          color: 'inherit',
          textDecoration: 'none',
        }}
      >
        {text}
      </NavLink>
    </Typography>
  )
}

export default function NavBar(props) {
  const navigate = useNavigate();
  const [openLogin, setOpenLogin] = useState(false);
  const [openSignup, setOpenSignup] = useState(false);
  const [loginAlert, setLoginAlert] = useState(false);
  const [signupAlert, setSignupAlert] = useState(false);
  const [signupResult, setSignupResult] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (localStorage.getItem('UID') !== null) {
      setUser(localStorage.getItem('UID'));
    }
    setLoginAlert(props.setLoginAlert);
  }, [])

  const onClickLogout = async () => {
    try {
      localStorage.removeItem('user_data');
      localStorage.removeItem('UID');
      setUser(null);
      navigate('/');
    } catch (err) {
      alert('Error Logging Out, please try again');
    }
  };

  return (
    <AppBar position='static' color='transparent'>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <NavText href='/' text='H1BOARD' isMain />
          <div style={{ flexGrow: 1 }}>
            <NavText href='/companies' text='COMPANY' />
            <NavText href='/locations' text='LOCATION' />
          </div>
          {
            user === 'null' || user === null
              ? (
                <Box sx={{
                  p: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                >

                  <Button
                    variant="text"
                    sx={{
                      color: '#01256E', mr: 1, fontWeight: 'bold', borderRadius: '25px',
                    }}
                    onClick={() => setOpenLogin(true)}
                  >
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    sx={{ fontWeight: 'bold', borderRadius: '25px', backgroundColor: '#95001A' }}
                    onClick={() => setOpenSignup(true)}
                  >
                    Sign Up
                  </Button>
                </Box>
              )
              : (
                <Box
                  sx={{
                    p: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5%',
                  }}
                >
                  <Button
                    variant="contained"
                    name="home"
                    color="primary"
                    sx={{ fontWeight: 'bold', borderRadius: '25px' }}
                    onClick={() => navigate('/')}
                  >
                    <Home />
                  </Button>
                  <Button
                    color="primary"
                    variant="text"
                    sx={{ mr: 1, fontWeight: 'bold' }}
                    onClick={onClickLogout}
                  >
                    <Logout />
                  </Button>
                </Box>
              )
          }
        </Toolbar>
      </Container>
      <Modal open={openLogin} onClose={() => setOpenLogin(false)} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <LoginModal userStateChanger={(title) => props.userStateChanger(title)} setOpen={setOpenLogin} setLoginAlert={setLoginAlert} />
      </Modal>
      <Modal open={openSignup} onClose={() => setOpenSignup(false)} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <SignupModal setOpen={setOpenSignup} setSignupAlert={setSignupAlert} setResult={setSignupResult} />
      </Modal>
      {
        loginAlert ? (
          <Alert severity="success">Login Successfully! 🥳</Alert>
        ) : null
      }
      {
        signupAlert ? (
          <Alert severity="success">Signup Successfully! 🥳</Alert>
        ) : null
      }
    </AppBar>
  );
}
