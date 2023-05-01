import * as React from 'react';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Button, Checkbox, FormControlLabel, Grid, Link, Typography, Backdrop, Fab, Box, Fade, useScrollTrigger } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useParams, useNavigate } from 'react-router-dom';
import ErrorIcon from '@mui/icons-material/Error';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import CircularProgress from '@mui/material/CircularProgress';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const config = require('../config.json');

function ScrollTop(props) {
  const { children, window } = props;

  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 200,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      '#back-to-top-anchor',
    );

    if (anchor) {
      anchor.scrollIntoView({
        block: 'center',
        behavior: 'smooth'
      });
    }
  };

  return (
    <Fade in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        {children}
      </Box>
    </Fade>
  );
}

export default function H1B(props) {
    const navigate = useNavigate();
    const { company_id } = useParams();

    const [openLoading, setOpenLoading] = useState(false);
    const [pageSize, setPageSize] = useState(10);
    const [companyCases, setCompanyCases] = useState([]);
    const [companySummary, setCompanySummary] = useState([]);

    const [fullTime, setFullTime] = useState(true);
    const [caseStatus, setCaseStatus] = useState(true);
    const [submitDate, setSubmitDate] = useState(dayjs('2009-04-01'));
    const [decisionDate, setDecisionDate] =useState(dayjs('2017-09-30'));
    const [noResult, setNoResult] = useState(false);

    useEffect(() => {
      setOpenLoading(true);
      Promise.all([
        fetch(`http://${config.server_host}:${config.server_port}/h1bCases/${company_id}`)
          .then(res => {
            if (res.status < 200 || res.status >= 400) {
              throw new Error(res.statusText);
            }
            return res
          }),
        fetch(`http://${config.server_host}:${config.server_port}/h1bSummary/${company_id}`)
          .then(res => {
            if (res.status < 200 || res.status >= 400) {
              throw new Error(res.statusText);
            }
            return res
          })
      ])
        .then(([resCases, resSum]) => Promise.all([resCases.json(), resSum.json()]))
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
          setOpenLoading(false)
        })
        .catch ((error) => {
          setNoResult(true);
          setOpenLoading(false)
          throw Error(error.message);
        });
    }, [company_id]);

    const search = () => {
      setOpenLoading(true)
      Promise.all([
          fetch(`http://${config.server_host}:${config.server_port}/h1bCases/${company_id}?fullTime=${fullTime}
          &caseStatus=${caseStatus}&submitDate=${submitDate}&decisionDate=${decisionDate}`)
          ,
          fetch(`http://${config.server_host}:${config.server_port}/h1bSummary/${company_id}?submitDate=${submitDate}&decisionDate=${decisionDate}`)
        ])
        .then(([resCases, resSummary]) => Promise.all([resCases.json(), resSummary.json()]))
        .then(([dataCases, dataSummary]) => {
          const h1bCasesWithId = dataCases.map((cases) => ({ id : cases.h1bCaseId, ...cases}));
          setCompanyCases(h1bCasesWithId);
          if (dataSummary.length > 0 && dataSummary[0].currentCompany) {
            const h1bSummaryWithId = dataSummary.map((summary) => ({ id : summary.currentCompany, ...summary}));
            setCompanySummary(h1bSummaryWithId);
          } else {
            setCompanySummary([]);
          }

          setOpenLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setOpenLoading(false);
          setCompanyCases([]);
          setCompanySummary([]);
        })
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
      { field: 'numApproved', width: 225, headerName: 'Cases Approved'},
      { field: 'totalCases',  width: 225, headerName: 'Total Cases' },
      { field: 'approvalRate', width: 225, headerName: 'Approval Rate'},
      { field: 'numFullTimes', width: 225, headerName: 'Fulltime Cases'},
      { field: 'avgProcessTimeInDate', width: 245, headerName: 'Average Processing Time (Days)'}
    ]

    const summaryOthersColumns = [
      { field: 'numApprovedInOthers', width: 225, headerName: 'Cases Approved'},
      { field: 'totalCasesInOthers',  width: 225, headerName: 'Total Cases' },
      { field: 'approvalRateInOthers', width: 225, headerName: 'Approval Rate'},
      { field: 'numFullTimesInOthers', width: 225, headerName: 'Fulltime Cases'},
      { field: 'avgProcessTimeInDateInOthers', width: 245, headerName: 'Average Processing Time (Days)'}
    ]

    return (
      <div style={{ width: "100%", marginBottom: "4rem" }}>
        {
          noResult ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: 'center'}}>
              <ErrorIcon style={{ fontSize: 42 }} />
              <Typography variant="h4">Company Not Found</Typography>
              <Link
                component="button"
                variant="body2"
                onClick={() => {
                  navigate('/companies', { replace: true });
                }}
                style={{ marginTop: "1rem", display: 'flex', alignItems: 'center' }}
              >
                <KeyboardArrowLeftIcon /> Go Back to Companies Page
              </Link>
            </div>
          ) : (
            <div style={{ margin: "0 4rem" }}>
              <div style={{ margin: "2rem 0" }}>
                <Grid container spacing={3} style={{ margin: "2rem 0", width: "100%" }}>
                  <Grid item xs={5} style={{ display: "flex", flexDirection: "column" }}>
                    <FormControlLabel
                      label="Full Time"
                      control={
                        <Checkbox
                          checked={fullTime}
                          onChange={(e) => setFullTime(e.target.checked)}
                        />
                      }
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Submit Date"
                        value={submitDate}
                        defaultValue={dayjs('2009-04-01')}
                        minDate={dayjs('2009-04-01', 'YYYY-MM-DD')}
                        maxDate={dayjs('2017-09-30', 'YYYY-MM-DD')}
                        onChange={(newValue) => setSubmitDate(newValue)}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={5} style={{ display: "flex", flexDirection: "column" }}>
                    <FormControlLabel
                      label="Case Approved"
                      control={
                        <Checkbox
                          checked={caseStatus}
                          onChange={(e) => setCaseStatus(e.target.checked)}
                        />
                      }
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                          defaultValue={dayjs('2017-09-30')}
                          minDate={dayjs('2009-04-01', 'YYYY-MM-DD')}
                          maxDate={dayjs('2017-09-30', 'YYYY-MM-DD')}
                          label="Decision Date"
                          value={decisionDate}
                          onChange={(newValue) => setDecisionDate(newValue)}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={2} style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <Button
                      variant="contained"
                      onClick={() => search()}
                      style={{ left: "50%", transform: "translateX(-50%)" }}
                    >
                      Search
                    </Button>
                  </Grid>
                </Grid>
              </div>

              <h3>Company H1B Stats Summary </h3>
              <DataGrid
                rows={companySummary}
                columns={summaryColumns}
                pageSize={pageSize}
                rowsPerPageOptions={[5, 10, 25]}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                autoHeight
              />

              <h3>Industry H1B Stats Summary</h3>
              <DataGrid
                rows={companySummary}
                columns={summaryOthersColumns}
                pageSize={pageSize}
                rowsPerPageOptions={[5, 10, 25]}
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
          )
        }
      <ScrollTop {...props}>
        <Fab size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={openLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    );
  }
