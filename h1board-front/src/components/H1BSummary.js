import { useState } from 'react';
import { Container, Button, Grid, Typography, Slider, Link } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { formatDuration } from '../helpers/formatter';
const config = require('../config.json');

export default function H1B(props) {
    const companyInfo = props;
    const company_id = props.companyInfo.companyId;
    const [pageSize, setPageSize] = useState(10);
    const [companySummary, setCompanySummary] = useState([]);

    const [wageFloor, setWageFloor] = useState(500000);
  
    const search = () => {
        fetch(`http://${config.server_host}:${config.server_port}/h1bSummary/${company_id}?wageFrom=${wageFloor}`)
        .then(res => res.json())
        .then((resJson) => {
            if (resJson.length > 0 && resJson[0].companyId) {
                const h1bSummaryWithId = resJson.map((summary) => ({ id : summary.companyId, ...summary}));
                setCompanySummary(h1bSummaryWithId);
            }
        })
    }
  
    const columns = [
        {field: 'numApproved', headerName: 'Cases Approved'}, 
        { field: 'totalCases', headerName: 'Total Cases' },
    ]

    return (
      <div>
        <div style={{margin: "2rem 0"}}>
          <Grid container spacing={3} style={{margin: "2rem 0"}}>
          <Grid item xs={6}>
            <p>Minimum Wage</p >
            <Slider
              value={wageFloor}
              min={0}
              max={500000}
              step={1000}
              onChange={(e, newValue) => setWageFloor(newValue)}
              valueLabelDisplay='auto'
              valueLabelFormat={value => <div>{value}</div>}
            />
          </Grid>
          </Grid>
  
          <Button variant="contained" onClick={() => search() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
            Search
          </Button>


        </div>
        {/* Notice how similar the DataGrid component is to our LazyTable! What are the differences? */}
            {companySummary &&
                <DataGrid
                    rows={companySummary}
                    columns={columns}
                    pageSize={pageSize}
                    rowsPerPageOptions={[5, 10, 25]}
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                    autoHeight
                />}
      </div>
    );
  }