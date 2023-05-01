# H1Board Backend

## Technologies Used

List of the technologies used in the project, such as:

- Node.js
- Express
- AWS
- MySQL

## File Structure
```lua
├── server.js
├── routes.js
├── config.json
├── node_modules/
├── package-lock.json
├── package.json
└── README.md
```
- routes: Contains the route files that define the endpoints of the API and connect the controllers to the server.
- server:  Entry point of the application that starts the server and listens for incoming requests.
- src/config.json: Configuration file for the application settings and environment variables.

## Installation

Instructions on how to install the project, such as:

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Run `npm start` to start the server.

## API Documentation  
## Application User (Route 1 - 2)
___
### Route 1: Get One Application User  
### Functionality    

This route returns statistics about a user’s information (id, name, password).

### Request Path

`GET /users/:id`

### Request Parameters

- `id` : the current user id that is searching for

### Query Parameters

None

### Response Parameters

- `userName` (string): name of the user
- `userPassword` (string): password of the user
___
### Route 2: Create an Application User

### Functionality

This route create a user in the database.

### Request Path

`POST /user`

### Query Parameters

None

### Request Parameters

- `user_name` (string): name of the user to be created
- `password` (string): password for the new user

### Response Parameters

- `id` (int): id of the user
- `token` (string): authentication token for the user(jwt)
- `userName` (string): name of the user
___
## Company (Route 3 - 10)

### Route 3: All H1B cases of one company

### Functionality

This route returns all H1B cases of a single company  

### Request Path

`GET /h1bCases/:id`

### Request Paramters

-  `id` (int) : id of the company

### Query Parameters

- `caseStatus` (boolean): case approved or not
- `fullTime` (booelan): the position is fulltime or part-time
- `dateFloor` (Date): the submit date of one h1b case
- `dateCeil` (Date): the decision date of one h1b case

### Response Parameters

- `h1bCaseId` (int): id of the case
- `empName` (String): the name of the company
- `jobTitle` (String): title of the job
- `fullTime` (boolean): the position is fulltime or part-time
- `caseStatus` (boolean): case approved or not
- `caseYear` (String): the year of the case submitted
- `submitDate` (Date): the submit date of one h1b case
- `decisionDate` (Date): the decision date of one h1b case
- `wageFrom` (String): starting salary

___

### Route 4: H1B summary

### Functionality
This route returns one company's H1B stats

### Request Path

`GET /h1bSummary/:id`

### Request Parameters

-  `id` (int) : id of the company

### Query Parameters

- `wageFrom` (String): starting salary

### Response Parameters

- `companyId`(int): id of the company
- `numApproved`(int): number of approved cases
- `numWagesAbove` (int): number of cases where its wage if above the user input wage
- `totalCases` (int): total h1b cases of the company
---

### Route 5: Popular H1B Companies

### Functionality

This route returns the name of the company, the job title, and the submit date for 100 H1B cases that have been approved(C) and have a wage range from `wageFrom`. Additionally, show the industry name of each company, and only include companies in the "Computers and Electronics" or "Healthcare" industries.

### Request Path

`GET /companies/popular`

### Request Parameters

None

### Query Parameters

- `caseStatus` (boolean): status of the case
- `wageFrom` (String): salary starting from
- `industry` (String): the industry name

### Response Parameters

- `id` (String): Identifier of the popular companies
- `companyName` (string): name of the company
- `jobTitle` (string): the related job title
- `submitDate` (string): submit date of the H1B cases
- `industryName` (string): the name of the industry that the company locate
___
### Route 6: Search Companies by Review

### Functionality

This route returns all companies that have at least a certain amount of reviews and an overall rating between a range.

### Request Path

`GET /companies/review`

### Request Parameters

None

### Query Parameters

- `reviewNum` : the number of reviews
- `ratingFloor` : the lower bound of the rating range
- `ratingCeiling` : the higher bound of the rating range

### Response Parameters

- `id` (String): Identifier of the companies
- `reviewNum` (int): number of reviews for this company
- `companyName` (string): name of the company
- `employeeSize` (int): number of employees in the company
- `industryName` (string): name of the industry the company in
- `rank` (int): the rank company under the current search
- `ratingAvg` (float): the average rating score under the scope
___
### Route 7: Search Companies by employee size

### Functionality

This route returns all companies that have an employee size range from the search input.

### Request Path

`GET /companies/empSize`

### Request Parameters

None

### Query Parameters

- `employeeSizeFloor` : the lower bound of the employee size
- `employeeSizeCeiling` : the higher bound of the employee size

### Response Parameters

- `id` (String): Identifier of the companies
- `reviewNum` (int): number of reviews for this company
- `companyName` (string): name of the company
- `employeeSize` (int): number of employees in the company
- `industryName` (string): name of the industry the company in
___
### Route 8: Search Companies with H1B case and number of reviews

### Functionality

This route returns the companies that have more than a certain amount of interview reviews and the h1b cases have been approved (user defined) in the past.

### Request Path

`GET /companies/caseAndReviewCount`

### Request Parameters

None

### Query Parameters

- `numInterviewReviews` : the number of interview reviews received by this company
- `caseStatus` : the status of the case
    
    

### Response Parameters

- `id` (String): Identifier of the companies
- `companyName` (string): name of the company
- `reviewNum` (int): number of reviews for this company
___
### Route 9: Search Companies with H1-B support by Work-life Balance

### Functionality

This route returns the companies that have a work-life balance value within a range. These companies also have H1B cases that have been approved in the last certain amount of years.

### Request Path

`GET /companies/workLifeBalance`

### Request Parameters

None

### Query Parameters

- `yearFloor` : the lower bound of the year range of search
- `yearCeiling` : the higher bound of the year range of search
- `avgWlbRatingFloor`: the lower bound of average work life balance score

### Response Parameters

- `id` (String): Identifier of the companies
- `companyName` (string): name of the company
- `workLifeBalanceRating` (float): average work life balance of the company
___
### Route 10: Search Companies by reviews rating and H1B

### Functionality

This route returns all companies that have an overall rating within a range and still get or not get h1b cases approved.

### Request Path

`GET /companies/reviewRatingAndCaseStatus`

### Request Parameters

None

### Query Parameters

- `ratingFloor` : the lower bound of the rating range
- `ratingCeiling` : the higher bound of the rating range
- `caseStatus` : the status of the case

### Response Parameters

- `id` (String): Identifier of the companies
- `companyName` (string): name of the company
- `rating` (int): company rating
- `industryName` (string): name of the industry the company in
___
## Location (Route 11 - 12)

### Route 11: Search locations by job openings

### Functionality

This route returns the top `numLocations` locations and the number of companies that have job openings for full-time positions.

### Request Path

`GET /locations/fullTimePos`

### Request Parameters

None

### Query Parameters

- `numLocations`: the number of locations to consider

### Response Parameters

- `id`(String): location ID
- `location` (string): location
- `numCompanies`(int): number of companies with full-time job openings in a particular location
___
### Route 12: Search locations by large company size and H1B

### Functionality

This route returns the top `numLocation` locations and the number of companies that have more than `numEmployeesFloor` employees and got H1b approvals in the past.

### Request Path

`GET /locations/numEmployeesAndH1B`

### Request Parameters

None

### Query Parameters

- `numLocations`: the number of locations to search
- `numEmployeesFloor`: lower bound of number of employees with approved H1-Bs in the company

### Response Parameters

- `id` (String): Identifier of the location
- `location` (string): location name
- `numCompanies`(int): number of companies with full-time job openings in a particular location
___
## Job (Route 13)

### Route 13: Search jobs by H1B

### Functionality

This route returns jobs that might or might not be full-time but have been approved of H1B. Display these jobs’ title and the companies’ name and location.

### Request Path

`GET /jobs`

### Query Parameters

- `isFulltime`: specifies whether the job is full time or not.

### Response Parameters

- `id` (String): Identifier of the job
- `jobTitle` (String): job title
- `isFulltime` (Bool): whether the job was full-time or not
- `companyName` (string): name of the company
- `employeeSize` (string): number of employees in the company
- `location`(String): location of the job
___
## Industry (Route 14)

### Route 14: Search industry by  H1B

### Functionality

This route returns the top `numIndustries` industries with the most number of companies that have received H1B visas in the last `year` years

### Request Path

`GET /industry/H1B`

### Request Parameters

None

### Query Parameters

- `numIndustries`: number of top industries to display in result
- `year`: year range to search

### Response Parameters

- `id` (String): Identifier of the industry
- `industry`(String): name of the industry
- `numCompanies`(int): number of companies in each industry

## Deployment

Explanation of how to deploy the project, such as:

1. Set environment variables on the deployment environment.
2. Run `npm install --production` to install dependencies.
3. Run `npm start` to start the server.
