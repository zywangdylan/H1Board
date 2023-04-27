import { useEffect, useState } from 'react';
import { Container, TextField, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { styled } from '@mui/system';
import Autocomplete from '@mui/material/Autocomplete';
import SearchIcon from '@mui/icons-material/Search';

const config = require('../config.json');

export default function HomePage() {
  const [songOfTheDay, setSongOfTheDay] = useState({});
  const [author, setAuthor] = useState('');
  const [selectedSongId, setSelectedSongId] = useState(null);

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
  // ];

  const options = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry' },
    { label: 'Durian', value: 'durian' },
    { label: 'Elderberry', value: 'elderberry' },
  ];

  const classes = useStyles();

  return (
    <Container className={classes.root}>
      <h1 style={{ fontFamily: 'monospace', fontWeight: 700, letterSpacing: '.3rem' }}>H1BOARD</h1>
      {/* Write a search bar with material ui */}
      <Autocomplete
        className={classes.textField}
        options={options}
        getOptionLabel={(option) => option.label}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: <SearchIcon />,
            }}
          />
        )}
      />
    </Container>
  );
};
