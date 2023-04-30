import { Routes, Route, useLocation } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material'
import { blue, yellow } from '@mui/material/colors'
import { createTheme } from "@mui/material/styles";
import { TransitionGroup, CSSTransition } from "react-transition-group";

import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import CompaniesPage from './pages/CompaniesPage';
import CompanyPage from './pages/CompanyPage';
import AlbumInfoPage from './pages/AlbumInfoPage'
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
            <Route path="/locations" element={<LocationPage />} />
          </Routes>
        </CSSTransition>
      </TransitionGroup>
    </ThemeProvider>
  );
}
