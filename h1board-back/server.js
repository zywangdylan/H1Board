// backend server

const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const webapp = express();
webapp.use(cors({
  origin: ['http://localhost:3000','http://localhost:8080'],
  credentials : true
}));
// accept command line and json inputs
webapp.use(express.urlencoded({ extended: true }));
webapp.use(express.json());

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js
webapp.get('/', routes.welcome);
/**
 * Route 1, get user info
 *
 * @param {userId}
 * @return {username, password} on success
 */
webapp.get('/user/:id', routes.getOneUser);
/**
 * Route 2, create user
 *
 * @param {bodyParams}
 * @return {userId, username, token} on success
 */
webapp.post('/user', routes.createOneUser);

/**
 * Get all company Info
 * on approved or non-approved H1B cases with wage higher than a threshold, in a given industry
 *
 * @param {pageNum}
 * @param {pageSize}
 * @return {company_id, name, employeeSize, industry, industryId } on success
 */
 webapp.get('/companies', routes.getAllCompanies);

/**
 * Get all company Info
 * on approved or non-approved H1B cases with wage higher than a threshold, in a given industry
 *
 * @param {id}
 * @return {company_id, name, employeeSize, industry, industryId } on success
 */
webapp.get('/companies/:id', routes.getOneCompany);

webapp.post('/user/signup', routes.createOneUser);
/**
 * Get a company Id by name
 *
 * @param {name}
 * @return {company_id} on success
 */
webapp.get('/company', routes.getCompanyByName);

/**
 * Get all companies' name
 *
 * @return {name} on success
 */
webapp.get('/companiesName', routes.getCompaniesName);

/**
 * Route 3, query 1
 * Get stats (company name, title, submitDate, caseStatus, industry)
 * on approved or non-approved H1B cases with wage higher than a threshold, in a given industry
 *
 * @param {caseStatus}
 * @param {wageFrom}
 * @param {industry}
 * @return {company_name, job_title, submitDate, industry} on success
 */
webapp.get('/popularCompanies', routes.getPopularCompanies);
/**
 * Route 4, query 4
 * Obtain company name and review with certain number of reviews and range of rating.
 * Ordered in avg rating descending order
 *
 * @param {reviewNum}
 * @param {ratingFloor}
 * @param {ratingCeiling}
 * @return {company_name, num_reviews, avg_rating} on success
 */
webapp.get('/companies/review', routes.getHRC_Review);
/**
 * Route 5, query 5
 * Get company info with employeeSize larger than a threshold, and with
 * rating in a fixed range.
 *
 * @param {empSize}
 * @param {ratingFloor}
 * @param {ratingCeiling}
 * @return {company_name, industry, avg_rating, num_reviews, num_locations, num_jobs} on success
 */
webapp.get('/companies/empSize', routes.getHRC_empSize);
/**
 * Route 6, query 6
 * Get jobs and company info with enough interview review information,
 *  and has H1B cases (with status approved or not approved)
 *
 * @param {caseStatus}
 * @param {numInterviewReviews}
 * @return {company_name, jobId, jobTitle} on success
 */
webapp.get('/companies/h1bAndInterview', routes.getHRC_h1bAndInterview);
/**
 * Route 7. query 8
 * Obtain info on companies with good WLB in the past few years
 * Can be used to search for good WLB companies with H1B support
 *
 * @param {yearFloor}
 * @param {yearCeiling}
 * @param {avfWlbRatingFloor}
 * @return {companyId, companyName, wlb_rating} on success
 */
webapp.get('/companies/workLifeBalance', routes.getHRC_workLifeBal);
/**
 * Route 8, query 10
 * Obtain company and industry info for companies who rating falls in a given range,
 * and has H1B cases being approved or not.
 * Can be used to learn whether rating is related to H1B approval rate, or vice versa
 *
 * @param {caseStatus}
 * @param {ratingFloor}
 * @param {ratingCeiling}
 * @return {company_name, avg_rating, industry} on success
 */
webapp.get('/companies/ratingAndCaseStatus', routes.getHRC_ratingAndCaseStatus);
/**
 * Route 9, query 3
 * List the places with the most companies (of a certain scale) offering fulltime jobs.
 * Can be used to search for potential large employers with good H1B support
 *
 * @param {numLocations}
 * @return {location, numCompanies} on success
 */
webapp.get('/companies/locationAndFulltime', routes.getHRC_locationAndFulltime);
/**
 * Route 10, query 7
 * List locations with the most companies employing large number(10000+)
 * of employees with approved H1-B
 *
 * @param {numLocations}
 * @return {location, num_companies} on success
 */
webapp.get('/companies/locationAndApprovedH1b', routes.getHRC_locateAndH1B);
/**
 * Route 11, query 9
 * Find jobs that are approved of H1B, can be full-time or NOT.
 * Can be used to learn non-fulltime jobs that are approved of H1B
 *
 * @param {isFullTime}
 * @return {company_name, job_title, location} on success
 */
webapp.get('/companies/fullTimeAndApprovedH1b', routes.getHRC_fullTimeAndApprovedH1B);
/**
 * Route 12, query 2
 *
 * Get the top few industries with the most number of
 * companies whose employees are approved of H1B since a given year
 *
 * Can be used when searching for H1B-friendly industries
 *
 * @param {numIndustries}
 * @param {sinceYear}
 * @return {industry, num_companies} on success
 */
webapp.get('/companies/:industryAndApprovedH1b', routes.getHRC_industryWithApprovedH1B);
/**
 * Route 14
 *
 * Login user with the inputted name and password
 * Will not be logged in if name or password is incorrect
 *
 * @param {bodyParams}
 * @return {userId, username, token} on success
 */
webapp.post('/user/signin', routes.signinUser);


/**
 * Get all company Info
 * on approved or non-approved H1B cases with wage higher than a threshold, in a given industry
 *
 * @param {id}
 * @return {company_id, name, employeeSize, industry, industryId } on success
 */
webapp.get('/h1bSummary/:id', routes.getOneCompanyH1bSummary);

/**
 * Get a company's h1bcases Info
 *
 * @param {id}
 * @return {h1bCaseId, empName, jobTitle, fulltime,caseStatus,caseYear, submitDate, decisionDate, wageFrom } on success
 */
webapp.get('/h1bCases/:id', routes.getOneCompanyH1bCases);

/**
 * Get a company's h1bcases Info
 *
 * @param {id}
 * @return {company_name, industry, avg_rating, num_reviews, text_review, num_locations, num_jobs } on success
 */
webapp.get('/companySummary/:id', routes.getOneCompanySummary);

webapp.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = webapp;
