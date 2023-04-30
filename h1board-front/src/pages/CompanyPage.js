import { useEffect, useState, useRef } from 'react';
import { Container, Typography, Chip, Tabs, Tab } from '@mui/material';
import { useParams } from 'react-router-dom';
import RateReviewIcon from '@mui/icons-material/RateReview';
import ArticleIcon from '@mui/icons-material/Article';
import { SwitchTransition, CSSTransition } from "react-transition-group";

import H1BCases from '../components/H1BCases';
import CompanySummary from '../components/CompanySummary';

const config = require('../config.json');

export default function CompanyPage() {
  const { company_id } = useParams();
  const [companyInfo, setCompanyInfo] = useState({});
  const [tabValue, setTabValue] = useState(0);
  const currentNode = useRef(null);

  // Switch between tabs when user clicks on a tab
  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/companies/${company_id}`)
      .then(res => res.json())
      .then((resJson) => setCompanyInfo(resJson[0]));
  }, []);

  return (
    <Container style={{display: 'flex', flexDirection:'column', minHeight: '70vh'}}>
      <div style={{display: 'flex', flexDirection:'column'}}>
        <Typography variant="h3" style={{marginTop: '2rem'}}>{ companyInfo.name }</Typography>
        <Chip style={{maxWidth: '120px', marginTop: '0.5rem'}} label={ companyInfo.industry } color="primary" />
      </div>
      <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
        <Tabs value={tabValue} onChange={handleChangeTab} aria-label="icon label tabs example">
          <Tab icon={<RateReviewIcon />} label="Company Summary" />
          <Tab icon={<ArticleIcon />} label="H1B Cases" />
        </Tabs>
      </div>
      {/* Switching Tabs: Company Summary & H1B Case */}
      <SwitchTransition>
        <CSSTransition
          key={tabValue}
          timeout={300}
          classNames="fade"
          nodeRef={currentNode}
          unmountOnExit
        >
          <div style={{flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: 'center'}}>
            { tabValue === 0 && <CompanySummary companyInfo={companyInfo} /> }
            { tabValue === 1 && <H1BCases companyCases = {companyInfo} /> }
          </div>
        </CSSTransition>
      </SwitchTransition>
    </Container>
  );
}
