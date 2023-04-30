// backend routes

const mysql = require("mysql");
const config = require("./config.json");
const jwt = require("jsonwebtoken");
const { subscribe } = require("./server");
const JWT_SECRET = config.JWT_SECRET;
// const { v4: uuidv4 } = require('uuid');

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db,
});
connection.connect((err) => err && console.log(err));

// Route 1: GET /user/:id
const getOneUser = async function (req, res) {
  // Retrieve userId from the parameters
  const id = req.params.id;

  // Check id is null or not
  if (id == null) res.status(404).send("The user id is not provided");

  // Write the query to retrieve the user's name and password
  const query = `
  SELECT name, password
  FROM AppUser
  WHERE userId = ${id}
  `;
  connection.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else if (data.length === 0) {
      console.log("User id ", String(id), " does not exist.");
      res.status(404).send("User id does not exist.");
    } else {
      res.json(data);
    }
  });
};

// Route 2: POST /user
const createOneUser = async function (req, res) {
  // Retrieve the name and password from the request body
  const username = req.body.name;
  const password = req.body.password;
  // could use UUID? or other way to generate unique BigInt ID
  // const userId = uuidv4();
  const userId = Date.now() + Math.floor(Math.random() * 100);

  // Check whether username or password is null or not
  if (username == null || password == null) {
    res.status(404).send("Missing username or password.");
  }

  // Generate jwt token and this token expired in 5 minutes
  const token = jwt.sign(
    {
      password: password,
    },
    JWT_SECRET,
    { expiresIn: "300s" }
  );

  // Insert one app user into the database
  const query = `INSERT INTO AppUser VALUES(${userId}, '${username}', '${token}')`;

  connection.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json({
        userId: userId,
        username: username,
        token: token,
      });
    }
  });
};

// GET /companies
const getAllCompanies = async function (req, res) {
  // GET all companies data with pagination
  const pageNum = req.query.pageNum ? req.query.pageNum : 1;
  const pageSize = req.query.pageSize ? req.query.pageSize : 10;

  const query = `
    SELECT *
    FROM Company
    LIMIT ${pageSize}
    OFFSET ${(pageNum - 1) * pageSize}
  `;

  connection.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
};

// GET /companies/:id
const getOneCompany = async function (req, res) {
  // Retrieve companyId from the parameters
  const id = req.params.id;

  // Check id is null or not
  if (id == null) res.status(404).send("The company id is not provided");

  // Write the query to retrieve the company's name and industry
  const query = `
  SELECT *
  FROM Company
  WHERE companyId = ${id}
  `;
  connection.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else if (data.length === 0) {
      console.log("Company id ", String(id), " does not exist.");
      res.status(404).send("Company id does not exist.");
    } else {
      res.json(data);
    }
  });
};

// Route 3: GET /popularCompanies
const getPopularCompanies = async function (req, res) {
  // Retrieve castStatus, wageFrom, and industry from query params
  const caseStatus = req.query.caseStatus ? req.query.caseStatus : "";
  const wageFrom = req.query.wageFrom ? req.query.wageFrom : 0.0;
  const industry = req.query.industry ? req.query.industry : "";

  const query = `SELECT
          c.name AS company_name,
          h.jobTitle,
          h.submitDate,
          i.industry
      FROM Company c
        INNER JOIN H1bCase h ON c.companyId = h.companyId
        INNER JOIN Industry i ON c.industryId = i.industryId
      WHERE ('${caseStatus}' = '' OR h.caseStatus = '${caseStatus}')
            AND h.wageFrom >= ${wageFrom}
            AND ('${industry}' = '' OR i.industry = '${industry}')
      LIMIT 100;
  `;

  connection.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
};

// Route 4: GET /companies/review, obtain company name and review with certain number of reviews and range of rating.
// Ordered in avg rating descending order
const getHRC_Review = async function (req, res) {
  // Retrieve castStatus, wageFrom, and industry from parameters
  const reviewNum = req.query.reviewNum ? req.query.reviewNum : 0;
  const ratingFloor = req.query.ratingFloor ? req.query.ratingFloor : 0.0;
  const ratingCeiling = req.query.ratingCeiling
    ? req.query.ratingCeiling
    : 100.0;

  const query = `WITH
        company_review_stats AS (
          SELECT
            companyId,
            COUNT(*) AS num_reviews,
            AVG(overallRating) AS avg_rating
          FROM Review
          GROUP BY companyId
          HAVING COUNT(*) >= ${reviewNum}
                 AND AVG(overallRating) >= ${ratingFloor}
                 AND AVG(overallRating) <= ${ratingCeiling})
      SELECT
        Company.name,
        company_review_stats.num_reviews,
        company_review_stats.avg_rating
      FROM Company
      JOIN company_review_stats ON Company.companyId = company_review_stats.companyId
      ORDER BY company_review_stats.avg_rating DESC;
  `;

  connection.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
};

// TODO: optimize slow query 5
// Route 5: GET /companies/empSize
const getHRC_empSize = async function (req, res) {
  // Retrieve castStatus, wageFrom, and industry from parameters
  const empSize = req.query.empSize ? req.query.empSize : 400;
  const ratingFloor = req.query.ratingFloor ? req.query.ratingFloor : 0.0;
  const ratingCeiling = req.query.ratingCeiling
    ? req.query.ratingCeiling
    : 100.0;

  const query = `WITH
        company_reviews AS (
          SELECT
            companyId,
            AVG(overallRating) AS avg_rating,
            COUNT(*) AS num_reviews
          FROM Review
          GROUP BY companyId
          HAVING AVG(overallRating) >= ${ratingFloor}
          AND AVG(overallRating) <= ${ratingCeiling}),
        company_locations AS (
          SELECT
            companyId,
            COUNT(DISTINCT locationId) AS num_locations
          FROM HasRole
          GROUP BY companyId),
        company_jobs AS (
          SELECT
            companyId,
            COUNT(DISTINCT jobId) AS num_jobs
          FROM HasRole
          GROUP BY companyId)
        SELECT
          Company.name AS company_name,
          Industry.industry,
          company_reviews.avg_rating,
          company_reviews.num_reviews,
          company_locations.num_locations,
          company_jobs.num_jobs
        FROM Company
        JOIN Industry ON Company.industryId = Industry.industryId
        JOIN company_reviews ON Company.companyId = company_reviews.companyId
        JOIN company_locations ON Company.companyId = company_locations.companyId
        JOIN company_jobs ON Company.companyId = company_jobs.companyId
        WHERE Company.employeeSize >= ${empSize}
        ORDER BY company_reviews.avg_rating DESC, company_reviews.num_reviews DESC;
  `;

  connection.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
};

// TODO: optimize slow query 6
// Route 6: GET /companies/h1bAndInterview
const getHRC_h1bAndInterview = async function (req, res) {
  const numInterviewReviews = req.query.numInterviewReviews
    ? req.query.numInterviewReviews
    : 0;
  const caseStatus = req.query.caseStatus ? req.query.caseStatus : "";

  const query = `WITH
        company_id as (
          SELECT
            IR.companyId
          FROM InterviewReview IR
          WHERE IR.difficulty IS NOT NULL
          GROUP BY IR.companyId
          HAVING COUNT(IR.companyId) > ${numInterviewReviews}),
        companies as (
          SELECT * FROM Company
          WHERE companyId IN (SELECT * FROM company_id))
        SELECT
          DISTINCT C.name,
          H.jobId,
          J.title
        FROM companies C
        JOIN (SELECT * FROM H1bCase
              WHERE ('${caseStatus}' = '' OR caseStatus = '${caseStatus}')) H ON C.companyId = H.companyId
        JOIN Job J ON H.jobId = J.jobId
        ORDER BY C.companyId ASC;
  `;

  connection.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
};

// Query 8
// Route 7: GET /companies/workLifeBalance
const getHRC_workLifeBal = async function (req, res) {
  const yearFloor = req.query.yearFloor ? req.query.yearFloor : 0;
  const yearCeiling = req.query.yearCeiling ? req.query.yearCeiling : 2025;
  const avfWlbRatingFloor = req.query.avfWlbRatingFloor
    ? req.query.avfWlbRatingFloor
    : 0;

  const query = `With
        wlf_review AS (
          SELECT
            companyId,
            AVG(workLifeBalance) AS workLifeBalance
          FROM Review
          GROUP BY companyId
          HAVING AVG(workLifeBalance) >= ${avfWlbRatingFloor}),
        companies_h1b_approve AS (
          SELECT
            DISTINCT c.companyId,
            c.name
          FROM Company c
          INNER JOIN H1bCase h ON c.companyId = h.companyId
          WHERE h.caseStatus = 'C'
          AND h.caseYear BETWEEN ${yearFloor} AND ${yearCeiling})

      SELECT
        W.companyId,
        C.name AS companyName,
        W.workLifeBalance
      FROM wlf_review W
      INNER JOIN companies_h1b_approve C ON W.companyId = C.companyId
      ORDER BY W.workLifeBalance DESC;
  `;

  connection.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
};

// Route 8: GET /companies/ratingAndCaseStatus, query 10
const getHRC_ratingAndCaseStatus = async function (req, res) {
  const ratingFloor = req.query.ratingFloor ? req.query.ratingFloor : 0;
  const ratingCeiling = req.query.ratingCeiling ? req.query.ratingCeiling : 100;
  const caseStatus = req.query.caseStatus ? req.query.caseStatus : "";

  const query = `WITH
        company_rateLess3 AS (
          SELECT
            companyId,
            AVG(overallRating) AS avg_rating
          FROM Review
          GROUP BY companyId
          HAVING AVG(overallRating) <= ${ratingCeiling}
          AND AVG(overallRating) >= ${ratingFloor})
      SELECT
        DISTINCT C.name,
        CRL.avg_rating,
        I.industry
      FROM Company C
      INNER JOIN company_rateLess3 CRL ON C.companyId = CRL.companyId
      INNER JOIN (
        SELECT companyId FROM H1bCase
        WHERE (caseStatus = '${caseStatus}' OR '${caseStatus}' = '')) H
      ON C.companyId = H.companyId
      INNER JOIN Industry I ON C.industryId = I.industryId
      ORDER BY CRL.avg_rating DESC;
  `;

  connection.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
};

// Route 9: /companies/locationAndFulltime
// List the places with the most companies (of a certain scale) offering fulltime jobs.
const getHRC_locationAndFulltime = async function (req, res) {
  const numCompanies = req.query.numCompanies ? req.query.numCompanies : 50;
  const numLocations = req.query.numLocations ? req.query.numLocations : 10;

  const query = `WITH
        fulltime_jobs AS (
          SELECT
            companyId,
            COUNT(*) AS num_jobs
          FROM HasRole
          JOIN Job ON HasRole.jobId = Job.jobId
          WHERE fulltime = 1
          GROUP BY companyId),

          top_companies AS (
            SELECT
              companyId,
              name,
              employeeSize,
              industry
            FROM Company
            WHERE companyId IN (SELECT companyId FROM fulltime_jobs)
            ORDER BY employeeSize DESC
            LIMIT ${numCompanies}),

          top_locations AS (
            SELECT
              locationId,
              city,
              state
            FROM Location
            WHERE locationId IN (
              SELECT locationId FROM HasRole
              WHERE companyId IN (
                SELECT companyId FROM top_companies))),

          location_counts AS (
            SELECT city, state, COUNT(*) AS num_companies FROM top_locations
            JOIN HasRole ON top_locations.locationId = HasRole.locationId
            JOIN top_companies ON HasRole.companyId = top_companies.companyId
            GROUP BY city, state)

        SELECT CONCAT(city, ', ', state) AS location, num_companies FROM location_counts
        ORDER BY num_companies DESC
        LIMIT ${numLocations};
  `;

  connection.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
};

// Route 10: Search locations by large company size and H1B
// GET /companies/locationAndApprovedH1b
const getHRC_locateAndH1B = async function (req, res) {
  const numLocations = req.query.numLocations ? req.query.numLocations : 10;

  const query = `WITH companies_10000 AS (
          SELECT DISTINCT c.companyId FROM Company c
          INNER JOIN H1bCase h ON c.companyId = h.companyId
          WHERE h.caseStatus = 'C'
                AND c.employeeSize = '10,000+'),

        location_ids AS (
          SELECT locationId FROM HasRole
          WHERE companyId IN (SELECT companyId FROM companies_10000)),

        locations AS (
          SELECT locationId, city, state
          FROM Location WHERE locationId IN (SELECT locationId FROM location_ids)),

        companyCountAtLocation AS (
          SELECT city, state, COUNT(*) AS num_companies
          FROM locations
          JOIN HasRole ON locations.locationId = HasRole.locationId
          JOIN companies_10000 ON HasRole.companyId = companies_10000.companyId
          GROUP BY city, state)

        SELECT
          CONCAT(city, ', ', state) AS location,
          num_companies
        FROM companyCountAtLocation
        ORDER BY num_companies DESC
        LIMIT ${numLocations};
  `;

  connection.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
};

// Route 11: Search jobs by H1B
// GET /companies/fullTimeAndApprovedH1B
const getHRC_fullTimeAndApprovedH1B = async function (req, res) {
  const isFullTime = req.query.isFullTime ? req.query.isFullTime : 0;

  const query = `With approvedH1B_part_time AS (
        SELECT
          DISTINCT H.companyId,
          H.jobId,
          H.jobTitle
        FROM H1bCase H
        WHERE H.fulltime = ${isFullTime} AND H.caseStatus = 'C'),

        job_location AS (
          SELECT
            DISTINCT L.state,
            L.city,
            H.jobId,
            H.companyId
          FROM Location L
          JOIN HasRole H ON L.locationId = H.locationId),

        approved_part_location AS (
          SELECT
            DISTINCT A.companyId,
            A.jobTitle,
            J.state,
            J.city
          FROM approvedH1B_part_time A
          JOIN job_location J ON A.jobId = J.jobId AND A.companyId = J.companyId)

        SELECT
          C.name AS company_name,
          A.jobTitle,
          CONCAT(A.city, ', ', A.state) AS location
        FROM Company C
        INNER JOIN approved_part_location A ON C.companyId = A.companyId;
  `;

  connection.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
};

// Route 12: Search industry by H1B
// GET /highReviewCompanies/:numIndustries
const getHRC_industryWithApprovedH1B = async function (req, res) {
  const numIndustries = req.query.numIndustries ? req.query.numIndustries : 5;
  const sinceYear = req.query.sinceYear ? req.query.sinceYear : 2012;

  const query = `WITH
        h1b_cases AS (
          SELECT
            companyId,
            COUNT(*) AS num_cases FROM H1bCase
          WHERE caseYear >= ${sinceYear}
          GROUP BY companyId),

        top_companies AS (
          SELECT companyId, name, employeeSize, industryId
          FROM Company
          WHERE companyId IN (SELECT companyId FROM h1b_cases)
          ORDER BY employeeSize DESC),

        top_industries AS (
          SELECT industryId, industry FROM Industry
          WHERE industryId IN (
            SELECT industryId FROM top_companies)),

        industry_counts AS (
          SELECT industry, COUNT(*) AS num_companies FROM top_industries
          JOIN top_companies ON top_industries.industryId = top_companies.industryId
          GROUP BY industry)

      SELECT industry, num_companies FROM industry_counts
      ORDER BY num_companies DESC
      LIMIT ${numIndustries};
  `;

  connection.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
};

// Routes 13: Backend welcome page
// GET /
const welcome = async function (req, res) {
  res.status(200).send("welcome to the backend.");
};

// Route 14: H1B summary
const getOneCompanyH1bSummary = async function (req, res) {
  // Retrieve companyId from the parameters
  const id = req.params.id;
  const wageFrom = req.query.wageFrom ? req.query.wageFrom : 0;

  // Check id is null or not
  if (id == null) res.status(404).send("The company id is not provided");

  // Write the query to retrieve the company's name and industry
  const query = `
  SELECT 
    companyId, 
    SUM(IF(caseStatus = 'C', 1, 0)) as numApproved,
    SUM(IF(wageFrom > ${wageFrom}, 1, 0)) as numWagesAbove,
    COUNT(*) as totalCases
  FROM H1bCase
  WHERE companyId = ${id}
  `;
  connection.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else if (data.length === 0) {
      console.log("Company id ", String(id), " does not exist.");
      res.status(404).send("Company id does not exist.");
    } else {
      res.json(data);
    }
  });
};

// Route 15: All H1B cases of a particular company
const getOneCompanyH1bCases = async function (req, res) {
  const id = req.params.id;
  var caseStatus = req.query.caseStatus ? req.query.caseStatus : "";
  var fullTime = req.query.fullTime ? req.query.fullTime : "";
  var dateFloor = req.query.submitDate
    ? convert(req.query.submitDate)
    : "2009-04-15";
  var dateCeil = req.query.decisionDate
    ? convert(req.query.decisionDate)
    : "2017-09-30";

  caseStatus = caseStatus == "false" ? "CW" : "C";
  if (fullTime != null) {
    fullTime = fullTime.trim() == "false" ? 0 : 1;
  }

  if (dateFloor == "NaN-aN-aN") dateFloor = "2011-04-15";
  if (dateCeil == "NaN-aN-aN") dateCeil = "2017-09-30";

  // Check id is null or not
  if (id == null) res.status(404).send("The company id is not provided");

  const query = `
  SELECT DISTINCT h1bCaseId, empName, jobTitle, fulltime, caseStatus, caseYear, Date_Format(submitDate,'%Y-%m-%d') As submitDate, Date_Format(decisionDate,'%Y-%m-%d') As decisionDate, wageFrom
  FROM H1bCase
  WHERE companyId = ${id}
    AND fulltime = ${fullTime}
    AND caseStatus = '${caseStatus}'
    AND submitDate > '${dateFloor}'
    AND decisionDate < '${dateCeil}'
  `;

  connection.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      console.log(data);
      res.json(data);
    }
  });
};

// Route 16: Get overall rating & summary of one company
const getOneCompanySummary = async function (req, res) {
  const id = req.params.id;
  const companyName = req.query.companyName ? req.query.companyName : '';

  // Check id is null or not
  if (id == null) res.status(404).send("The company id is not provided");

  const query = `
  WITH 
  company_reviews AS (
    SELECT companyId, AVG(overallRating) AS avg_rating, COUNT(*) AS num_reviews, textReview, workLifeBalance, compensationOrBenefits, jobSecurityOrAdvance, management, culture
    FROM Review
    GROUP BY companyId),
  company_stats AS (
    SELECT companyId,COUNT(DISTINCT jobId) AS num_jobs,COUNT(DISTINCT locationId) AS num_locations 
    FROM HasRole
    GROUP BY companyId)
  SELECT c.name AS company_name,
    Industry.industry,
    company_reviews.avg_rating,
    company_reviews.num_reviews,
    company_reviews.textReview,
    company_reviews.workLifeBalance,
    company_reviews.compensationOrBenefits,
    company_reviews.jobSecurityOrAdvance,
    company_reviews.management,
    company_reviews.culture,
    company_stats.num_locations,
    company_stats.num_jobs,
    company_stats.companyId
  FROM (SELECT name, industryId, companyId FROM Company) c
    JOIN Industry ON c.industryId = Industry.industryId
    JOIN company_reviews ON c.companyId = company_reviews.companyId
    JOIN company_stats ON c.companyId = company_stats.companyId
  WHERE (c.companyId = ${id} OR ${id} = '') AND (c.name = '${companyName}' OR '${companyName}' = '')
  ORDER BY company_reviews.avg_rating DESC, company_reviews.num_reviews DESC;
  `;

  connection.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      console.log(data);
      res.json(data);
    }
  });
};

// Route 17: Get locations and number of companies in that location
const getLocationAndNumCompanies = async function(req, res) {
  var caseStatus = req.query.caseStatus ? req.query.caseStatus : 'C';
  var empSize = req.query.empSize ? req.query.empSize : '10,000+';

  empSize = empSize.trim() == "10,000" ? "10,000+" : empSize;
  caseStatus = caseStatus == "false" ? "CW" : "C";

  const query = `
    WITH companies AS (SELECT DISTINCT c.companyId
      FROM Company c
             INNER JOIN H1bCase h ON c.companyId = h.companyId
      WHERE h.caseStatus = '${caseStatus}'
        AND c.employeeSize = '${empSize}'),

      location_ids AS (SELECT locationId
        FROM HasRole
        WHERE companyId IN (SELECT companyId FROM companies)),

      locations AS (SELECT locationId, city, state
        FROM Location
        WHERE locationId IN (SELECT locationId FROM location_ids)),

      companyCountAtLocation AS (SELECT city, state, COUNT(*) AS num_companies
           FROM locations
                    JOIN HasRole ON locations.locationId = HasRole.locationId
                    JOIN companies ON HasRole.companyId = companies.companyId
           GROUP BY city, state)

    SELECT CONCAT(city, ', ', state) AS location,
    num_companies
    FROM companyCountAtLocation
    ORDER BY num_companies DESC
  `
  connection.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      console.log(data);
      res.json(data);
    }
  });
}

function convert(str) {
  var date = new Date(str),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  return [date.getFullYear(), mnth, day].join("-");
}

module.exports = {
  getOneUser,
  createOneUser,
  getAllCompanies,
  getOneCompany,
  getPopularCompanies,
  getHRC_Review,
  getHRC_empSize,
  getHRC_h1bAndInterview,
  getHRC_workLifeBal,
  getHRC_ratingAndCaseStatus,
  getHRC_locationAndFulltime,
  getHRC_locateAndH1B,
  getHRC_fullTimeAndApprovedH1B,
  getHRC_industryWithApprovedH1B,
  welcome,
  getOneCompanyH1bSummary,
  getOneCompanyH1bCases,
  getOneCompanySummary,
  getLocationAndNumCompanies
};
