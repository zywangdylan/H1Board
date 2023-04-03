# H1Board Backend

## Technologies Used

List of the technologies used in the project, such as:

- Node.js
- Express
- AWS

## File Structure
```lua
├── src/
│   ├── controllers/
│   │   ├── userController.js
│   │   └── ...
│   ├── routes/
│   │   ├── userRoutes.js
│   │   └── ...
│   ├── app.js
│   ├── config.json
│   └── index.js
├── node_modules/
├── package-lock.json
├── package.json
└── README.md
```
- src/controllers/: Contains the controller files that handle the requests and responses between the routes and the services.
- src/routes/: Contains the route files that define the endpoints of the API and connect the controllers to the server.
- src/app.js: The main file that creates and configures the Express.js application.
- src/config.json: Configuration file for the application settings and environment variables.
- src/index.js: Entry point of the application that starts the server and listens for incoming requests.

## Installation

Instructions on how to install the project, such as:

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Set environment variables.
4. Run `npm start` to start the server.

## Configuration

**TODO:** Explanation of any configuration required, such as environment variables and API keys.

## API Documentation

Documentation of the API endpoints, parameters, and expected responses.

## Deployment

Explanation of how to deploy the project, such as:

1. Set environment variables on the deployment environment.
2. Run `npm install --production` to install dependencies.
3. Run `npm start` to start the server.
