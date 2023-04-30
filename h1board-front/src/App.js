import { Routes, Route, useLocation } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material'
import { blue, yellow } from '@mui/material/colors'
import { createTheme } from "@mui/material/styles";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { useEffect, useState } from 'react';
import jwt_decode from "jwt-decode";

import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import CompaniesPage from './pages/CompaniesPage';
import CompanyPage from './pages/CompanyPage';
<<<<<<< Updated upstream
import AlbumInfoPage from './pages/AlbumInfoPage'
=======
import LogoutComponent from './components/Logout/Logout';
import { gridColumnGroupingSelector } from "@mui/x-data-grid";
>>>>>>> Stashed changes

// createTheme enables you to customize the look and feel of your app past the default
// in this case, we only change the color scheme
export const theme = createTheme({
  palette: {
    primary: blue,
    secondary: yellow
  },
});

export default function App() {
  const location = useLocation();

  const handleCallbackres = (res) => {
    const userObject = jwt_decode(res.credential)
    console.log(userObject)
  }

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: '659539889110-06dnqllqgguev2mb3gfgl6mhq30k2qiq.apps.googleusercontent.com',
      callback: handleCallbackres,
    });
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavBar/>
      <TransitionGroup component={null}>
        <CSSTransition
          timeout={300}
          classNames='fade'
          key={location.key}
        >
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/albums/:album_id" element={<AlbumInfoPage />} />
            <Route path="/companies" element={<CompaniesPage />} />
            <Route path="/company/:company_id" element={<CompanyPage />} />
          </Routes>
        </CSSTransition>
      </TransitionGroup>
    </ThemeProvider>
  );
}
