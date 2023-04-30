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
          <Tab icon={<ArticleIcon />} label="H1B Cases" />
          <Tab icon={<RateReviewIcon />} label="Company Summary" />
        </Tabs>
      </div>

      {/* TODO: Create two components to demostrate 1. H1B Data (<H1B />) 2. Company Review (<CompanyReview />) */}
      <SwitchTransition>
        <CSSTransition
          key={tabValue}
          timeout={300}
          classNames="fade"
          nodeRef={currentNode}
          unmountOnExit
        >
          <div>
            { tabValue === 0 && <H1BCases companyCases = {companyInfo} /> }
            { tabValue === 1 && <CompanySummary companyInfo={companyInfo} /> }
          </div>
        </CSSTransition>
      </SwitchTransition>
    </Container>
  );
}
