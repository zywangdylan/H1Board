// backend server

const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const webapp = express();
webapp.use(cors({origin: '*',}));
// accept command line and json inputs
webapp.use(express.urlencoded({ extended: true }));
webapp.use(express.json());

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js
webapp.get('/', routes.welcome);
webapp.get('/user/:id', routes.getOneUser);
webapp.post('/user', routes.createOneUser);
webapp.get('/popularCompanies', routes.getPopularCompanies);
webapp.get('/highReviewCompanies/review', routes.getHRC_Review);
webapp.get('/highReviewCompanies/empSize', routes.getHRC_empSize);
webapp.get('/highReviewCompanies/caseAndReviewCount', routes.getHRC_caseAndReviewCount);
webapp.get('/highReviewCompanies/workLifeBalance', routes.getHRC_workLifeBal);
webapp.get('/highReviewCompanies/:numCompanies/:numLocations', routes.getHRC_numCompanyAndLocate);
webapp.get('/highReviewCompanies/companySizeAndCaseStatus/:numLocation', routes.getHRC_locateAndH1B);
webapp.get('/highReviewCompanies/:isFulltime', routes.getHRC_fullTimeAndH1B);
webapp.get('/highReviewCompanies/:numIndustries', routes.getHRC_industry);

webapp.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = webapp;
