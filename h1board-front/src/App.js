import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material'
import { indigo, amber } from '@mui/material/colors'
import { createTheme } from "@mui/material/styles";

import React, { useState } from 'react';
import Navbar from './components/NavBar/NavBar';
import HomePage from './pages/HomePage';
import LogoutComponent from './components/Logout/Logout';

// createTheme enables you to customize the look and feel of your app past the default
// in this case, we only change the color scheme
export const theme = createTheme({
  palette: {
    primary: indigo,
    secondary: amber,
  },
});

// App is the root component of our application and as children contain all our pages
// We use React Router's BrowserRouter and Routes components to define the pages for
// our application, with each Route component representing a page and the common
// NavBar component allowing us to navigate between pages (with hyperlinks)
export default function App() {
  const [userId, setUserId] = React.useState(localStorage.getItem('UID') || null);

  const userStateChanger = (title) => {
    setUserId(title);
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Navbar userStateChanger={userStateChanger} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/logout" element={<LogoutComponent />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
