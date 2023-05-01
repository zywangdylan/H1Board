import { Routes, Route, useLocation } from "react-router-dom";
import { CssBaseline, ThemeProvider, Alert } from '@mui/material'
import { blue, yellow } from '@mui/material/colors'
import { createTheme } from "@mui/material/styles";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { useEffect, useState, useRef } from 'react';
import jwt_decode from "jwt-decode";

import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import CompaniesPage from './pages/CompaniesPage';
import CompanyPage from './pages/CompanyPage';
import LogoutComponent from './components/Logout/Logout';
import LocationPage from "./pages/LocationPage";

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
  const [loginAlert, setLoginAlert] = useState(false);

  const userStateChanger = (title) => {
    setUserId(title);
  }

  const handleCallbackres = async (res) => {
    const userObject = jwt_decode(res.credential)
    console.log(userObject)
    if (userObject.sub !== null) {
      await localStorage.setItem("user_data", JSON.stringify(userObject));
      await localStorage.setItem("UID", userObject.sub);
      userStateChanger(userObject.sub);
      localStorage.setItem('limit', 3);
      setLoginAlert(true);
      setTimeout(() => {
        window.location.reload(true);
      }, 2000);
    }
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
      <NavBar userStateChanger={userStateChanger} setLoginAlert={setLoginAlert} />
      {
        loginAlert ? (
          <Alert severity="success">Login Successfully! 🥳</Alert>
        ) : null
      }
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
            <Route path="/locations" element={<LocationPage />} />
          </Routes>
        </CSSTransition>
      </TransitionGroup>
    </ThemeProvider>
  );
}
