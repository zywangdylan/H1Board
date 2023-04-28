import { useEffect, useState } from 'react';
import { Container, TextField, Grid, InputAdornment, IconButton, Typography } from '@mui/material';
import { Search } from '@mui/icons-material';
import { NavLink } from 'react-router-dom';

const config = require('../config.json');

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // fetch(`http://${config.server_host}:${config.server_port}/random`)
    //   .then(res => res.json())
    //   .then(resJson => setSongOfTheDay(resJson));

    // // TODO (TASK 14): add a fetch call to get the app author (name not pennkey) and store it in the state variable
    // fetch(`http://${config.server_host}:${config.server_port}/author/name`)
    //   .then(res => res.text())
    //   .then(resText => setAuthor(resText));
  }, []);

  // const songColumns = [
  //   {
  //     field: 'title',
  //     headerName: 'Song Title',
  //     renderCell: (row) => <Link onClick={() => setSelectedSongId(row.song_id)}>{row.title}</Link> // A Link component is used just for formatting purposes
  //   },
  //   {
  //     field: 'album',
  //     headerName: 'Album',
  //     renderCell: (row) => <NavLink to={`/albums/${row.album_id}`}>{row.album}</NavLink> // A NavLink component is used to create a link to the album page
  //   },
  //   {
  //     field: 'plays',
  //     headerName: 'Plays'
  //   },
  // ]

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
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search Company..."
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <Search />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
};
