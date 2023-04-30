import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button, Checkbox, Container, FormControlLabel, Grid, Link, Slider, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';

const config = require('../config.json');

export default function H1BCases(props) {
    const company_id = props.companyCases.companyId;
    console.log("company id is ", props.companyCases.companyId);

    const [pageSize, setPageSize] = useState(10);
    const [companyCases, setCompanyCases] = useState([]);
    const [companySummary, setCompanySummary] = useState([]);

    const [fullTime, setFullTime] = useState(true);
    const [caseStatus, setCaseStatus] = useState(true);
    const [submitDate, setSubmitDate] = useState(dayjs(null));
    const [decisionDate, setDecisionDate] =useState(dayjs(null));
    console.log("submitDate: " + submitDate);

    
    // useEffect(() => {
    //   fetch(`http://${config.server_host}:${config.server_port}/h1bCases/${company_id}`)
    //     .then((res) => res.json())
    //     .then((resJson) => {
    //       const h1bCasesWithId = resJson.map((cases) => ({
    //         id: cases.h1bCaseId,
    //         ...cases,
    //       }));
    //       setCompanyCases(h1bCasesWithId);
    //     });
    // }, []);

  //   const search = () => {
  //     fetch(`http://${config.server_host}:${config.server_port}/h1bCases/${company_id}?fullTime=${fullTime}
  //       &caseStatus=${caseStatus}&submitDate=${submitDate}&decisionDate=${decisionDate}`)
  //     .then(res => res.json())
  //     .then((resJson) => {
  //         const h1bCasesWithId = resJson.map((cases) => ({ id : cases.h1bCaseId, ...cases}));
  //       //   console.log("data: " + h1bCasesWithId);
  //         setCompanyCases(h1bCasesWithId);
  //     })


  // }

        useEffect(() => {
          Promise.all([
            fetch(`http://${config.server_host}:${config.server_port}/h1bCases/${company_id}`),
            fetch(`http://${config.server_host}:${config.server_port}/h1bSummary/${company_id}`),
          ])
            .then(([resCases, resSum]) => 
              Promise.all([resCases.json(), resSum.json()])
            )
            .then(([dataCases, dataSum]) => {
              const h1bCasesWithId = dataCases.map((cases) => ({
                id: cases.h1bCaseId,
                ...cases,
              }));
              setCompanyCases(h1bCasesWithId);

              if (dataSum.length > 0 && dataSum[0].companyId) {
                const h1bSummaryWithId = dataSum.map((summary) => ({ id : summary.companyId, ...summary}));
                setCompanySummary(h1bSummaryWithId);
              } else {
                setCompanySummary([]);
              }

            });
          }, []);
          
          console.log("company summary, ", companySummary, " and h1b cases ", companyCases);

        const search = () => {
          Promise.all([
            fetch(`http://${config.server_host}:${config.server_port}/h1bCases/${company_id}?fullTime=${fullTime}
            &caseStatus=${caseStatus}&submitDate=${submitDate}&decisionDate=${decisionDate}`),
            fetch(`http://${config.server_host}:${config.server_port}/h1bSummary/${company_id}?submitDate=${submitDate}&decisionDate=${decisionDate}`),
          ])
          .then(([resCases, resSummary]) => 
            Promise.all([resCases.json(), resSummary.json()])
          )
          .then(([dataCases, dataSummary]) => {
            const h1bCasesWithId = dataCases.map((cases) => ({ id : cases.h1bCaseId, ...cases}));
            //   console.log("data: " + h1bCasesWithId);
            setCompanyCases(h1bCasesWithId);

            if (dataSummary.length > 0 && dataSummary[0].companyId) {
              const h1bSummaryWithId = dataSummary.map((summary) => ({ id : summary.companyId, ...summary}));
              setCompanySummary(h1bSummaryWithId);
            } else {
              setCompanySummary([]);
            }

            console.log("company summary, ", companySummary);
          });
      }
  
      const casesColumns = [
        { field: 'empName', headerName: 'Employee Name', width: 120}, 
        { field: 'jobTitle', headerName: 'Job Title', width: 300},
        { field: 'fulltime', headerName: 'Full-Time' },
        { field: 'caseStatus', headerName: 'Case Status' },
        { field: 'caseYear', headerName: 'Case Year' },
        { field: 'submitDate', headerName: 'Case Submit Date', width: 150 },
        { field: 'decisionDate', headerName: 'Case Decision Date', width: 150},
        { field: 'wageFrom', headerName: 'Wage From' }
    ]

    const summaryColumns = [
      {field: 'numApproved', width: 225, headerName: 'Cases Approved'}, 
      { field: 'totalCases',  width: 225, headerName: 'Total Cases' },
      { field: 'approvalRate', width: 225, headerName: 'Approval Rate'}, 
      { field: 'numFullTimes', width: 225, headerName: 'Fulltime Cases'},
      { field: 'avgProcessTimeInDate', width: 245, headerName: 'Average Processing Time (Days)'}
    ]
  
    return (
      <div>
        <div style={{ margin: "2rem 0" }}>
          <Grid container spacing={3} style={{ margin: "2rem 0" }}>
            <Grid item xs={6}>
              <FormControlLabel
                label="Full Time"
                control={
                  <Checkbox
                    checked={fullTime}
                    onChange={(e) => setFullTime(e.target.checked)}
                  />
                }
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                label="Case Approved"
                control={
                  <Checkbox
                    checked={caseStatus}
                    onChange={(e) => setCaseStatus(e.target.checked)}
                  />
                }
              />
            </Grid>
            <Grid item xs={6}>
              <p>Submit Date</p>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                 <StaticDatePicker 
                    orientation="landscape" 
                    label="Submit Date picker"
                    value={submitDate}
                    onChange={(newValue) => setSubmitDate(newValue)}
                 />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={6}>
              <p>Decision Date</p>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                 <StaticDatePicker 
                    orientation="landscape" 
                    label="Decision Date picker"
                    value={decisionDate}
                    onChange={(newValue) => setDecisionDate(newValue)}
                 />
              </LocalizationProvider>
            </Grid>
          </Grid>

          <Button
            variant="contained"
            onClick={() => search()}
            style={{ left: "50%", transform: "translateX(-50%)" }}
          >
            Search
          </Button>
        </div>

        {/* Notice how similar the DataGrid component is to our LazyTable! What are the differences? */}
        <h3>H1B Stats Summary table</h3>
        <DataGrid
          rows={companySummary}
          columns={summaryColumns}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          autoHeight
        />

        <h3>H1B Cases </h3>
        <DataGrid
          rows={companyCases}
          columns={casesColumns}
          pageSize={pageSize}
          rowsPerPageOptions={[5, 10, 25]}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          autoHeight
        />
      </div>
    );
  }