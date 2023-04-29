import { useEffect, useState, useRef } from 'react';
import { Button, Checkbox, Container, FormControlLabel, Grid, Link, Typography, Chip, Tabs, Tab } from '@mui/material';
import { useParams } from 'react-router-dom';
import RateReviewIcon from '@mui/icons-material/RateReview';
import ArticleIcon from '@mui/icons-material/Article';
import { SwitchTransition, CSSTransition } from "react-transition-group";

import H1B from '../components/H1B';
import CompanyReview from '../components/CompanyReview';

const config = require('../config.json');

export default function CompanyPage() {
  const { company_id } = useParams();
  const [companyInfo, setCompanyInfo] = useState({});
  const [tabValue, setTabValue] = useState(0);

  // TODO: Switch between tabs when user clicks on a tab (Maybe using router to switch between componets?)
  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/companies/${company_id}`)
      .then(res => res.json())
      .then((resJson) => setCompanyInfo(resJson[0]));
  }, []);

  return (
    <Container>
      <Typography variant="h3" style={{marginTop: '2rem'}}>{ companyInfo.name }</Typography>
      <Chip label={ companyInfo.industry } color="primary" />
      <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
        <Tabs value={tabValue} onChange={handleChangeTab} aria-label="icon label tabs example">
          <Tab icon={<ArticleIcon />} label="H1B Data" />
          <Tab icon={<RateReviewIcon />} label="Company Reviews" />
        </Tabs>
      </div>

      {/* TODO: Create two components to demostrate 1. H1B Data (<H1B />) 2. Company Review (<CompanyReview />) */}
      <SwitchTransition>
        <CSSTransition
            key={tabValue}
            timeout={300}
            classNames="fade"
            unmountOnExit
        >
          <div>
            { tabValue === 0 && <H1B companyInfo={companyInfo} /> }
            { tabValue === 1 && <CompanyReview companyInfo={companyInfo} /> }
          </div>
        </CSSTransition>
      </SwitchTransition>
    </Container>
  );
}