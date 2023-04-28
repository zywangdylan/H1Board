import { useState } from 'react';
import { Container, Button, Grid, Typography, Slider, Link } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { formatDuration } from '../helpers/formatter';

export default function H1B(props) {
  const companyInfo = props.companyInfo;
  const [selectedSongId, setSelectedSongId] = useState(null);
  const [pageSize, setPageSize] = useState(10);

  // Setting useState for each slider/filter
  const [duration, setDuration] = useState([60, 660]);
  const [plays, setPlays] = useState([0, 1100000000]);
  const [danceability, setDanceability] = useState([0, 1]);
  const [energy, setEnergy] = useState([0, 1]);
  const [valence, setValence] = useState([0, 1]);

  // TODO: Trigger search when user clicks the search button with the current filter values
  const search = () => {
    // fetch(`http://${config.server_host}:${config.server_port}/search_songs?title=${title}` +
    //   `&duration_low=${duration[0]}&duration_high=${duration[1]}` +
    //   `&plays_low=${plays[0]}&plays_high=${plays[1]}` +
    //   `&danceability_low=${danceability[0]}&danceability_high=${danceability[1]}` +
    //   `&energy_low=${energy[0]}&energy_high=${energy[1]}` +
    //   `&valence_low=${valence[0]}&valence_high=${valence[1]}` +
    //   `&explicit=${explicit}`
    // )
    //   .then(res => res.json())
    //   .then(resJson => {
    //     // DataGrid expects an array of objects with a unique id.
    //     // To accomplish this, we use a map with spread syntax (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
    //     const songsWithId = resJson.map((song) => ({ id: song.song_id, ...song }));
    //     setCompanyInfo(songsWithId);
    //   });
  }

  // TODO: Define the columns in the table
  const columns = [
    { field: 'title', headerName: 'Title', width: 300, renderCell: (params) => (
        <Link onClick={() => setSelectedSongId(params.row.song_id)}>{params.value}</Link>
    ) },
    { field: 'duration', headerName: 'Duration' },
    { field: 'plays', headerName: 'Plays' },
    { field: 'danceability', headerName: 'Danceability' },
    { field: 'energy', headerName: 'Energy' },
    { field: 'valence', headerName: 'Valence' },
    { field: 'tempo', headerName: 'Tempo' },
    { field: 'key_mode', headerName: 'Key' },
    { field: 'explicit', headerName: 'Explicit' },
  ]

  return (
    <div>
      <div style={{margin: "2rem 0"}}>
        <Grid container spacing={3} style={{margin: "2rem 0"}}>
        {/* <Grid item xs={4}>
          <FormControlLabel
            label='Explicit'
            control={<Checkbox checked={explicit} onChange={(e) => setExplicit(e.target.checked)} />}
          />
        </Grid>
        <Grid item xs={8}>

        </Grid> */}
        <Grid item xs={6}>
          <p>Duration</p>
          <Slider
            value={duration}
            min={60}
            max={660}
            step={10}
            onChange={(e, newValue) => setDuration(newValue)}
            valueLabelDisplay='auto'
            valueLabelFormat={value => <div>{formatDuration(value)}</div>}
          />
        </Grid>
        <Grid item xs={6}>
          <p>Plays (millions)</p>
          <Slider
            value={plays}
            min={0}
            max={1100000000}
            step={10000000}
            onChange={(e, newValue) => setPlays(newValue)}
            valueLabelDisplay='auto'
            valueLabelFormat={value => <div>{value / 1000000}</div>}
          />
        </Grid>
        {/* TODO (TASK 24): add sliders for danceability, energy, and valence (they should be all in the same row of the Grid) */}
        {/* Hint: consider what value xs should be to make them fit on the same row. Set max, min, and a reasonable step. Is valueLabelFormat is necessary? */}
        <Grid item xs={4}>
          <p>Danceability</p>
          <Slider
            value={danceability}
            min={0}
            max={1}
            step={0.05}
            onChange={(e, newValue) => setDanceability(newValue)}
            valueLabelDisplay='auto'
          />
        </Grid>
        <Grid item xs={4}>
          <p>Energy</p>
          <Slider
            value={energy}
            min={0}
            max={1}
            step={0.05}
            onChange={(e, newValue) => setEnergy(newValue)}
            valueLabelDisplay='auto'
          />
        </Grid>
        <Grid item xs={4}>
          <p>Valence</p>
          <Slider
            value={valence}
            min={0}
            max={1}
            step={0.05}
            onChange={(e, newValue) => setValence(newValue)}
            valueLabelDisplay='auto'
          />
        </Grid>
        </Grid>

        <Button variant="contained" onClick={() => search() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
          Search
        </Button>
      </div>

      {/* Notice how similar the DataGrid component is to our LazyTable! What are the differences? */}
      <DataGrid
        rows={companyInfo}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />
    </div>
  );
}
