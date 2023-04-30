import { useEffect, useState } from 'react';
import { Container, TextField, Grid, InputAdornment, IconButton, Typography, Autocomplete } from '@mui/material';
import { Search } from '@mui/icons-material';
import { NavLink } from 'react-router-dom';

const config = require('../config.json');

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");

  // TODO: Autocomplete options should be fetched from the server (most popular searches / user's search)
  const options = [
    { title: "Apple" },
    { title: "Banana" },
    { title: "Cherry" },
    { title: "Durian" },
  ];

  // TODO: Use useEffect to initialize options with the most popular searches/companies
  useEffect(() => {
    // fetch(`http://${config.server_host}:${config.server_port}/random`)
    //   .then(res => res.json())
    //   .then(resJson => setSongOfTheDay(resJson));

    // fetch(`http://${config.server_host}:${config.server_port}/author/name`)
    //   .then(res => res.text())
    //   .then(resText => setAuthor(resText));
  }, []);

  // TODO: Implement search logic, redirect to /companies/:company_id
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    // You can perform your search logic here
  };

  return (
    <Container maxWidth="md" style={{height: 'calc(100vh - 64px)', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <Grid container direction="column" justifyContent="center" alignItems="center" spacing={1} style={{marginBottom:"15rem"}}>
        <Grid item>
          <Typography
            variant="h1"
            style={{fontFamily: "'Bruno Ace SC', cursive"}}
          >
            H1Board
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} style={{width: '80%'}}>
        <Autocomplete
          value={searchTerm}
          onChange={(event, newValue) => {
            setSearchTerm(newValue);
          }}
          options={options}
          getOptionLabel={(option) => option.title}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              variant="outlined"
              placeholder="Search Company..."
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <Search onClick={handleSearch} />
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
