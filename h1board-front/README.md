# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## File Structure
- src: This folder typically contains all the source code for the project.
    - components: This folder contains all the reusable UI components used in the project.
        - Modal
            - LoginModal: Standard login and Google login
            - SingupModal: Sign up a new user
        - Logout: Logout the current user
        - CompanySummary: Stats and ratings summary of one company
        - H1BCases: H1B stats of one company
        - NavBar: Navigation bar at the top of the page that can navigate to different pages
    - pages: This folder contains all the main pages/views of the project.
        - CompaniesPage: Display all companies' name and empSize with pagination
        - CompanyPage: Single company page with two tabs (CompanySummary and H1BCases components)
        - HomePage: Search page with autocomplete implemented
    - assets: This folder contains all the static assets used in the project, such as images, fonts, and stylesheets.
    - helpers: This folder contains all the utility functions and modules used throughout the project.
    - services: This folder contains all the services and API clients used to fetch data from a backend server.
    - App.js: This file is the main entry point for the React application, containing the root component and routing configuration.
    - index.js: This file is the entry point for the entire project, importing and rendering the main React application.
- public: This folder contains all the static assets that are publicly accessible, such as the index.html file and favicon.ico.
- package.json: This file contains metadata about the project and its dependencies, as well as scripts for building, testing, and running the project.
- package-lock.json: This file is generated automatically by npm to lock down the exact versions of dependencies installed in the project.

## React Components
- useState (https://react.dev/reference/react/useState) - https://react.dev/reference/react/useState
- useEffect (https://react.dev/reference/react/useEffect) - useEffect is a React Hook that lets you synchronize a component with an external system.
- useRef (https://react.dev/reference/react/useRef) - useRef is a React Hook that lets you reference a value that’s not needed for rendering.
## External Packages
- Material UI (https://material-ui.com/) - React components for faster and easier web development
- Recharts (https://recharts.org/en-US/) - A composable charting library built on React components
- react-transition-group (https://reactcommunity.org/react-transition-group/) - An easy way to perform animations when a React component enters or leaves the DOM
- react-router-dom (https://www.npmjs.com/package/react-router-dom) - bindings for using React Router in web applications
- dayjs (https://www.npmjs.com/package/dayjs) - Day.js is a minimalist JavaScript library that parses, validates, manipulates, and displays dates and times for modern browsers with a largely Moment.js-compatible API
- jwt_decode (https://www.npmjs.com/package/jwt-decode) - jwt-decode is a small browser library that helps decoding JWTs token which are Base64Url encoded.
- google-maps-react (https://www.npmjs.com/package/google-maps-react) - A declarative Google Map React component using React, lazy-loading dependencies, current-location finder and a test-driven approach by the Fullstack React team.

## Installation

Instructions on how to install the project, such as:

1. Clone the repository.
2. Run `npm install` to install dependencies. (`npm install --force google-maps-react` for `google-maps-react` dependency)
3. Run `npm start` to start the server.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
