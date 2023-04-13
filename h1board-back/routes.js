// backend routes

const mysql = require('mysql');
const config = require('./config.json');
const jwt = require('jsonwebtoken');
const JWT_SECRET = config.JWT_SECRET;
// const { v4: uuidv4 } = require('uuid');

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});
connection.connect((err) => err && console.log(err));

// Route 1: GET /user/:id
const getOneUser = async function(req, res) {
  // Retrieve userId from the parameters
  const id = req.params.id;

  // Check id is null or not
  if (id == null) res.status(404).send('The user id is not provided');

  // Write the query to retrieve the user's name and password
  const query = `
  SELECT name, password
  FROM AppUser
  WHERE userId = ${id}
  `
  connection.query(query, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// Route 2: POST /user
const createOneUser = async function(req, res) {
  // Retrieve the name and password from the request body
  const username = req.body.name;
  const password = req.body.password;
  // could use UUID? or other way to generate unique BigInt ID
  // const userId = uuidv4();
  const userId = Date.now() + Math.floor(Math.random() * 100);

  // Check whether username or password is null or not
  if (username == null || password == null) {
    res.status(404).send('Missing username or password.');
  }

  // Generate jwt token and this token expired in 5 minutes
  const token = jwt.sign({
    password: password,
  }, JWT_SECRET, { expiresIn: '300s' });

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
}

// Route 3: GET /popularCompanies
const getPopularCompanies = async function(req, res) {
  // const song_id = req.params.song_id;
  // connection.query(`SELECT * FROM Songs WHERE song_id='${song_id}'`, (err, data) => {
  //   if (err || data.length === 0) {
  //     console.log(err);
  //     res.json({});
  //   } else {
  //     res.json(data[0]);
  //   }
  // });
}

// Route 4: GET /highReviewCompanies/review
const getHRC_Review = async function(req, res) {
  // // TODO (TASK 5): implement a route that given a album_id, returns all information about the album
  // const album_id = req.params.album_id;
  // connection.query(`SELECT album_id, title, release_date, thumbnail_url FROM Albums WHERE album_id='${album_id}'`, (err, data) => {
  //   if (err || data.length === 0) {
  //     console.log(err);
  //     res.json({});
  //   } else {
  //     res.json(data[0]);
  //   }
  // });
}

// Route 5: GET /highReviewCompanies/empSize
const getHRC_empSize = async function(req, res) {
  // TODO (TASK 6): implement a route that returns all albums ordered by release date (descending)
  // Note that in this case you will need to return multiple albums, so you will need to return an array of objects
  connection.query(`SELECT album_id, title, release_date, thumbnail_url FROM Albums ORDER BY release_date DESC`, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// Route 6: GET /highReviewCompanies/caseAndReviewCount
const getHRC_caseAndReviewCount = async function(req, res) {
  // // TODO (TASK 7): implement a route that given an album_id, returns all songs on that album ordered by track number (ascending)
  // const album_id = req.params.album_id;
  // connection.query(`SELECT song_id, title, number, duration, plays FROM Songs WHERE album_id='${album_id}' ORDER BY number ASC`, (err, data) => {
  //   if (err || data.length === 0) {
  //     console.log(err);
  //     res.json({});
  //   } else {
  //     res.json(data);
  //   }
  // });
}

// Route 7: GET /highReviewCompanies/workLifeBalance
const getHRC_workLifeBal = async function(req, res) {
  // const page = req.query.page;
  // // TODO (TASK 8): use the ternary (or nullish) operator to set the pageSize based on the query or default to 10
  // const pageSize = req.query.page_size ? req.query.page_size : 10;

  // if (!page) {
  //   // TODO (TASK 9)): query the database and return all songs ordered by number of plays (descending)
  //   // Hint: you will need to use a JOIN to get the album title as well
  //   const query = `
  //   SELECT Songs.song_id AS song_id, Songs.title AS title, Albums.album_id AS album_id, Albums.title AS album, Songs.plays AS plays
  //     FROM Songs
  //     JOIN Albums ON Songs.album_id = Albums.album_id
  //     ORDER BY plays DESC
  //   `;
  //   connection.query(query, (err, data) => {
  //     if (err || data.length === 0) {
  //       console.log(err);
  //       res.json({});
  //     } else {
  //       res.json(data);
  //     }
  //   });
  // } else {
  //   // TODO (TASK 10): reimplement TASK 9 with pagination
  //   // Hint: use LIMIT and OFFSET (see https://www.w3schools.com/php/php_mysql_select_limit.asp)
  //   const query = `
  //     SELECT Songs.song_id AS song_id, Songs.title AS title, Albums.album_id AS album_id, Albums.title AS album, Songs.plays AS plays
  //     FROM Songs
  //     JOIN Albums ON Songs.album_id = Albums.album_id
  //     ORDER BY plays DESC
  //     LIMIT ${pageSize}
  //     OFFSET ${(page - 1) * pageSize}
  //   `;
  //   connection.query(query, (err, data) => {
  //     if (err || data.length === 0) {
  //       console.log(err);
  //       res.json({});
  //     } else {
  //       res.json(data);
  //     }
  //   });
  // }
}

// Route 8: GET /highReviewCompanies/reviewRatingAndCaseStatus
const getHRC_reviewRateCaseStatus = async function(req, res) {
  // // TODO (TASK 11): return the top albums ordered by aggregate number of plays of all songs on the album (descending), with optional pagination (as in route 7)
  // // Hint: you will need to use a JOIN and aggregation to get the total plays of songs in an album
  // const page = req.query.page;
  // const pageSize = req.query.page_size ? req.query.page_size : 10;

  // let query = `
  //   SELECT Albums.album_id AS album_id, Albums.title AS title, SUM(Songs.plays) AS plays
  //   FROM Albums
  //   JOIN Songs ON Albums.album_id = Songs.album_id
  //   GROUP BY Albums.album_id
  //   ORDER BY plays DESC
  // `;

  // if (page) {
  //   query = `
  //     SELECT Albums.album_id, Albums.title, SUM(Songs.plays) AS plays
  //     FROM Albums
  //     JOIN Songs ON Albums.album_id = Songs.album_id
  //     GROUP BY Albums.album_id
  //     ORDER BY plays DESC
  //     LIMIT ${pageSize}
  //     OFFSET ${(page - 1) * pageSize}
  //   `;
  // }
  // connection.query(query, (err, data) => {
  //   if (err || data.length === 0) {
  //     console.log(err);
  //     res.json({});
  //   } else {
  //     res.json(data);
  //   }
  // });
}

// Route 9: /highReviewCompanies/:numCompanies/:numLocations
const getHRC_numCompanyAndLocate = async function(req, res) {
  // // TODO (TASK 12): return all songs that match the given search query with parameters defaulted to those specified in API spec ordered by title (ascending)
  // // Some default parameters have been provided for you, but you will need to fill in the rest
  // const title = req.query.title ?? '';
  // const durationLow = req.query.duration_low ?? 60;
  // const durationHigh = req.query.duration_high ?? 660;
  // const playsLow = req.query.plays_low ?? 0;
  // const playsHigh = req.query.plays_high ?? 1100000000;
  // const danceabilityLow = req.query.danceability_low ?? 0;
  // const danceabilityHigh = req.query.danceability_high ?? 1;
  // const energyLow = req.query.energy_low ?? 0;
  // const energyHigh = req.query.energy_high ?? 1;
  // const valenceLow = req.query.valence_low ?? 0;
  // const valenceHigh = req.query.valence_high ?? 1;
  // const explicit = req.query.explicit === 'true' ? 1 : 0;

  // const query = `
  //   SELECT * FROM Songs
  //   WHERE title LIKE '%${title}%'
  //   AND duration BETWEEN ${durationLow} AND ${durationHigh}
  //   AND plays BETWEEN ${playsLow} AND ${playsHigh}
  //   AND danceability BETWEEN ${danceabilityLow} AND ${danceabilityHigh}
  //   AND energy BETWEEN ${energyLow} AND ${energyHigh}
  //   AND valence BETWEEN ${valenceLow} AND ${valenceHigh}
  //   AND explicit <= ${explicit}
  //   Order By title ASC
  // `;

  // connection.query(query, (err, data) => {
  //   if (err || data.length === 0) {
  //     console.log(err);
  //     res.json({});
  //   } else {
  //     res.json(data);
  //   }
  // });
}

// Route 10: Search locations by large company size and H1B
// GET /highReviewCompanies/companySizeAndCaseStatus/:numLocations
const getHRC_locateAndH1B = async function(req, res) {

};

// Route 11: Search jobs by H1B
// GET /highReviewCompanies/:isFullTime
const getHRC_fullTimeAndH1B = async function(req, res) {

};

// Route 12: Search industry by H1B
// GET /highReviewCompanies/:numIndustries
const getHRC_industry = async function(req, res) {

};

// Routes 13: Backend welcome page
// GET /
const welcome = async function(req, res) {
  res.status(200).send('welcome to the backend.');
}

module.exports = {
  getOneUser,
  createOneUser,
  getPopularCompanies,
  getHRC_Review,
  getHRC_empSize,
  getHRC_caseAndReviewCount,
  getHRC_workLifeBal,
  getHRC_reviewRateCaseStatus,
  getHRC_numCompanyAndLocate,
  getHRC_locateAndH1B,
  getHRC_fullTimeAndH1B,
  getHRC_industry,
  welcome
}
