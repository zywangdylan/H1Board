import { useEffect, useState } from 'react';
import { Container, Divider, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';

import Box from '@mui/material/Box';
import upenn from './homepageImg.jpg';
import './HomePage.css';

const config = require('../config.json');

export default function HomePage() {
  const [user, setUser] = useState(localStorage.getItem('UID') || null);

  return (
    <Container justify="center">
      {
        user === 'null' || user === null
          ? (
            <Box className="loginPage">
              <img src={upenn} alt="homepage"/>
            </Box>
          )
          : (
            <div>
              Hello, this is the Homepage! :D
            </div>
          )
      }
    </Container>
  );
};