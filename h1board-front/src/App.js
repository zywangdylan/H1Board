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
import LogoutComponent from './components/Logout/Logout';

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
  const [userId, setUserId] = useState(localStorage.getItem('UID') || null);

  const userStateChanger = (title) => {
    setUserId(title);
  }

  const handleCallbackres = (res) => {
    const userObject = jwt_decode(res.credential)

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
      <NavBar userStateChanger={userStateChanger} />
      <TransitionGroup component={null}>
        <CSSTransition
          timeout={300}
          classNames='fade'
          key={location.key}
        >
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/logout" element={<LogoutComponent />} />
            <Route path="/companies" element={<CompaniesPage />} />
            <Route path="/company/:company_id" element={<CompanyPage />} />
          </Routes>
        </CSSTransition>
      </TransitionGroup>
    </ThemeProvider>
  );
}
