import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material'
import { blue, yellow } from '@mui/material/colors'
import { createTheme } from "@mui/material/styles";

import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import CompaniesPage from './pages/CompaniesPage';
import CompanyPage from './pages/CompanyPage';
import AlbumInfoPage from './pages/AlbumInfoPage'

// createTheme enables you to customize the look and feel of your app past the default
// in this case, we only change the color scheme
export const theme = createTheme({
  palette: {
    primary: blue,
    secondary: yellow
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter style={{display: 'flex'}}>
        <NavBar/>
        <Routes style={{style: "flex: 1"}}>
          <Route path="/" element={<HomePage />} />
          <Route path="/albums/:album_id" element={<AlbumInfoPage />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/company/:company_id" element={<CompanyPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
