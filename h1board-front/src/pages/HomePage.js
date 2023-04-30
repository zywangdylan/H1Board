import { useEffect, useState, useRef } from 'react';
import { Container, TextField, Grid, InputAdornment, IconButton, Typography, Autocomplete, createFilterOptions } from '@mui/material';
import { Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const config = require('../config.json');

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [companiesName, setCompaniesName] = useState([]);
  const navigate = useNavigate();

  const OPTIONS_LIMIT = 10;
  const defaultFilterOptions = createFilterOptions();

  const filterOptions = (options, state) => {
    return defaultFilterOptions(options, state).slice(0, OPTIONS_LIMIT);
  };

  async function fetchCompaniesName() {
    return fetch(`http://${config.server_host}:${config.server_port}/companiesName`)
      .then(res => res.json())
  }

  const firstRendering = useRef(true);
  useEffect(() => {
    // Load companies' names from the database
    async function getCompaniesName() {
      let data = await fetchCompaniesName();
      setCompaniesName(data);
    }

    // only load data on the first rendering
    if (firstRendering.current) {
      firstRendering.current = false;
      getCompaniesName();
    }
  }, []);

  async function getCompanyId(term) {
    return fetch(`http://${config.server_host}:${config.server_port}/company?name=${term}`)
      .then((data) => {
        return data.json()
      })
      .catch((error) => error);
  }

  const handleSearch = (event) => {
    // You can perform your search logic here
    async function navigateToTargetCompany() {
      let data = await getCompanyId(searchTerm);
      navigate(`/company/${data[0].companyId}`);
    }
    navigateToTargetCompany();
  };

  return (
    <Container maxWidth="md" style={{ height: 'calc(100vh - 64px)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Grid container direction="column" justifyContent="center" alignItems="center" spacing={1} style={{ marginBottom: "15rem" }}>
        <Grid item>
          <Typography
            variant="h1"
            style={{ fontFamily: "'Bruno Ace SC', cursive" }}
          >
            H1Board
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} style={{ width: '80%' }}>
          <Autocomplete
            onChange={(event, newValue) => {
              if (newValue != null) {
                setSearchTerm(newValue.name);
              }
            }}
            filterOptions={filterOptions}
            options={companiesName}
            getOptionLabel={(option) => option.name ? option.name : ""}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                }}
                variant="outlined"
                placeholder="Search Company..."
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleSearch}>
                        <Search />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Grid>
      </Grid>
    </Container>
  );
};
