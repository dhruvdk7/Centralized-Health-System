# CentralizedHealthSystem

## Overview

CHS is a centralized platform with role-based access can be a valuable tool in managing medical treatment. This enables healthcare providers to share information and collaborate on patient care while ensuring that only authorized personnel have access to sensitive information. Additionally, this platform helps preventing adverse reactions and over-dosage by monitoring patient data. Using such platform reduces the risk of errors in medical treatment.

## Requirements:

`NodeJS 18.13`

## Dependencies:

### WebAPI dependencies

- "body-parser": "^1.20.1",
- "chai": "^4.3.7",
- "chai-http": "^4.3.0",
- "cors": "^2.8.5",
- "crypto": "^1.0.1",
- "dotenv": "^16.0.3",
- "dotenv-safe": "^8.2.0",
- "express": "^4.18.2",
- "express-jwt": "^8.4.1",
- "express-validation": "^4.1.0",
- "joi": "^17.8.1",
- "jsonwebtoken": "^9.0.0",
- "mocha": "^10.2.0",
- "mysql2": "^3.1.2",
- "nodemailer": "^6.9.1",
- "sinon": "^15.0.3",
- "swagger-jsdoc": "^6.2.8",
- "swagger-ui-express": "^4.6.2"

### chsWebApp dependencies

- "@emotion/react": "^11.10.6",
- "@emotion/styled": "^11.10.6",
- "@fontsource/roboto": "^4.5.8",
- "@mui/icons-material": "^5.11.9",
- "@mui/material": "^5.11.12",
- "@mui/x-date-pickers": "^6.0.1",
- "@testing-library/jest-dom": "^5.16.5",
- "@testing-library/react": "^13.4.0",
- "@testing-library/user-event": "^13.5.0",
- "axios": "^1.3.3",
- "dayjs": "^1.11.7",
- "file-saver": "^2.0.5",
- "framer-motion": "^10.0.2",
- "html2canvas": "^1.4.1",
- "jspdf": "^2.5.1",
- "moment": "^2.29.4",
- "qrcode.react": "^3.1.0",
- "react": "^18.2.0",
- "react-datepicker": "^4.10.0",
- "react-dom": "^18.2.0",
- "react-redux": "^8.0.5",
- "react-router-dom": "^6.8.1",
- "react-scripts": "5.0.1",
- "redux": "^4.2.1",
- "redux-persist": "^6.0.0",
- "web-vitals": "^2.1.4"

## Build Steps:

**Setup:**

- Add the .env file in `CentralizedHealthSystemWebAPI/.config/` path. Take the reference from the .env.example file for which variables to include.

- Run `npm install` command to install the required dependencies.

- Start the backend server by running the `npm start` command.

**Scripts:**

- `npm start` : Starts the backend server.

- `npm test` : Runs the integration and unit test cases.

- `npm run coverage` : Runs all test cases and generates a coverage report.

**Env file and example file:**

- Repo contains the `.env.example` file in the `CentralizedHealthSystemWebAPI` folder.

- .env file needs to be added in the `CentralizedHealthSystemWebAPI/.config/.env` path.

Follow these steps to run the Web APP:

- Go to the CentralizedHealthSystemWebAPP/chswebapp directory

  `cd CentralizedHealthSystemWebAPI/chswebapp`

- Install the required dependencies

  `npm install`

- Start the server

  `npm start`

Runs the app in the development mode.

Open [http://localhost:3001](http://localhost:3001) to view it in your browser.

## User Scenarios

#### PATIENT

- Patient will be able to view and edit their basic details
- Patient can view and download health information and health card

#### DOCTOR

- Doctor will be able to create patient
- Doctor can search and view patient's details using QR code unique to the patient
- Add new patient by giving basic details
- Doctor will be able to add new prescription

#### PHARMACY

- Pharmacy will be able to view the 3 latest prescriptions of a user by using QR code

#### ADMIN

- Admin will view and make a decision whether to proceed with the user based on documents provided during documentation
